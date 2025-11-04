/**
 * Performance measurement utilities for y0f-terminal optimization
 */

interface PerformanceMetrics {
  // Timing metrics
  firstPaint?: number
  firstContentfulPaint?: number
  largestContentfulPaint?: number
  timeToInteractive?: number
  totalBlockingTime?: number

  // Bundle metrics
  initialBundleSize?: number
  terminalChunkSize?: number
  gamesChunkSize?: number

  // Runtime metrics
  terminalMountTime?: number
  commandExecutionTime?: number
  themeChangeTime?: number
  animationFrameDrops?: number
  memoryUsage?: number

  // User experience
  inputLag?: number
  scrollPerformance?: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {}
  private marks: Map<string, number> = new Map()
  private measures: Map<string, number[]> = new Map()

  constructor() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      this.setupObservers()
    }
  }

  private setupObservers() {
    // Observe paint timing
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-paint') {
              this.metrics.firstPaint = entry.startTime
            } else if (entry.name === 'first-contentful-paint') {
              this.metrics.firstContentfulPaint = entry.startTime
            }
          }
        })
        paintObserver.observe({ entryTypes: ['paint'] })

        // Observe LCP
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
            renderTime?: number
            loadTime?: number
          }
          this.metrics.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime || 0
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        // PerformanceObserver not supported
        console.warn('PerformanceObserver not supported:', e)
      }
    }
  }

  /**
   * Mark the start of a performance measurement
   */
  mark(name: string) {
    this.marks.set(name, performance.now())
  }

  /**
   * Measure the time since a mark was set
   */
  measure(name: string): number {
    const startTime = this.marks.get(name)
    if (!startTime) {
      console.warn(`No mark found for: ${name}`)
      return 0
    }

    const duration = performance.now() - startTime
    this.marks.delete(name)

    // Store measure
    if (!this.measures.has(name)) {
      this.measures.set(name, [])
    }
    this.measures.get(name)!.push(duration)

    return duration
  }

  /**
   * Get average time for a specific measure
   */
  getAverageMeasure(name: string): number {
    const measurements = this.measures.get(name)
    if (!measurements || measurements.length === 0) return 0

    const sum = measurements.reduce((a, b) => a + b, 0)
    return sum / measurements.length
  }

  /**
   * Set a metric value
   */
  setMetric(key: keyof PerformanceMetrics, value: number) {
    this.metrics[key] = value
  }

  /**
   * Get current metrics snapshot
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Get memory usage if available
   */
  getMemoryUsage(): number | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
    }
    return null
  }

  /**
   * Measure bundle sizes from network requests
   */
  async measureBundleSizes() {
    if (!('performance' in window)) return

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]

    let totalSize = 0
    let terminalSize = 0
    let gamesSize = 0

    for (const resource of resources) {
      if (resource.name.includes('.js')) {
        const size = resource.transferSize || resource.encodedBodySize || 0
        totalSize += size

        if (resource.name.includes('terminal')) {
          terminalSize += size
        } else if (resource.name.includes('games')) {
          gamesSize += size
        }
      }
    }

    this.metrics.initialBundleSize = totalSize / 1024 // KB
    this.metrics.terminalChunkSize = terminalSize / 1024 // KB
    this.metrics.gamesChunkSize = gamesSize / 1024 // KB
  }

  /**
   * Log current metrics to console (development only)
   */
  logMetrics() {
    if (import.meta.env.DEV) {
      console.group('🎯 Performance Metrics')
      console.table(this.metrics)

      if (this.measures.size > 0) {
        console.group('📊 Measurements')
        const measureData: Record<string, string> = {}
        this.measures.forEach((values, name) => {
          const avg = values.reduce((a, b) => a + b, 0) / values.length
          measureData[name] = `${avg.toFixed(2)}ms (${values.length} samples)`
        })
        console.table(measureData)
        console.groupEnd()
      }

      const memory = this.getMemoryUsage()
      if (memory) {
        console.log(`💾 Memory Usage: ${memory.toFixed(2)} MB`)
      }

      console.groupEnd()
    }
  }

  /**
   * Export metrics as JSON for reporting
   */
  exportMetrics(): string {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      measurements: Object.fromEntries(
        Array.from(this.measures.entries()).map(([name, values]) => [
          name,
          {
            average: values.reduce((a, b) => a + b, 0) / values.length,
            samples: values.length,
            values,
          },
        ]),
      ),
      memory: this.getMemoryUsage(),
    }

    return JSON.stringify(data, null, 2)
  }

  /**
   * Reset all metrics and measurements
   */
  reset() {
    this.metrics = {}
    this.marks.clear()
    this.measures.clear()
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Convenience functions
export const markPerformance = (name: string) => performanceMonitor.mark(name)
export const measurePerformance = (name: string) => performanceMonitor.measure(name)
export const logPerformanceMetrics = () => performanceMonitor.logMetrics()

// Auto-measure bundle sizes on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.measureBundleSizes()
      performanceMonitor.logMetrics()
    }, 1000)
  })
}

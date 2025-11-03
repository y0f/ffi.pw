/**
 * @fileoverview Error boundary component for terminal games
 * Prevents game crashes from breaking the entire terminal
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { formatText, formatHeader, formatDivider } from '../core/formatters'
import type { OutputObject } from '../core/Command'

interface Props {
  children: ReactNode
  gameName: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onExit?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Game "${this.props.gameName}" crashed:`, error, errorInfo)

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onExit) {
      this.props.onExit()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='p-4 bg-black rounded'>
          <div className='text-red-500 font-mono'>
            <div className='text-xl mb-2'>⚠️ Game Crashed</div>
            <div className='text-sm text-red-400 mb-4'>
              The game "{this.props.gameName}" encountered an error and had to stop.
            </div>
            {this.state.error && (
              <div className='text-xs text-gray-500 mb-4 p-2 bg-gray-900 rounded overflow-x-auto'>
                <div className='font-bold mb-1'>Error Details:</div>
                <div>{this.state.error.toString()}</div>
                {this.state.error.stack && (
                  <pre className='mt-2 text-xs opacity-50'>
                    {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                  </pre>
                )}
              </div>
            )}
            <div className='flex gap-4'>
              <button
                onClick={this.handleReset}
                className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors'
              >
                Exit Game
              </button>
              <button
                onClick={() => window.location.reload()}
                className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors'
              >
                Reload Terminal
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook to wrap game components with error boundary
 */
export function withGameErrorBoundary<P extends object>(
  GameComponent: React.ComponentType<P>,
  gameName: string,
) {
  return React.forwardRef<any, P>((props: P, ref) => {
    const handleError = (error: Error, errorInfo: ErrorInfo) => {
      console.error(`Game error in ${gameName}:`, { error, errorInfo })
    }

    const handleExit = () => {
      if ('onExit' in props && typeof props.onExit === 'function') {
        props.onExit()
      }
    }

    return (
      <GameErrorBoundary gameName={gameName} onError={handleError} onExit={handleExit}>
        <GameComponent {...props} ref={ref} />
      </GameErrorBoundary>
    )
  })
}

/**
 * Create error output for terminal display
 */
export function createGameErrorOutput(gameName: string, error: Error): OutputObject[] {
  return [
    formatHeader('GAME ERROR'),
    formatDivider(),
    formatText(`Game "${gameName}" crashed unexpectedly`, 'text-red-500'),
    formatText(''),
    formatText('Error details:', 'text-yellow-500'),
    formatText(error.toString(), 'text-red-400 text-sm'),
    formatText(''),
    formatText('Please try restarting the game or reload the terminal.', 'text-gray-400'),
    formatDivider(),
  ]
}

import { createCommand, CommandCategory, type OutputObject } from '../../core/Command'
import {
  formatHeader,
  formatText,
  formatMultiPart,
  formatThickDivider,
  formatThinDivider,
} from '../../core/formatters'

const CRYPTO_CACHE_TTL = 5 * 60 * 1000
const CRYPTO_CACHE_KEY = 'crypto_price_cache'
const LAST_REQUEST_KEY = 'crypto_last_request'
const MIN_REQUEST_INTERVAL = 10 * 1000

interface CryptoInfo {
  symbol: string
  name: string
  color: string
}

interface CryptoPriceData {
  eur: number
  eur_24h_change: number
  eur_market_cap: number
  eur_24h_vol: number
  last_updated_at: number
}

interface GlobalData {
  total_market_cap?: { eur: number }
  total_volume?: { eur: number }
  market_cap_percentage?: { btc: number }
}

interface CachedData {
  data: Record<string, CryptoPriceData>
  globalData: GlobalData
  timestamp: Date
}

const SUPPORTED_CRYPTOS: Record<string, CryptoInfo> = {
  bitcoin: { symbol: 'BTC', name: 'Bitcoin', color: 'text-orange-400' },
  ethereum: { symbol: 'ETH', name: 'Ethereum', color: 'text-blue-400' },
  ripple: { symbol: 'XRP', name: 'Ripple', color: 'text-gray-400' },
  dogecoin: { symbol: 'DOGE', name: 'Dogecoin', color: 'text-yellow-400' },
}

function getCachedData(): CachedData | null {
  try {
    const cached = localStorage.getItem(CRYPTO_CACHE_KEY)
    if (!cached) return null
    const parsed = JSON.parse(cached) as CachedData
    parsed.timestamp = new Date(parsed.timestamp)
    return parsed
  } catch {
    return null
  }
}

function setCachedData(data: CachedData): void {
  try {
    localStorage.setItem(CRYPTO_CACHE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error writing crypto cache:', error)
  }
}

function canMakeRequest(): boolean {
  try {
    const lastRequest = localStorage.getItem(LAST_REQUEST_KEY)
    if (!lastRequest) return true
    return Date.now() - parseInt(lastRequest, 10) >= MIN_REQUEST_INTERVAL
  } catch {
    return true
  }
}

function setLastRequestTime(): void {
  try {
    localStorage.setItem(LAST_REQUEST_KEY, Date.now().toString())
  } catch (error) {
    console.error('Error setting last request time:', error)
  }
}

async function refreshCryptoData(): Promise<CachedData> {
  const cryptoIds = Object.keys(SUPPORTED_CRYPTOS).join(',')

  const [cryptoResponse, globalResponse] = await Promise.all([
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=eur&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`,
      { headers: { Accept: 'application/json' }, mode: 'cors' },
    ),
    fetch('https://api.coingecko.com/api/v3/global', {
      headers: { Accept: 'application/json' },
      mode: 'cors',
    }),
  ])

  if (!cryptoResponse.ok || !globalResponse.ok) {
    throw new Error(`API request failed: ${cryptoResponse.status} ${globalResponse.status}`)
  }

  const [data, globalData] = await Promise.all([cryptoResponse.json(), globalResponse.json()])

  const newCache: CachedData = {
    data: data as Record<string, CryptoPriceData>,
    globalData: (globalData as { data: GlobalData }).data,
    timestamp: new Date(),
  }

  setCachedData(newCache)
  return newCache
}

function formatPrice(price: number | undefined): string {
  if (!price) return '€---'
  return price.toLocaleString('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: price < 1 ? 4 : 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  })
}

function formatLargeNumber(num: number | undefined): string {
  if (!num || num === 0) return '€0'
  if (num >= 1e12) return '€' + (num / 1e12).toFixed(2) + 'T'
  if (num >= 1e9) return '€' + (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return '€' + (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return '€' + (num / 1e3).toFixed(2) + 'K'
  return '€' + num.toFixed(2)
}

function formatCryptoOutput(cache: CachedData): OutputObject[] {
  const output: OutputObject[] = [
    formatHeader('CRYPTOCURRENCY MARKET DATA', 'text-green-400'),
    formatThickDivider(),
  ]

  if (cache.globalData && cache.globalData.total_market_cap) {
    const totalMarketCap = cache.globalData.total_market_cap?.eur || 0
    const totalVolume = cache.globalData.total_volume?.eur || 0
    const btcDominance = cache.globalData.market_cap_percentage?.btc || 0

    output.push(
      formatMultiPart([
        { text: 'Total Market Cap: ', color: 'text-gray-500' },
        { text: formatLargeNumber(totalMarketCap), color: 'text-cyan-400' },
        { text: '  |  ', color: 'text-white/20' },
        { text: '24h Volume: ', color: 'text-gray-500' },
        { text: formatLargeNumber(totalVolume), color: 'text-purple-400' },
        { text: '  |  ', color: 'text-white/20' },
        { text: 'BTC Dominance: ', color: 'text-gray-500' },
        { text: `${btcDominance.toFixed(1)}%`, color: 'text-orange-400' },
      ]),
      formatThinDivider(),
    )
  }

  output.push(
    formatMultiPart([
      { text: 'ASSET', color: 'text-gray-500' },
      { text: '    PRICE (EUR)', color: 'text-gray-500' },
      { text: '   24H %', color: 'text-gray-500' },
      { text: '       24H VOLUME', color: 'text-gray-500' },
      { text: '     MARKET CAP', color: 'text-gray-500' },
      { text: '   DOMINANCE', color: 'text-gray-500' },
    ]),
    formatThinDivider(),
  )

  const totalCap = Object.keys(SUPPORTED_CRYPTOS).reduce((sum, id) => {
    return sum + (cache.data?.[id]?.eur_market_cap || 0)
  }, 0)

  for (const [id, crypto] of Object.entries(SUPPORTED_CRYPTOS)) {
    const data = cache.data?.[id]
    if (data) {
      const price = formatPrice(data.eur)
      const change = data.eur_24h_change?.toFixed(2) || '0.00'
      const changeColor = data.eur_24h_change >= 0 ? 'text-green-500' : 'text-red-500'
      const changeSymbol = data.eur_24h_change >= 0 ? '↑' : '↓'
      const volume = formatLargeNumber(data.eur_24h_vol || 0)
      const marketCap = formatLargeNumber(data.eur_market_cap || 0)
      const dominance =
        totalCap > 0 ? (((data.eur_market_cap || 0) / totalCap) * 100).toFixed(1) : '0.0'

      output.push(
        formatMultiPart([
          { text: crypto.symbol.padEnd(6), color: crypto.color },
          { text: price.padStart(14), color: 'text-gray-200' },
          { text: ' ', color: 'text-gray-200' },
          {
            text: `${changeSymbol}${Math.abs(parseFloat(change))}%`.padStart(8),
            color: changeColor,
          },
          { text: ' ', color: 'text-gray-200' },
          { text: volume.padStart(13), color: 'text-blue-300' },
          { text: ' ', color: 'text-gray-200' },
          { text: marketCap.padStart(14), color: 'text-gray-400' },
          { text: ' ', color: 'text-gray-200' },
          { text: `${dominance}%`.padStart(11), color: 'text-purple-300' },
        ]),
      )
    }
  }

  const cacheAge = cache.timestamp ? Math.floor((Date.now() - cache.timestamp.getTime()) / 1000) : 0
  const ageText =
    cacheAge < 60
      ? `${cacheAge}s ago`
      : cacheAge < 3600
        ? `${Math.floor(cacheAge / 60)}m ago`
        : `${Math.floor(cacheAge / 3600)}h ago`

  output.push(
    formatThickDivider(),
    formatText(
      `Last updated: ${cache.timestamp?.toLocaleTimeString('en-GB', { timeZone: 'Europe/Amsterdam' }) || 'unknown'} (${ageText})`,
      'text-gray-500',
    ),
    formatText(' '),
    formatText('Want to accept crypto payments? I can help with that!', 'text-gray-400'),
  )

  return output
}

export const crypto = createCommand({
  name: 'crypto',
  description: 'Display current cryptocurrency prices and market data',
  category: CommandCategory.INFO,
  usage: 'crypto',

  execute: async () => {
    const now = new Date()
    const cachedData = getCachedData()

    const isCacheValid =
      cachedData &&
      cachedData.timestamp &&
      now.getTime() - cachedData.timestamp.getTime() < CRYPTO_CACHE_TTL &&
      Object.keys(cachedData.data).length > 0

    if (isCacheValid) {
      return formatCryptoOutput(cachedData)
    }

    if (!canMakeRequest()) {
      if (cachedData && Object.keys(cachedData.data).length > 0) {
        return [
          formatText('Please wait a moment - showing cached data', 'text-yellow-500'),
          ...formatCryptoOutput(cachedData),
        ]
      }
      return [
        formatText('Please wait a moment before checking again', 'text-yellow-500'),
        formatText('(10 seconds minimum between requests)', 'text-gray-500'),
      ]
    }

    try {
      setLastRequestTime()
      const newData = await refreshCryptoData()
      return formatCryptoOutput(newData)
    } catch (error) {
      console.error('Failed to fetch crypto data:', error)

      if (cachedData && Object.keys(cachedData.data).length > 0) {
        return [
          formatText('Failed to refresh prices - showing cached data', 'text-yellow-500'),
          ...formatCryptoOutput(cachedData),
        ]
      }

      return [
        formatText('Failed to fetch crypto prices', 'text-red-500'),
        formatText('CoinGecko API may be unavailable or rate limited', 'text-yellow-500'),
        formatText('Please try again later', 'text-gray-400'),
      ]
    }
  },
})

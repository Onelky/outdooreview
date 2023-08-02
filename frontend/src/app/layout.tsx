'use client'
import { Roboto } from 'next/font/google'
import { ReactNode, useState } from 'react'
import theme from '@/lib/theme'
import { ThemeProvider } from '@mui/material/styles'
import createCache, { Options } from '@emotion/cache'
import { useServerInsertedHTML } from 'next/navigation'
import { CacheProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { MainLayout } from '@/components/Layout'

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '500', '700'] })

type ThemeRegistryType = {
  options: Options
  children: ReactNode
}
function ThemeRegistry(props: ThemeRegistryType) {
  const { options, children } = props

  const [{ cache, flush }] = useState(() => {
    const cache = createCache(options)
    cache.compat = true
    const prevInsert = cache.insert
    let inserted: string[] = []
    cache.insert = (...args) => {
      const serialized = args[1]
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name)
      }
      return prevInsert(...args)
    }
    const flush = () => {
      const prevInserted = inserted
      inserted = []
      return prevInserted
    }
    return { cache, flush }
  })

  useServerInsertedHTML(() => {
    const names = flush()
    if (names.length === 0) {
      return null
    }
    let styles = ''
    for (const name of names) {
      styles += cache.inserted[name]
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles
        }}
      />
    )
  })

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  )
}
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeRegistry options={{ key: 'mui-theme' }}>
          <MainLayout>{children}</MainLayout>
        </ThemeRegistry>
      </body>
    </html>
  )
}

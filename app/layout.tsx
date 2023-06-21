import {  Global_context_provider } from './context/global_context'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RR Weather Forecast',
  description: 'Live Weather information with mean weather information for next 5 days',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Global_context_provider>
      <body className={inter.className}>
        {children}
      </body>
      </Global_context_provider>
    </html>
  )
}

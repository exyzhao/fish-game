import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { WebSocketProvider } from './context/WebSocketContext'
import Header from './components/Header'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <WebSocketProvider>
        {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
        <body className="bg-zinc-100 text-lg text-zinc-700">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Header />
            {children}
          </div>
        </body>
      </WebSocketProvider>
    </html>
  )
}

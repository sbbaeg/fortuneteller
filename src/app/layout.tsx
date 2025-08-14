import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '포춘텔러 - 당신의 운세를 알려드립니다',
  description: '타로카드와 함께하는 운세 상담',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
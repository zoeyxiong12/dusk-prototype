import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WorkLog',
  description: '个人工作记录与报告生成工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={geist.className}>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-hidden min-w-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
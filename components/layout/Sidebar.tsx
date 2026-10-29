'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: '看板', icon: '⊞' },
  { href: '/today', label: '今日记录', icon: '✏️' },
]

const reportItems = [
  { href: '/reports/daily', label: '日报', icon: '📅' },
  { href: '/reports/weekly', label: '周报', icon: '📄' },
  { href: '/reports/monthly', label: '月报', icon: '📊' },
]

const systemItems = [
  { href: '/calendar', label: '日历', icon: '🗓' },
  { href: '/settings', label: '设置', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()

  const NavLink = ({ href, label, icon }: { href: string; label: string; icon: string }) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 px-4 py-1.5 text-sm transition-colors ${
          isActive
            ? 'bg-white text-gray-900 font-medium border-r-2 border-purple-600'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span className="text-sm">{icon}</span>
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <aside className="w-[148px] bg-gray-100 border-r border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-gray-200 mb-1.5">
        <p className="text-sm font-semibold text-gray-900">WorkLog</p>
        <span className="text-xs text-gray-400">工作驾驶舱</span>
      </div>

      {/* 主导航 */}
      <div className="flex flex-col gap-0.5">
        {navItems.map(item => (
          <NavLink key={item.href} {...item} />
        ))}
      </div>

      {/* 报告 */}
      <div className="mt-2">
        <div className="px-4 py-1 text-xs text-gray-400 tracking-wider">报告</div>
        <div className="flex flex-col gap-0.5">
          {reportItems.map(item => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </div>

      {/* 系统 */}
      <div className="mt-2">
        <div className="px-4 py-1 text-xs text-gray-400 tracking-wider">系统</div>
        <div className="flex flex-col gap-0.5">
          {systemItems.map(item => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </div>
    </aside>
  )
}
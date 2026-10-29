'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const projectData = [
  { name: '小双项目', value: 18, color: '#534AB7' },
  { name: '战斗系统', value: 12, color: '#1D9E75' },
  { name: '数值系统', value: 9, color: '#EF9F27' },
  { name: '角色系统', value: 6, color: '#D85A30' },
  { name: '事务', value: 2, color: '#888780' },
]

const urgentTasks = [
  { name: '小双项目 · 16角色美需文档', project: '小双项目', ddl: '周五', urgency: 'red' },
  { name: '战斗系统验收清单', project: '战斗系统', ddl: '下周一', urgency: 'yellow' },
  { name: '数值配置 bug 排查', project: '数值系统', ddl: '下周三', urgency: 'yellow' },
  { name: '角色反馈整理 · Q2汇总', project: '角色系统', ddl: '5月底', urgency: 'green' },
  { name: 'Demo 测试报告 · 新手引导', project: '新手引导', ddl: '5月底', urgency: 'green' },
]

const urgencyStyle = {
  red: { bar: 'bg-red-400', tag: 'bg-red-50 text-red-600' },
  yellow: { bar: 'bg-yellow-400', tag: 'bg-yellow-50 text-yellow-600' },
  green: { bar: 'bg-green-400', tag: 'bg-green-50 text-green-700' },
}

// 2026年5月日历数据
const recordedDays = [1,2,5,6,7,8,9,11,12,13,14,15,18,19,20]
const ddlDays = [15, 22, 29]
const today = 12
const startDow = 5 // 5月1日是周五，周日起始时index=5
const totalDays = 31

export default function Dashboard() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
  const weekStr = `第${Math.ceil(now.getDate() / 7) + 18}周`

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* 顶부 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
        <div>
          <p className="text-base font-semibold text-gray-900">看板</p>
          <p className="text-xs text-gray-400">{dateStr} · {weekStr}</p>
        </div>
        <Link
          href="/today"
          className="bg-purple-600 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5"
        >
          + 记录今天
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {/* Metric 卡片 */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:'12px'}}>
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">本周完成</p>
            <p className="text-2xl font-semibold text-gray-900">12</p>
            <p className="text-xs text-green-600 mt-0.5">↑ 较上周 +3</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">进行中</p>
            <p className="text-2xl font-semibold text-gray-900">5</p>
            <p className="text-xs text-gray-400 mt-0.5">跨 3 个项目</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">临期 DDL</p>
            <p className="text-2xl font-semibold text-red-600">2</p>
            <p className="text-xs text-red-500 mt-0.5">3天内到期</p>
          </div>
        </div>

        {/* 中部两列 */}
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'12px'}}>
          {/* 左：临期任务 */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-900">临期任务</p>
              <span className="text-xs text-gray-400">按 DDL 排序</span>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {urgentTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0">
                  <div className={`w-0.5 h-8 rounded-full flex-shrink-0 ${urgencyStyle[task.urgency as keyof typeof urgencyStyle].bar}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{task.name}</p>
                    <p className="text-xs text-gray-400">{task.project}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${urgencyStyle[task.urgency as keyof typeof urgencyStyle].tag}`}>
                    {task.ddl}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 右：项目分布 + 月历 */}
          <div className="flex flex-col gap-3">
            {/* 项目分布环形图 */}
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-gray-900">项目精力分布</p>
                <span className="text-xs text-gray-400">本月 47 条</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={projectData}
                    cx="40%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={52}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {projectData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} 条`, '']} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconSize={8}
                    iconType="square"
                    formatter={(value) => (
                      <span style={{ fontSize: '10px', color: '#6b7280' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 月历缩略图 */}
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-900">5月日历</p>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-sm bg-green-200 inline-block" />已记录
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />DDL
                  </span>
                </div>
              </div>
              <MiniCalendar
                recordedDays={recordedDays}
                ddlDays={ddlDays}
                today={today}
                startDow={startDow}
                totalDays={totalDays}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniCalendar({ recordedDays, ddlDays, today, startDow, totalDays }: {
  recordedDays: number[]
  ddlDays: number[]
  today: number
  startDow: number
  totalDays: number
}) {
  const dayLabels = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:'4px'}}>
        {dayLabels.map(d => (
          <div key={d} className="text-center text-xs text-gray-400">{d}</div>
        ))}
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px'}}>
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`empty-${i}`} className="h-6" />
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const d = i + 1
          const col = (startDow + i) % 7
          const isWeekend = col === 0 || col === 6
          const hasRecord = recordedDays.includes(d)
          const hasDdl = ddlDays.includes(d)
          const isToday = d === today

          return (
            <Link href="/calendar" key={d}>
              <div className={`h-6 rounded text-center flex flex-col items-center justify-center relative cursor-pointer
                ${isToday ? 'outline outline-1 outline-purple-500' : ''}
                ${hasDdl ? 'bg-red-50' : hasRecord ? 'bg-green-50' : isWeekend ? 'bg-gray-100' : 'bg-gray-50'}
                hover:opacity-70 transition-opacity
              `}>
                <span className={`text-xs leading-none
                  ${isToday ? 'text-purple-600 font-semibold' : hasDdl ? 'text-red-500 font-medium' : hasRecord ? 'text-green-700' : 'text-gray-400'}
                `}>{d}</span>
                {hasDdl && (
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-red-400" />
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
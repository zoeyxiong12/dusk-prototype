'use client'

import { useState } from 'react'

interface Entry {
  id: string
  name: string
  project: string
  task_type: string
  status: string
  priority: string
  progress: string
  blocker: string | null
  ddl: string | null
}

const statusStyle: Record<string, { bg: string; text: string }> = {
  已完成: { bg: 'bg-green-50', text: 'text-green-700' },
  进行中: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
  暂停: { bg: 'bg-gray-100', text: 'text-gray-500' },
}

const priorityStyle: Record<string, { bg: string; text: string }> = {
  高: { bg: 'bg-red-50', text: 'text-red-600' },
  中: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
  低: { bg: 'bg-green-50', text: 'text-green-700' },
}

const mockEntries: Record<number, Entry[]> = {
  11: [
    { id: '1', name: '小双项目 · 16角色美需文档', project: '小双项目', task_type: '需求文档', status: '进行中', priority: '高', progress: '完成 60%', blocker: '等待参考图', ddl: '5月15日' },
    { id: '2', name: 'QA对接会议 · 战斗系统验收', project: '战斗系统', task_type: '会议', status: '已完成', priority: '高', progress: '完成对接', blocker: null, ddl: null },
    { id: '3', name: '数值配置 bug 排查', project: '数值系统', task_type: '数据配置', status: '进行中', priority: '中', progress: '定位问题', blocker: '待修复', ddl: null },
  ],
  12: [
    { id: '4', name: '小双项目 · 美需文档推进', project: '小双项目', task_type: '需求文档', status: '进行中', priority: '高', progress: '完成 80%', blocker: null, ddl: '5月15日' },
    { id: '5', name: '角色反馈整理', project: '角色系统', task_type: '角色反馈', status: '进行中', priority: '中', progress: '完成50%', blocker: null, ddl: null },
  ],
  13: [
    { id: '6', name: '小双项目 · 美需文档定稿', project: '小双项目', task_type: '需求文档', status: '已完成', priority: '高', progress: '全部完成', blocker: null, ddl: null },
    { id: '7', name: '战斗系统 demo 测试', project: '战斗系统', task_type: 'demo测试', status: '已完成', priority: '高', progress: '通过测试', blocker: null, ddl: null },
  ],
  7: [
    { id: '8', name: '战斗系统数值复盘', project: '战斗系统', task_type: '需求文档', status: '已完成', priority: '中', progress: '复盘完成', blocker: null, ddl: null },
    { id: '9', name: '周报撰写', project: '事务', task_type: '事务', status: '已完成', priority: '低', progress: '已提交', blocker: null, ddl: null },
  ],
}

const recordedDays = [1, 2, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 18, 19, 20]
const ddlDays = [15, 22, 29]
const today = 12
const START_DOW = 5 // 2026年5月1日是周五，周日起始index=5
const TOTAL_DAYS = 31
const DAY_LABELS = ['日', '一', '二', '三', '四', '五', '六']
const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const handleDayClick = (d: number) => {
    setSelectedDay(prev => prev === d ? null : d)
  }

  const selectedEntries = selectedDay ? (mockEntries[selectedDay] || []) : []
  const col = (d: number) => (START_DOW + d - 1) % 7
  const isWeekend = (d: number) => { const c = col(d); return c === 0 || c === 6 }

  const Tag = ({ label, style }: { label: string; style: { bg: string; text: string } }) => (
    <span className={`text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${style.bg} ${style.text}`}>
      {label}
    </span>
  )

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* 顶部 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
        <p className="text-base font-semibold text-gray-900">日历</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-green-100 inline-block border border-green-200" />已记录
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />DDL
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2.5 h-2.5 rounded-sm inline-block border-2 border-purple-500" />今天
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-600 font-medium">2026年5月</span>
            <button className="border border-gray-200 rounded p-1 text-gray-400 hover:text-gray-600 text-xs">‹</button>
            <button className="border border-gray-200 rounded p-1 text-gray-400 hover:text-gray-600 text-xs">›</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {/* 月历 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {/* 表头 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '3px', marginBottom: '6px' }}>
            {DAY_LABELS.map((d, i) => (
              <div key={d} className={`text-center text-xs font-medium py-1 ${i === 0 || i === 6 ? 'text-gray-300' : 'text-gray-400'}`}>
                {d}
              </div>
            ))}
          </div>

          {/* 日期格子 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '3px' }}>
            {Array.from({ length: START_DOW }).map((_, i) => (
              <div key={`empty-${i}`} style={{ height: '56px' }} />
            ))}
            {Array.from({ length: TOTAL_DAYS }).map((_, i) => {
              const d = i + 1
              const hasRecord = recordedDays.includes(d)
              const hasDdl = ddlDays.includes(d)
              const isToday = d === today
              const isSelected = d === selectedDay
              const weekend = isWeekend(d)

              let bg = weekend ? '#ECEAE3' : '#F5F4F0'
              if (isSelected) bg = '#EEEDFE'
              else if (hasDdl) bg = '#FEF2F2'
              else if (hasRecord) bg = '#F0FDF4'

              return (
                <div
                  key={d}
                  onClick={() => handleDayClick(d)}
                  style={{
                    height: '56px', borderRadius: '6px', background: bg,
                    cursor: 'pointer', padding: '5px 6px',
                    position: 'relative', display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-start', justifyContent: 'flex-start',
                    outline: isSelected || isToday ? `2px solid ${isSelected ? '#7c3aed' : '#7c3aed'}` : 'none',
                    outlineOffset: '-2px', transition: 'opacity 0.1s',
                  }}
                  className="hover:opacity-75"
                >
                  <span style={{
                    fontSize: '12px', fontWeight: isToday || isSelected ? '600' : '500',
                    color: isSelected ? '#5b21b6' : isToday ? '#5b21b6' : hasDdl ? '#dc2626' : hasRecord ? '#15803d' : weekend ? '#9ca3af' : '#374151',
                    lineHeight: 1,
                  }}>
                    {d}
                  </span>
                  {hasDdl && (
                    <div style={{
                      position: 'absolute', top: '5px', right: '5px',
                      width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444'
                    }} />
                  )}
                  {hasRecord && !hasDdl && (
                    <div style={{
                      position: 'absolute', bottom: '4px', right: '4px',
                      fontSize: '9px', fontWeight: '500', color: '#15803d',
                      background: '#dcfce7', padding: '1px 3px', borderRadius: '3px'
                    }}>
                      {mockEntries[d]?.length || ''}条
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 底部月度统计 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '8px' }}>
          {[
            { label: '已记录天数', value: '14' },
            { label: '工作条目', value: '38' },
            { label: 'DDL节点', value: '3' },
            { label: '进行中项目', value: '4' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-3 py-2.5">
              <p className="text-lg font-semibold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 选中日期详情 */}
        {selectedDay && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  5月{selectedDay}日，{DAY_NAMES[col(selectedDay)]}
                </span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {selectedEntries.length} 条记录
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs bg-purple-600 text-white px-2.5 py-1.5 rounded-lg font-medium hover:bg-purple-700">
                  + 添加
                </button>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-xs border border-gray-200 text-gray-400 px-2 py-1.5 rounded-lg hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {selectedEntries.length === 0 ? (
              <div className="py-10 text-center text-xs text-gray-400">
                当天暂无记录，点击添加补录内容
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs text-gray-400 font-medium px-3 py-2 w-7">#</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-11">优先级</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-2 py-2">任务内容</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-16">状态</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-28">项目 / 类型</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-20">进展</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-20">卡点</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-16">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEntries.map((e, i) => (
                    <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs text-gray-400">{i + 1}</td>
                      <td className="px-2 py-2">
                        <Tag label={e.priority} style={priorityStyle[e.priority] || priorityStyle['中']} />
                      </td>
                      <td className="px-2 py-2 text-xs font-medium text-gray-800 max-w-[160px] truncate" title={e.name}>
                        {e.name}
                      </td>
                      <td className="px-2 py-2">
                        <Tag label={e.status} style={statusStyle[e.status] || statusStyle['进行中']} />
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex gap-1">
                          <span className="text-xs px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium whitespace-nowrap">{e.project}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium whitespace-nowrap">{e.task_type}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-xs text-gray-500">{e.progress}</td>
                      <td className={`px-2 py-2 text-xs ${!e.blocker ? 'text-gray-400' : 'text-red-500'}`}>
                        {e.blocker || '—'}
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex gap-1">
                          <button className="text-xs text-gray-400 hover:text-gray-600 px-1">✏️</button>
                          <button className="text-xs text-gray-400 hover:text-red-400 px-1">🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
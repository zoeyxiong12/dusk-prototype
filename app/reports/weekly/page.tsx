'use client'

import React from 'react'
import { useState } from 'react'

interface Entry {
  id: string
  name: string
  priority: string
  project: string
  task_type: string
  status: string
  progress: string
  blocker: string
  include: boolean
  date: string
}

interface DayGroup {
  label: string
  entries: Entry[]
}

const priorityStyle: Record<string, { bg: string; text: string }> = {
  高: { bg: 'bg-red-50', text: 'text-red-600' },
  中: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
  低: { bg: 'bg-green-50', text: 'text-green-700' },
}

const statusStyle: Record<string, { bg: string; text: string }> = {
  已完成: { bg: 'bg-green-50', text: 'text-green-700' },
  进行中: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
  暂停: { bg: 'bg-gray-100', text: 'text-gray-500' },
}

const mockDays: DayGroup[] = [
  {
    label: '5月11日，周一',
    entries: [
      { id: '1', name: '小双项目 · 16角色美需文档', priority: '高', project: '小双项目', task_type: '需求文档', status: '进行中', progress: '完成 60%', blocker: '等待参考图', include: true, date: '5/11' },
      { id: '2', name: 'QA对接会议 · 战斗系统验收', priority: '高', project: '战斗系统', task_type: '会议', status: '已完成', progress: '完成对接确认', blocker: '—', include: true, date: '5/11' },
      { id: '3', name: '数值配置 bug 排查', priority: '中', project: '数值系统', task_type: '数据配置', status: '进行中', progress: '定位问题根因', blocker: '待修复', include: false, date: '5/11' },
    ]
  },
  {
    label: '5月12日，周二',
    entries: [
      { id: '4', name: '小双项目 · 16角色美需文档', priority: '高', project: '小双项目', task_type: '需求文档', status: '进行中', progress: '完成 80%', blocker: '—', include: true, date: '5/12' },
      { id: '5', name: '角色反馈整理 · Q2汇总', priority: '中', project: '角色系统', task_type: '角色反馈', status: '进行中', progress: '整理完成50%', blocker: '—', include: true, date: '5/12' },
      { id: '6', name: '部门周会', priority: '低', project: '事务', task_type: '会议', status: '已完成', progress: '同步进度', blocker: '—', include: true, date: '5/12' },
    ]
  },
  {
    label: '5月13日，周三',
    entries: [
      { id: '7', name: '小双项目 · 美需文档定稿', priority: '高', project: '小双项目', task_type: '需求文档', status: '已完成', progress: '全部完成', blocker: '—', include: true, date: '5/13' },
      { id: '8', name: '战斗系统 demo 测试', priority: '高', project: '战斗系统', task_type: 'demo测试', status: '已完成', progress: '通过测试', blocker: '—', include: true, date: '5/13' },
      { id: '9', name: '日报撰写', priority: '低', project: '事务', task_type: '事务', status: '已完成', progress: '已提交', blocker: '—', include: false, date: '5/13' },
    ]
  },
]

export default function WeeklyReport() {
  const [days, setDays] = useState<DayGroup[]>(mockDays)
  const [noteOpen, setNoteOpen] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [generating, setGenerating] = useState(false)
  const [reportText, setReportText] = useState('')
  const [copied, setCopied] = useState(false)

  const allEntries = days.flatMap(d => d.entries)
  const selectedCount = allEntries.filter(e => e.include).length

  const toggleEntry = (id: string) => {
    setDays(prev => prev.map(day => ({
      ...day,
      entries: day.entries.map(e => e.id === id ? { ...e, include: !e.include } : e)
    })))
  }

  const handleGenerate = async () => {
    const selected = allEntries.filter(e => e.include)
    if (selected.length === 0) { alert('请至少选择一条工作记录'); return }
    setGenerating(true)
    setReportText('')
    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'weekly', entries: selected, instruction }),
      })
      const data = await res.json()
      const text = data.report
      let i = 0
      const interval = setInterval(() => {
        if (i < text.length) {
          setReportText(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
          setGenerating(false)
        }
      }, 16)
    } catch {
      alert('生成失败，请重试')
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!reportText) return
    navigator.clipboard.writeText(reportText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const Tag = ({ label, style }: { label: string; style: { bg: string; text: string } }) => (
    <span className={`text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${style.bg} ${style.text}`}>
      {label}
    </span>
  )

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* 顶部 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <p className="text-base font-semibold text-gray-900">周报</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500"><strong className="text-gray-800">{allEntries.length}</strong> 条</span>
            <span className="text-xs text-gray-500">已选 <strong className="text-gray-800">{selectedCount}</strong> 条</span>
            <span className="text-xs text-gray-500"><strong className="text-gray-800">4</strong> 个项目</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="border border-gray-200 rounded-lg p-1.5 text-gray-400 hover:text-gray-600">‹</button>
          <span className="text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
            第20周 · 5月11日 — 5月15日
          </span>
          <button className="border border-gray-200 rounded-lg p-1.5 text-gray-400 hover:text-gray-600">›</button>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        {/* 条目表格 */}
        <div className="flex flex-col flex-1 min-h-0 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-800">本周工作条目</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {allEntries.length} 条 · 已选 {selectedCount} 条
              </span>
            </div>
            <span className="text-xs text-gray-400">开启 toggle 的条目将纳入周报</span>
          </div>

          <div className="overflow-y-auto flex-1">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                  <th className="text-left text-xs text-gray-400 font-medium px-3 py-2 w-10">纳入</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-7">#</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-11">优先级</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-2 py-2">任务内容</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-16">状态</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-28">项目 / 类型</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-20">进展</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-20">卡点</th>
                </tr>
              </thead>
              <tbody>
                {days.map(day => {
                  const daySelected = day.entries.filter(e => e.include).length
                  return (
                    <React.Fragment key={day.label}>
                      {/* 日期分组行 */}
                      <tr key={day.label} className="bg-gray-50 border-b border-gray-100 sticky top-8 z-10">
                        <td colSpan={8} className="px-3 py-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">{day.label}</span>
                            <span className="text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded-full border border-gray-200">
                              {daySelected}/{day.entries.length} 已选
                            </span>
                          </div>
                        </td>
                      </tr>
                      {day.entries.map((e, i) => (
                        <tr key={e.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${!e.include ? 'opacity-40' : ''}`}>
                          <td className="px-3 py-2 text-center">
  <div
    onClick={() => toggleEntry(e.id)}
    style={{
      width: '32px', height: '18px', borderRadius: '9px',
      background: e.include ? '#7c3aed' : '#d1d5db',
      position: 'relative', cursor: 'pointer', display: 'inline-block',
      flexShrink: 0, transition: 'background 0.15s'
    }}
  >
    <div style={{
      position: 'absolute', width: '13px', height: '13px',
      borderRadius: '50%', background: 'white',
      top: '2.5px', left: e.include ? '16px' : '2px',
      transition: 'left 0.15s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
    }} />
  </div>
</td>
                          <td className="px-2 py-2 text-xs text-gray-400 text-center">{i + 1}</td>
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
                            <div className="flex gap-1 flex-wrap">
                              <span className="text-xs px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium whitespace-nowrap">{e.project}</span>
                              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium whitespace-nowrap">{e.task_type}</span>
                            </div>
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-500 whitespace-nowrap">{e.progress}</td>
                          <td className={`px-2 py-2 text-xs whitespace-nowrap ${e.blocker === '—' ? 'text-gray-400' : 'text-red-500'}`}>{e.blocker}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI 生成区 */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200" style={{ height: '260px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-800 flex items-center gap-1.5">✨ AI 生成周报</span>
              <button
                onClick={() => setNoteOpen(!noteOpen)}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
              >
                {noteOpen ? '− 补充说明' : '+ 补充说明'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} className="text-xs border border-gray-200 text-gray-500 px-2.5 py-1.5 rounded-lg hover:bg-gray-50">
                {copied ? '✓ 已复制' : '复制'}
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                {generating ? '生成中…' : reportText ? '重新生成' : '🤖 生成周报'}
              </button>
            </div>
          </div>

          {noteOpen && (
            <div className="px-4 py-2 border-b border-gray-100 flex-shrink-0 flex flex-col gap-2">
              <input
                value={instruction}
                onChange={e => setInstruction(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 bg-gray-50 outline-none focus:border-purple-400"
                placeholder="例如：面向部门汇报、重点突出项目进展与风险…"
              />
              <div className="flex gap-2">
                {['按项目分组', '突出成果', '简洁版', '正式风格'].map(chip => (
                  <button key={chip} onClick={() => setInstruction(chip)}
                    className="text-xs border border-gray-200 text-gray-500 px-2.5 py-1 rounded-full hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300">
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {!reportText ? (
              <p className="text-xs text-gray-400 leading-relaxed">
                点击「生成周报」，AI 将跨天聚合同项目进展，合并重复内容，生成本周工作总结。
              </p>
            ) : (
              <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">{reportText}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
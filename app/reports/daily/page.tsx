'use client'

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

const mockEntries: Entry[] = [
  { id: '1', name: '小双项目 · 16角色美需文档', priority: '高', project: '小双项目', task_type: '需求文档', status: '进行中', progress: '完成 60%', blocker: '等待参考图', include: true },
  { id: '2', name: 'QA对接会议 · 战斗系统验收', priority: '高', project: '战斗系统', task_type: '会议', status: '已完成', progress: '完成对接确认', blocker: '—', include: true },
  { id: '3', name: '数值配置 bug 排查', priority: '中', project: '数值系统', task_type: '数据配置', status: '进行中', progress: '定位问题根因', blocker: '待下周修复', include: false },
]

export default function DailyReport() {
  const [entries, setEntries] = useState<Entry[]>(mockEntries)
  const [noteOpen, setNoteOpen] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [generating, setGenerating] = useState(false)
  const [reportText, setReportText] = useState('')
  const [copied, setCopied] = useState(false)

  const selectedCount = entries.filter(e => e.include).length

  const toggleEntry = (id: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, include: !e.include } : e))
  }

  const handleGenerate = async () => {
    const selected = entries.filter(e => e.include)
    if (selected.length === 0) { alert('请至少选择一条工作记录'); return }
    setGenerating(true)
    setReportText('')
    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'daily', entries: selected, instruction }),
      })
      const data = await res.json()
      // 打字机效果
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
        <p className="text-base font-semibold text-gray-900">日报</p>
        <div className="flex items-center gap-2">
          <button className="border border-gray-200 rounded-lg p-1.5 text-gray-400 hover:text-gray-600">
            ‹
          </button>
          <span className="text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">
            2026年5月12日，周二
          </span>
          <button className="border border-gray-200 rounded-lg p-1.5 text-gray-400 hover:text-gray-600">
            ›
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        {/* 条目表格 */}
        <div className="flex flex-col flex-1 min-h-0 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-800">当日工作条目</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {entries.length} 条 · 已选 {selectedCount} 条
              </span>
            </div>
            <span className="text-xs text-gray-400">开启 toggle 的条目将纳入报告</span>
          </div>

          <div className="overflow-y-auto flex-1">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
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
                {entries.map((e, i) => (
                  <tr key={e.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${!e.include ? 'opacity-40' : ''}`}>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => toggleEntry(e.id)}
                        className={`w-8 h-4.5 rounded-full relative transition-colors flex-shrink-0 inline-flex items-center ${e.include ? 'bg-purple-600' : 'bg-gray-300'}`}
                        style={{ width: '32px', height: '18px' }}
                      >
                        <span
                          className="absolute w-3.5 h-3.5 bg-white rounded-full transition-all shadow-sm"
                          style={{ left: e.include ? '15px' : '2px', top: '2px' }}
                        />
                      </button>
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
              </tbody>
            </table>
          </div>
        </div>

        {/* AI 生成区 */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200" style={{ height: '260px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-800 flex items-center gap-1.5">
                ✨ AI 生成报告
              </span>
              <button
                onClick={() => setNoteOpen(!noteOpen)}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
              >
                {noteOpen ? '− 补充说明' : '+ 补充说明'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="text-xs border border-gray-200 text-gray-500 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1"
              >
                {copied ? '✓ 已复制' : '复制'}
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1.5"
              >
                {generating ? '生成中…' : reportText ? '重新生成' : '🤖 生成日报'}
              </button>
            </div>
          </div>

          {noteOpen && (
            <div className="px-4 py-2 border-b border-gray-100 flex-shrink-0 flex flex-col gap-2">
              <input
                value={instruction}
                onChange={e => setInstruction(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 bg-gray-50 outline-none focus:border-purple-400"
                placeholder="例如：面向直属上级、突出卡点、简洁3句话以内…"
              />
              <div className="flex gap-2">
                {['突出卡点', '简洁版', '正式风格', '面向上级'].map(chip => (
                  <button
                    key={chip}
                    onClick={() => setInstruction(chip)}
                    className="text-xs border border-gray-200 text-gray-500 px-2.5 py-1 rounded-full hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {!reportText ? (
              <p className="text-xs text-gray-400 leading-relaxed">
                点击「生成日报」，AI 将把上方勾选的工作条目总结成一段自然语言汇报，可直接复制发送。
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
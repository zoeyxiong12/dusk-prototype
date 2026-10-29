'use client'

import { useState } from 'react'

interface ParsedEntry {
  name: string
  project: string
  task_type: string
  status: string
  priority: string
  progress: string
  blocker: string | null
  ddl: string | null
  confirmed: boolean
}

interface SavedEntry {
  id: string
  name: string
  project: string
  task_type: string
  status: string
  priority: string
  progress: string
  blocker: string | null
  time: string
}

const priorityStyle: Record<string, { bg: string; text: string }> = {
  高: { bg: 'bg-red-50', text: 'text-red-700' },
  中: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  低: { bg: 'bg-green-50', text: 'text-green-700' },
}

const statusStyle: Record<string, { bg: string; text: string }> = {
  已完成: { bg: 'bg-green-50', text: 'text-green-700' },
  进行中: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  暂停: { bg: 'bg-gray-100', text: 'text-gray-500' },
}

export default function TodayPage() {
  const [input, setInput] = useState('')
  const [parsing, setParsing] = useState(false)
  const [parsedEntries, setParsedEntries] = useState<ParsedEntry[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>([])
  const [confirmedCount, setConfirmedCount] = useState(0)

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  })

  const handleParse = async () => {
    if (!input.trim()) return
    setParsing(true)
    try {
      const res = await fetch('/api/parse-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      })
      const data = await res.json()
      const entries = data.entries.map((e: ParsedEntry) => ({ ...e, confirmed: false }))
      setParsedEntries(entries)
      setConfirmedCount(0)
      setShowPreview(true)
    } catch (err) {
      alert('解析失败，请重试')
    } finally {
      setParsing(false)
    }
  }

  const handleConfirm = (index: number) => {
    const entry = parsedEntries[index]
    if (entry.confirmed) return
    const updated = [...parsedEntries]
    updated[index] = { ...entry, confirmed: true }
    setParsedEntries(updated)
    setConfirmedCount(prev => prev + 1)
    const newSaved: SavedEntry = {
      id: crypto.randomUUID(),
      name: entry.name,
      project: entry.project,
      task_type: entry.task_type,
      status: entry.status,
      priority: entry.priority,
      progress: entry.progress,
      blocker: entry.blocker,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    setSavedEntries(prev => [newSaved, ...prev])
  }

  const handleConfirmAll = () => {
    const newSaved: SavedEntry[] = []
    const updated = parsedEntries.map(entry => {
      if (!entry.confirmed) {
        newSaved.push({
          id: crypto.randomUUID(),
          name: entry.name,
          project: entry.project,
          task_type: entry.task_type,
          status: entry.status,
          priority: entry.priority,
          progress: entry.progress,
          blocker: entry.blocker,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        })
        return { ...entry, confirmed: true }
      }
      return entry
    })
    setParsedEntries(updated)
    setConfirmedCount(updated.length)
    setSavedEntries(prev => [...newSaved, ...prev])
  }

  const handleReparse = () => {
    setParsedEntries(prev => prev.map(e => ({ ...e, confirmed: false })))
    setConfirmedCount(0)
  }

  const handleDelete = (id: string) => {
    setSavedEntries(prev => prev.filter(e => e.id !== id))
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
        <div>
          <p className="text-base font-semibold text-gray-900">今日记录</p>
          <p className="text-xs text-gray-400">{today}</p>
        </div>
        <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
          已记录 {savedEntries.length} 条
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4 flex-1 overflow-y-auto">
        {/* 输入卡片 */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-2 flex-shrink-0">
          <p className="text-xs text-gray-400">用自然语言描述今天的工作内容</p>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 resize-none h-16 outline-none focus:border-purple-400 leading-relaxed"
            placeholder="例如：今天完成了小双项目16角色美需文档的80%，下午参加了QA战斗系统验收对接会，会后排查了一个数值配置的bug预计明天修复…"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">✨ AI 会自动识别项目、状态、DDL 等字段</span>
            <button
              onClick={handleParse}
              disabled={parsing || !input.trim()}
              className="bg-purple-600 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg disabled:opacity-50 hover:bg-purple-700 transition-colors flex items-center gap-1.5"
            >
              {parsing ? '解析中…' : '🤖 解析'}
            </button>
          </div>
        </div>

        {/* AI 解析预览 */}
        {showPreview && (
          <div className="bg-white border-2 border-purple-300 rounded-xl flex-shrink-0 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-purple-100">
              <span className="text-xs font-medium text-purple-700">
                ✨ 识别到 {parsedEntries.length} 条记录，请逐条确认
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  已确认 {confirmedCount} / {parsedEntries.length}
                </span>
                <button
                  onClick={handleReparse}
                  className="text-xs border border-purple-300 text-purple-600 px-2.5 py-1 rounded-lg hover:bg-purple-50"
                >
                  重新解析
                </button>
                <button
                  onClick={handleConfirmAll}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                    confirmedCount === parsedEntries.length
                      ? 'bg-green-600 text-white'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {confirmedCount === parsedEntries.length ? '全部完成 ✓' : '全部确认'}
                </button>
              </div>
            </div>

            {/* 表格表头 */}
            <div className="grid grid-cols-[minmax(0,1fr)_64px_110px_68px_72px_80px] text-xs text-gray-400 font-medium bg-gray-50 border-b border-gray-100">
              <div className="px-3 py-1.5">任务内容</div>
              <div className="px-2 py-1.5">优先级</div>
              <div className="px-2 py-1.5">项目 / 类型</div>
              <div className="px-2 py-1.5">状态</div>
              <div className="px-2 py-1.5">DDL</div>
              <div className="px-2 py-1.5 text-center">操作</div>
            </div>

            {/* 解析结果行 */}
            {parsedEntries.map((entry, i) => (
              <div
                key={i}
                className={`grid grid-cols-[minmax(0,1fr)_64px_110px_68px_72px_80px] border-b border-gray-100 last:border-0 items-center ${
                  entry.confirmed ? 'opacity-40' : ''
                }`}
              >
                <div className="px-3 py-2 text-xs font-medium text-gray-800 truncate" title={entry.name}>
                  {entry.name}
                </div>
                <div className="px-2 py-2">
                  <Tag label={entry.priority} style={priorityStyle[entry.priority] || priorityStyle['中']} />
                </div>
                <div className="px-2 py-2 flex gap-1 flex-wrap">
                  <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-purple-50 text-purple-700 whitespace-nowrap">
                    {entry.project}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-gray-100 text-gray-500 whitespace-nowrap">
                    {entry.task_type}
                  </span>
                </div>
                <div className="px-2 py-2">
                  <Tag label={entry.status} style={statusStyle[entry.status] || statusStyle['进行中']} />
                </div>
                <div className="px-2 py-2 text-xs text-red-600 whitespace-nowrap">
                  {entry.ddl || '—'}
                </div>
                <div className="px-2 py-2 text-center">
                  {entry.confirmed ? (
                    <span className="text-xs text-gray-400 flex items-center justify-center gap-1">
                      ✓ 已保存
                    </span>
                  ) : (
                    <button
                      onClick={() => handleConfirm(i)}
                      className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg font-medium hover:bg-green-100 flex items-center gap-1 mx-auto"
                    >
                      ✓ 确认
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 分割线 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 whitespace-nowrap">今日已保存条目</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 已保存条目 */}
        {savedEntries.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400">
            今天还没有记录，用上方输入框开始记录吧
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {savedEntries.map(entry => (
              <div key={entry.id} className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  entry.status === '已完成' ? 'bg-green-500' :
                  entry.status === '进行中' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{entry.name}</p>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    <Tag label={entry.status} style={statusStyle[entry.status] || statusStyle['进行中']} />
                    <span className="text-xs px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium">
                      {entry.project}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                      {entry.task_type}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{entry.time}</span>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-gray-300 hover:text-red-400 text-xs flex-shrink-0"
                  aria-label="删除"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
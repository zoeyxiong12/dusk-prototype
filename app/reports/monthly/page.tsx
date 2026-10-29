'use client'

import React, { useState } from 'react'

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

interface ProjectGroup {
  name: string
  color: string
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

const mockProjects: ProjectGroup[] = [
  {
    name: '小双项目', color: '#534AB7',
    entries: [
      { id: '1', name: '16角色美需文档撰写', priority: '高', project: '小双项目', task_type: '需求文档', status: '已完成', progress: '全部完成', blocker: '—', include: true, date: '5/11-13' },
      { id: '2', name: '美需文档评审与修订', priority: '高', project: '小双项目', task_type: '需求文档', status: '已完成', progress: '修订完成', blocker: '—', include: true, date: '5/14' },
      { id: '3', name: '角色技能参数配置', priority: '中', project: '小双项目', task_type: '数据配置', status: '进行中', progress: '完成70%', blocker: '待美术确认', include: true, date: '5/18-19' },
    ]
  },
  {
    name: '战斗系统', color: '#1D9E75',
    entries: [
      { id: '4', name: 'QA验收对接会议', priority: '高', project: '战斗系统', task_type: '会议', status: '已完成', progress: '完成对接', blocker: '—', include: true, date: '5/11' },
      { id: '5', name: '战斗系统 demo 测试', priority: '高', project: '战斗系统', task_type: 'demo测试', status: '已完成', progress: '通过测试', blocker: '—', include: true, date: '5/13' },
      { id: '6', name: '战斗日志整理', priority: '中', project: '战斗系统', task_type: '事务', status: '已完成', progress: '已归档', blocker: '—', include: false, date: '5/15' },
    ]
  },
  {
    name: '数值系统', color: '#EF9F27',
    entries: [
      { id: '7', name: '数值配置 bug 修复', priority: '中', project: '数值系统', task_type: '数据配置', status: '已完成', progress: '修复验证', blocker: '—', include: false, date: '5/11-14' },
      { id: '8', name: 'Q2数值平衡复盘', priority: '高', project: '数值系统', task_type: '需求文档', status: '已完成', progress: '复盘完成', blocker: '—', include: true, date: '5/20' },
    ]
  },
  {
    name: '角色系统', color: '#D85A30',
    entries: [
      { id: '9', name: 'Q2角色反馈整理汇总', priority: '中', project: '角色系统', task_type: '角色反馈', status: '已完成', progress: '整理完成', blocker: '—', include: true, date: '5/12-14' },
      { id: '10', name: '新角色原型评审', priority: '中', project: '角色系统', task_type: '会议', status: '进行中', progress: '评审中', blocker: '待定稿', include: true, date: '5/19' },
    ]
  },
]

export default function MonthlyReport() {
  const [projects, setProjects] = useState<ProjectGroup[]>(mockProjects)
  const [groupMode, setGroupMode] = useState<'project' | 'week'>('project')
  const [noteOpen, setNoteOpen] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [generating, setGenerating] = useState(false)
  const [reportText, setReportText] = useState('')
  const [copied, setCopied] = useState(false)

  const allEntries = projects.flatMap(p => p.entries)
  const selectedCount = allEntries.filter(e => e.include).length

  const toggleEntry = (id: string) => {
    setProjects(prev => prev.map(proj => ({
      ...proj,
      entries: proj.entries.map(e => e.id === id ? { ...e, include: !e.include } : e)
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
        body: JSON.stringify({ type: 'monthly', entries: selected, instruction }),
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

  const EntryRow = ({ e, i }: { e: Entry; i: number }) => (
    <tr className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${!e.include ? 'opacity-40' : ''}`}>
      <td className="px-3 py-2 text-center">
        <div
          onClick={() => toggleEntry(e.id)}
          style={{
            width: '32px', height: '18px', borderRadius: '9px',
            background: e.include ? '#7c3aed' : '#d1d5db',
            position: 'relative', cursor: 'pointer', display: 'inline-block',
            transition: 'background 0.15s'
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
      <td className="px-2 py-2"><Tag label={e.priority} style={priorityStyle[e.priority] || priorityStyle['中']} /></td>
      <td className="px-2 py-2 text-xs font-medium text-gray-800 max-w-[150px] truncate" title={e.name}>{e.name}</td>
      <td className="px-2 py-2"><Tag label={e.status} style={statusStyle[e.status] || statusStyle['进行中']} /></td>
      <td className="px-2 py-2">
        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium whitespace-nowrap">{e.task_type}</span>
      </td>
      <td className="px-2 py-2 text-xs text-gray-400 whitespace-nowrap">{e.date}</td>
      <td className="px-2 py-2 text-xs text-gray-500 whitespace-nowrap">{e.progress}</td>
      <td className={`px-2 py-2 text-xs whitespace-nowrap ${e.blocker === '—' ? 'text-gray-400' : 'text-red-500'}`}>{e.blocker}</td>
    </tr>
  )

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* 顶部 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <p className="text-base font-semibold text-gray-900">月报</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500"><strong className="text-gray-800">{allEntries.length}</strong> 条</span>
            <span className="text-xs text-gray-500">已选 <strong className="text-gray-800">{selectedCount}</strong> 条</span>
            <span className="text-xs text-gray-500"><strong className="text-gray-800">{projects.length}</strong> 个项目</span>
            <span className="text-xs text-gray-500"><strong className="text-gray-800">18</strong> 个工作日</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="border border-gray-200 rounded-lg p-1.5 text-gray-400 hover:text-gray-600">‹</button>
          <span className="text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">2026年5月</span>
          <button className="border border-gray-200 rounded-lg p-1.5 text-gray-400 hover:text-gray-600">›</button>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        <div className="flex flex-col flex-1 min-h-0 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-800">本月工作条目</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {allEntries.length} 条 · 已选 {selectedCount} 条
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">开启 toggle 的条目将纳入月报</span>
              <button
                onClick={() => setGroupMode('project')}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${groupMode === 'project' ? 'bg-purple-50 text-purple-600 border-purple-300' : 'border-gray-200 text-gray-500'}`}
              >
                按项目
              </button>
              <button
                onClick={() => setGroupMode('week')}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${groupMode === 'week' ? 'bg-purple-50 text-purple-600 border-purple-300' : 'border-gray-200 text-gray-500'}`}
              >
                按周
              </button>
            </div>
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
                  <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-20">类型</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-16">日期</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-20">进展</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-2 py-2 w-20">卡点</th>
                </tr>
              </thead>
              <tbody>
                {groupMode === 'project' ? (
                  projects.map(proj => {
                    const projSelected = proj.entries.filter(e => e.include).length
                    return (
                      <React.Fragment key={proj.name}>
                        <tr className="bg-gray-50 border-b border-gray-100 sticky top-8 z-10">
                          <td colSpan={9} className="px-3 py-1.5">
                            <div className="flex items-center gap-2">
                              <div style={{ width: '7px', height: '7px', borderRadius: '2px', background: proj.color, flexShrink: 0 }} />
                              <span className="text-xs font-medium text-gray-700">{proj.name}</span>
                              <span className="text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded-full border border-gray-200">
                                {proj.entries.length} 条
                              </span>
                              <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                                {projSelected} 已选
                              </span>
                            </div>
                          </td>
                        </tr>
                        {proj.entries.map((e, i) => <EntryRow key={e.id} e={e} i={i} />)}
                      </React.Fragment>
                    )
                  })
                ) : (
                  [
                    { label: '第20周 · 5月11日 — 5月15日', entries: allEntries.slice(0, 5) },
                    { label: '第21周 · 5月18日 — 5月22日', entries: allEntries.slice(5) },
                  ].map(week => {
                    const weekSelected = week.entries.filter(e => e.include).length
                    return (
                      <React.Fragment key={week.label}>
                        <tr className="bg-gray-50 border-b border-gray-100 sticky top-8 z-10">
                          <td colSpan={9} className="px-3 py-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-500">{week.label}</span>
                              <span className="text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded-full border border-gray-200">
                                {weekSelected}/{week.entries.length} 已选
                              </span>
                            </div>
                          </td>
                        </tr>
                        {week.entries.map((e, i) => <EntryRow key={e.id} e={e} i={i} />)}
                      </React.Fragment>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI 生成区 */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200" style={{ height: '260px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-800">✨ AI 生成月报</span>
              <button onClick={() => setNoteOpen(!noteOpen)} className="text-xs text-gray-400 hover:text-gray-600">
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
                {generating ? '生成中…' : reportText ? '重新生成' : '🤖 生成月报'}
              </button>
            </div>
          </div>

          {noteOpen && (
            <div className="px-4 py-2 border-b border-gray-100 flex-shrink-0 flex flex-col gap-2">
              <input
                value={instruction}
                onChange={e => setInstruction(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 bg-gray-50 outline-none focus:border-purple-400"
                placeholder="例如：面向部门总结、重点提炼核心成果、Q2收尾汇报…"
              />
              <div className="flex gap-2">
                {['按项目总结', '提炼亮点', '含下月计划', '正式风格'].map(chip => (
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
                点击「生成月报」，AI 将按项目聚合本月所有工作，提炼关键成果与阶段性进展，生成可直接使用的月度汇报。
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
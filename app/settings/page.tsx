'use client'

import { useState } from 'react'

interface HeaderField {
  id: string
  name: string
  required: boolean
}

const PROJECT_COLORS = ['#534AB7', '#1D9E75', '#EF9F27', '#D85A30', '#E24B4A', '#888780', '#0EA5E9', '#8B5CF6']

const defaultFields: HeaderField[] = [
  { id: '1', name: '分类', required: true },
  { id: '2', name: '项目', required: true },
  { id: '3', name: '具体事项', required: true },
  { id: '4', name: '阶段', required: false },
  { id: '5', name: '进展与成果', required: true },
  { id: '6', name: '卡点/问题', required: true },
  { id: '7', name: '需要的资源/决策支持', required: false },
]

const defaultProjects = [
  { id: '1', name: '小双项目', color: '#534AB7' },
  { id: '2', name: '战斗系统', color: '#1D9E75' },
  { id: '3', name: '数值系统', color: '#EF9F27' },
  { id: '4', name: '角色系统', color: '#D85A30' },
  { id: '5', name: '事务', color: '#888780' },
]

const defaultTypes = [
  { id: '1', name: '需求文档' },
  { id: '2', name: '角色反馈' },
  { id: '3', name: '数据配置' },
  { id: '4', name: 'demo测试' },
  { id: '5', name: '资源验收' },
  { id: '6', name: '会议' },
  { id: '7', name: '系统/数值' },
  { id: '8', name: '事务' },
]

type Tab = 'report' | 'projects' | 'types' | 'profile'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('report')
  const [fields, setFields] = useState<HeaderField[]>(defaultFields)
  const [newFieldName, setNewFieldName] = useState('')
  const [projects, setProjects] = useState(defaultProjects)
  const [newProjectName, setNewProjectName] = useState('')
  const [types, setTypes] = useState(defaultTypes)
  const [newTypeName, setNewTypeName] = useState('')
  const [saved, setSaved] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const [profile, setProfile] = useState({
    name: '张三', department: '游戏策划部', role: '游戏策划',
    quarter: 'Q2 2026', receiver: ''
  })

  const addField = () => {
    if (!newFieldName.trim()) return
    setFields(prev => [...prev, { id: Date.now().toString(), name: newFieldName.trim(), required: false }])
    setNewFieldName('')
  }

  const removeField = (id: string) => setFields(prev => prev.filter(f => f.id !== id))

  const addProject = () => {
    if (!newProjectName.trim()) return
    const color = PROJECT_COLORS[projects.length % PROJECT_COLORS.length]
    setProjects(prev => [...prev, { id: Date.now().toString(), name: newProjectName.trim(), color }])
    setNewProjectName('')
  }

  const removeProject = (id: string) => setProjects(prev => prev.filter(p => p.id !== id))

  const addType = () => {
    if (!newTypeName.trim()) return
    setTypes(prev => [...prev, { id: Date.now().toString(), name: newTypeName.trim() }])
    setNewTypeName('')
  }

  const removeType = (id: string) => setTypes(prev => prev.filter(t => t.id !== id))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const navItems: { key: Tab; label: string; icon: string }[] = [
    { key: 'report', label: '报告表头', icon: '📋' },
    { key: 'projects', label: '项目管理', icon: '📁' },
    { key: 'types', label: '任务类型', icon: '🏷️' },
    { key: 'profile', label: '个人信息', icon: '👤' },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
        <p className="text-base font-semibold text-gray-900">设置</p>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* 二级导航 */}
        <div className="w-40 bg-white border-r border-gray-200 flex flex-col gap-0.5 p-2 flex-shrink-0">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                activeTab === item.key
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* 报告表头 */}
          {activeTab === 'report' && (
            <div className="flex flex-col gap-4 max-w-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">报告表头配置</p>
                <p className="text-xs text-gray-400 mt-1">配置公司要求的日报字段，AI 生成报告时会按照这些字段组织内容。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div>
                    <p className="text-xs font-medium text-gray-800">当前表头字段</p>
                    <p className="text-xs text-gray-400 mt-0.5">共 {fields.length} 个字段</p>
                  </div>
                  <button
                    onClick={handleSave}
                    className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-purple-700"
                  >
                    {saved ? '✓ 已保存' : '保存'}
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {fields.map(f => (
                    <div key={f.id} className="flex items-center gap-3 px-4 py-2.5">
                      <span className="text-gray-300 cursor-grab text-sm">⠿</span>
                      <input
                        value={f.name}
                        onChange={e => setFields(prev => prev.map(x => x.id === f.id ? { ...x, name: e.target.value } : x))}
                        className="flex-1 text-sm text-gray-800 bg-transparent outline-none"
                      />
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${f.required ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {f.required ? '必填' : '可选'}
                      </span>
                      <button onClick={() => removeField(f.id)} className="text-gray-300 hover:text-red-400 text-sm">✕</button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 border-t border-gray-100">
                  <input
                    value={newFieldName}
                    onChange={e => setNewFieldName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addField()}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-gray-50 outline-none focus:border-purple-400"
                    placeholder="新增字段名称…"
                  />
                  <button onClick={addField} className="text-xs border border-gray-200 text-gray-500 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                    + 添加
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 项目管理 */}
          {activeTab === 'projects' && (
            <div className="flex flex-col gap-4 max-w-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">项目管理</p>
                <p className="text-xs text-gray-400 mt-1">配置你负责的项目，AI 解析时会自动匹配这里的项目名称。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-800">当前项目</p>
                  <p className="text-xs text-gray-400 mt-0.5">共 {projects.length} 个项目</p>
                </div>
                <div className="flex flex-wrap gap-2 px-4 py-3">
                  {projects.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium"
                      style={{ background: p.color + '20', color: p.color }}
                    >
                      {p.name}
                      <button onClick={() => removeProject(p.id)} className="opacity-60 hover:opacity-100 ml-0.5">✕</button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 border-t border-gray-100">
                  <input
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addProject()}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-gray-50 outline-none focus:border-purple-400"
                    placeholder="新增项目名称…"
                  />
                  <button onClick={addProject} className="text-xs border border-gray-200 text-gray-500 px-2.5 py-1.5 rounded-lg hover:bg-gray-50">
                    + 添加
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 任务类型 */}
          {activeTab === 'types' && (
            <div className="flex flex-col gap-4 max-w-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">任务类型</p>
                <p className="text-xs text-gray-400 mt-1">配置工作内容的分类标签，AI 解析时会将任务自动归入对应类型。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-800">当前类型</p>
                  <p className="text-xs text-gray-400 mt-0.5">共 {types.length} 个类型</p>
                </div>
                <div className="flex flex-wrap gap-2 px-4 py-3">
                  {types.map(t => (
                    <div key={t.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                      {t.name}
                      <button onClick={() => removeType(t.id)} className="opacity-60 hover:opacity-100 ml-0.5">✕</button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 border-t border-gray-100">
                  <input
                    value={newTypeName}
                    onChange={e => setNewTypeName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addType()}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-gray-50 outline-none focus:border-purple-400"
                    placeholder="新增类型名称…"
                  />
                  <button onClick={addType} className="text-xs border border-gray-200 text-gray-500 px-2.5 py-1.5 rounded-lg hover:bg-gray-50">
                    + 添加
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 个人信息 */}
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-4 max-w-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">个人信息</p>
                <p className="text-xs text-gray-400 mt-1">基本信息用于 AI 生成报告时的上下文参考。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {[
                  { key: 'name', label: '姓名', placeholder: '你的姓名' },
                  { key: 'department', label: '部门', placeholder: '所在部门' },
                  { key: 'role', label: '职位', placeholder: '职位名称' },
                  { key: 'quarter', label: '当前季度', placeholder: 'Q2 2026' },
                  { key: 'receiver', label: '报告接收人', placeholder: '直属上级姓名' },
                ].map((item, i, arr) => (
                  <div key={item.key} className={`flex items-center justify-between px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <span className="text-xs text-gray-500">{item.label}</span>
                    <input
                      value={profile[item.key as keyof typeof profile]}
                      onChange={e => setProfile(prev => ({ ...prev, [item.key]: e.target.value }))}
                      placeholder={item.placeholder}
                      className="text-xs text-gray-800 text-right bg-transparent outline-none border-b border-transparent focus:border-purple-400 min-w-[140px]"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-800">数据管理</p>
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-800">导出所有数据</p>
                    <p className="text-xs text-gray-400 mt-0.5">将所有工作记录导出为 JSON 文件</p>
                  </div>
                  <button className="text-xs border border-gray-200 text-gray-500 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                    ↓ 导出
                  </button>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-xs text-red-600">清除所有数据</p>
                    <p className="text-xs text-gray-400 mt-0.5">此操作不可撤销</p>
                  </div>
                  {showClearConfirm ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">确认清除？</span>
                      <button onClick={() => setShowClearConfirm(false)} className="text-xs border border-gray-200 text-gray-500 px-2 py-1 rounded-lg">取消</button>
                      <button className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg">确认</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="text-xs border border-red-200 text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-1"
                    >
                      🗑 清除
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
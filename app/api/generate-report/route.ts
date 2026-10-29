import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
  try {
    const { type, entries, instruction } = await request.json()

    const entrySummary = entries.map((e: any) =>
      `- ${e.name}（${e.project} / ${e.task_type}）：${e.status}，进展：${e.progress}${e.blocker && e.blocker !== '—' ? `，卡点：${e.blocker}` : ''}`
    ).join('\n')

    const systemPrompts: Record<string, string> = {
      daily: `你是工作汇报助手。根据工作条目生成自然语言日报。要求：语言简洁专业，合并同项目记录，有卡点要明确提出，长度150-250字，不要标题直接正文。${instruction ? `补充要求：${instruction}` : ''}`,
      weekly: `你是工作汇报助手。根据本周工作条目生成自然语言周报。要求：跨天同项目进展合并，按项目或重要程度组织，结尾加下周计划，长度200-350字。${instruction ? `补充要求：${instruction}` : ''}`,
      monthly: `你是工作汇报助手。根据本月工作条目生成月度总结。要求：按【项目名】分段，提炼关键成果，结尾加下月计划，长度300-500字。${instruction ? `补充要求：${instruction}` : ''}`,
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompts[type] || systemPrompts.daily },
        { role: 'user', content: `工作条目：\n${entrySummary}` }
      ],
      temperature: 0.7,
    })

    const report = completion.choices[0]?.message?.content || ''
    return NextResponse.json({ report })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: '生成失败' }, { status: 500 })
  }
}
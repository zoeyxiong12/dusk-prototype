import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
  try {
    const { text } = await request.json()
    const today = new Date().toISOString().split('T')[0]

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `你是一个工作记录助手。将用户的自然语言工作描述拆解为多条结构化任务条目。
当前日期：${today}
规则：
1. 每一件独立的事情拆解为一条条目
2. 状态：完成了→已完成；在做/推进/排查→进行中
3. 优先级：无明确信号则默认"中"
4. DDL：时间词转换为YYYY-MM-DD；无DDL则为null
5. 只返回JSON数组，不要任何其他文字和markdown标记
格式：[{"name":"任务名称","project":"项目名","task_type":"类型","status":"已完成|进行中|暂停","priority":"高|中|低","progress":"进展描述","blocker":"卡点或null","ddl":"YYYY-MM-DD或null"}]`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
    })

    const responseText = completion.choices[0]?.message?.content || '[]'
    const cleaned = responseText.replace(/```json|```/g, '').trim()
    const entries = JSON.parse(cleaned)
    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Parse error:', error)
    return NextResponse.json({ error: '解析失败' }, { status: 500 })
  }
}
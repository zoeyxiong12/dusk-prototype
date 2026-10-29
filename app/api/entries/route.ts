import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = supabase
      .from('entries')
      .select(`*, projects(name, color), task_types(name)`)
      .order('created_at', { ascending: false })

    if (date) query = query.eq('date', date)
    if (startDate && endDate) query = query.gte('date', startDate).lte('date', endDate)

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ entries: data })
  } catch (error) {
    console.error('GET entries error:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })

    const entry = {
      user_id: user.id,
      date: body.date || new Date().toISOString().split('T')[0],
      name: body.name,
      status: body.status || '进行中',
      priority: body.priority || '中',
      progress: body.progress || '',
      blocker: body.blocker || null,
      ddl: body.ddl || null,
      quarter: body.quarter || 'Q2',
      include_in_report: true,
      raw_input: body.raw_input || null,
    }

    const { data, error } = await supabase.from('entries').insert(entry).select().single()
    if (error) throw error
    return NextResponse.json({ entry: data })
  } catch (error) {
    console.error('POST entry error:', error)
    return NextResponse.json({ error: '保存失败' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: '缺少 id' }, { status: 400 })

    const { error } = await supabase.from('entries').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE entry error:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
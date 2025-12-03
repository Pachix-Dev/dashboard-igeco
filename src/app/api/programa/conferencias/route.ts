import { NextResponse } from 'next/server'
import { getConferencias, getConferenciaById } from '@/lib/actions/programa'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const diaIdParam = searchParams.get('dia_id')
    const confIdParam = searchParams.get('id')
    if (confIdParam) {
      const conf = await getConferenciaById(Number(confIdParam))
      if (!conf) {
        return NextResponse.json({ message: 'Conferencia no encontrada', status: 404 }, { status: 404 })
      }
      return NextResponse.json({ message: 'OK', status: 200, data: conf })
    }
    const diaId = diaIdParam ? Number(diaIdParam) : undefined
    const data = await getConferencias(diaId)
    return NextResponse.json({ message: 'OK', status: 200, data })
  } catch (error) {
    console.error('Error GET conferencias:', error)
    return NextResponse.json({ message: 'Error al obtener conferencias', status: 500 }, { status: 500 })
  }
}

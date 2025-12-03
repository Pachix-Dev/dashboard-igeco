import { NextResponse } from 'next/server'
import { getDias } from '@/lib/actions/programa'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const escenarioIdParam = searchParams.get('escenario_id')
    const escenarioId = escenarioIdParam ? Number(escenarioIdParam) : undefined
    const data = await getDias(escenarioId)
    return NextResponse.json({ message: 'OK', status: 200, data })
  } catch (error) {
    console.error('Error GET dias:', error)
    return NextResponse.json({ message: 'Error al obtener días', status: 500 }, { status: 500 })
  }
}

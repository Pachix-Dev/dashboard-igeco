import { NextResponse } from 'next/server'
import { getEscenarios } from '@/lib/actions/programa'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const data = await getEscenarios()
    return NextResponse.json({ message: 'OK', status: 200, data })
  } catch (error) {
    console.error('Error GET escenarios:', error)
    return NextResponse.json({ message: 'Error al obtener escenarios', status: 500 }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { submitRequirements } from '@/lib/requirements-service';
import { parseTargetUserId, resolveApiActor, toErrorResponse } from '../utils';

export async function POST(req: NextRequest) {
  try {
    const actor = await resolveApiActor(req);
    if (!actor) return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const targetUserId = parseTargetUserId(req, body);

    const data = await submitRequirements(actor, targetUserId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

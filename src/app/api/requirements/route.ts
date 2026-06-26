import { NextRequest, NextResponse } from 'next/server';
import { getRequirementsRecord, updateStandType } from '@/lib/requirements-service';
import { parseTargetUserId, resolveApiActor, toErrorResponse } from './utils';

export async function GET(req: NextRequest) {
  try {
    const actor = await resolveApiActor(req);
    if (!actor) return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });

    const targetUserId = parseTargetUserId(req, null);
    const data = await getRequirementsRecord(actor, targetUserId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const actor = await resolveApiActor(req);
    if (!actor) return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });

    const body = await req.json();
    const targetUserId = parseTargetUserId(req, body);
    const standType = body?.standType;

    const data = await updateStandType(actor, standType, targetUserId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

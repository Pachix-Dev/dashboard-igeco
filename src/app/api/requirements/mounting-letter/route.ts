import { NextRequest, NextResponse } from 'next/server';
import { deleteMountingLetter, updateMountingLetterComment } from '@/lib/requirements-service';
import { parseTargetUserId, resolveApiActor, toErrorResponse } from '../utils';

export async function DELETE(req: NextRequest) {
  try {
    const actor = await resolveApiActor(req);
    if (!actor) return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const targetUserId = parseTargetUserId(req, body);
    if (!targetUserId) {
      return NextResponse.json({ success: false, message: 'targetUserId es requerido' }, { status: 400 });
    }

    const data = await deleteMountingLetter(actor, targetUserId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const actor = await resolveApiActor(req);
    if (!actor) return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const targetUserId = parseTargetUserId(req, body);
    const comment = String(body?.comment || '');

    if (!targetUserId) {
      return NextResponse.json({ success: false, message: 'targetUserId es requerido' }, { status: 400 });
    }

    const data = await updateMountingLetterComment(actor, targetUserId, comment);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

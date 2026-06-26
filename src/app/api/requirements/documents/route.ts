import { NextRequest, NextResponse } from 'next/server';
import { deleteRequirementDocument } from '@/lib/requirements-service';
import { parseTargetUserId, resolveApiActor, toErrorResponse } from '../utils';

export async function DELETE(req: NextRequest) {
  try {
    const actor = await resolveApiActor(req);
    if (!actor) return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });

    const body = await req.json();
    const targetUserId = parseTargetUserId(req, body);
    const documentKey = String(body?.documentKey || '');

    if (!documentKey) {
      return NextResponse.json({ success: false, message: 'documentKey es requerido' }, { status: 400 });
    }

    const data = await deleteRequirementDocument(actor, { targetUserId, documentKey });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

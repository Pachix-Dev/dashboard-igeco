import { NextRequest, NextResponse } from 'next/server';
import { updateRequirementDocumentComment } from '@/lib/requirements-service';
import { parseTargetUserId, resolveApiActor, toErrorResponse } from '../../utils';

export async function PATCH(req: NextRequest) {
  try {
    const actor = await resolveApiActor(req);
    if (!actor) return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });

    const body = await req.json();
    const targetUserId = parseTargetUserId(req, body);
    const documentKey = String(body?.documentKey || '');
    const adminComment = body?.adminComment;

    if (!targetUserId || !documentKey) {
      return NextResponse.json(
        { success: false, message: 'targetUserId y documentKey son requeridos' },
        { status: 400 }
      );
    }

    const data = await updateRequirementDocumentComment(actor, {
      targetUserId,
      documentKey,
      adminComment
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

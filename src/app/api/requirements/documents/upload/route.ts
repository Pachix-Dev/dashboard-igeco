import { NextRequest, NextResponse } from 'next/server';
import { uploadRequirementDocument } from '@/lib/requirements-service';
import { parseTargetUserId, resolveApiActor, saveRequirementsFile, toErrorResponse } from '../../utils';

export async function POST(req: NextRequest) {
  try {
    const actor = await resolveApiActor(req);
    if (!actor) return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const documentKey = String(formData.get('documentKey') || '');
    const targetUserIdRaw = formData.get('targetUserId');
    const targetUserId = targetUserIdRaw ? Number(targetUserIdRaw) : undefined;
    const replaceAuthorizedConfirmed = String(formData.get('replaceAuthorizedConfirmed') || 'false') === 'true';

    if (!file || !documentKey) {
      return NextResponse.json(
        { success: false, message: 'Archivo y documentKey son requeridos' },
        { status: 400 }
      );
    }

    const effectiveUserId = targetUserId || actor.id;
    const saved = await saveRequirementsFile(effectiveUserId, file);

    const data = await uploadRequirementDocument(actor, {
      targetUserId,
      documentKey,
      ...saved,
      replaceAuthorizedConfirmed
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { uploadMountingLetter } from '@/lib/requirements-service';
import { resolveApiActor, saveRequirementsFile, toErrorResponse } from '../../utils';

export async function POST(req: NextRequest) {
  try {
    const actor = await resolveApiActor(req);
    if (!actor) return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const targetUserId = Number(formData.get('targetUserId'));
    const adminComment = String(formData.get('adminComment') || '');

    if (!file || !targetUserId) {
      return NextResponse.json({ success: false, message: 'file y targetUserId son requeridos' }, { status: 400 });
    }

    const saved = await saveRequirementsFile(targetUserId, file);
    const data = await uploadMountingLetter(actor, {
      targetUserId,
      ...saved,
      adminComment
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

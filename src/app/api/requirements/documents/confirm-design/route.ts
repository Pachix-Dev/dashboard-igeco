import { NextRequest, NextResponse } from 'next/server';
import { updateComfortPlusDesignResponse } from '@/lib/requirements-service';
import { parseTargetUserId, resolveApiActor, toErrorResponse } from '../../utils';

export async function PATCH(req: NextRequest) {
  try {
    const actor = await resolveApiActor(req);
    if (!actor) return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });

    const body = await req.json();
    const targetUserId = parseTargetUserId(req, body);
    const response = body?.response === 'no' ? 'no' : 'yes';

    const data = await updateComfortPlusDesignResponse(actor, {
      targetUserId,
      response
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}
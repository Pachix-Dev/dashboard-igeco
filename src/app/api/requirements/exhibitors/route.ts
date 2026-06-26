import { NextRequest, NextResponse } from 'next/server';
import { listExhibitorsForRequirementsReview } from '@/lib/requirements-service';
import { resolveApiActor, toErrorResponse } from '../utils';

export async function GET(req: NextRequest) {
  try {
    const actor = await resolveApiActor(req);
    if (!actor) return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });

    const data = await listExhibitorsForRequirementsReview(actor);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

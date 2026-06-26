'use client';

import { AdminDocumentReview } from './AdminDocumentReview';
import { RequirementsWorkspace } from './RequirementsWorkspace';
import type { RoleType } from './types';

type RequirementsModuleProps = {
  role: string;
  userName: string;
};

export function RequirementsModule({ role, userName }: RequirementsModuleProps) {
  if (role === 'admin') {
    return <AdminDocumentReview adminName={userName || 'Administrador'} />;
  }

  return (
    <RequirementsWorkspace
      role={(role === 'exhibitor' ? 'exhibitor' : 'exhibitor') as RoleType}
      currentUserName={userName || 'Expositor'}
      exhibitorName={userName || 'Expositor'}
      allowStandSelection
    />
  );
}

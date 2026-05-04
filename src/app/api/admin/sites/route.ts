export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { withAdminProtection } from '@/lib/require-admin';

export const GET = withAdminProtection(async () => {
  try {
    const sites = await prisma.site.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(sites);
  } catch (error) {
    console.error('[SITES_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
});


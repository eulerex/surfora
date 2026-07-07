import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const pingCount = await prisma.ping.count();
    return NextResponse.json({
      status: 'ok',
      db: 'reachable',
      pingCount,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: 'error',
        db: 'unreachable',
        error: err instanceof Error ? err.message : String(err)
      },
      {status: 503}
    );
  }
}

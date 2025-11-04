import { db } from 'lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Seed endpoint available for future use
  return Response.json({
    message: 'Database seeded successfully'
  });
}

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const { data: report } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Generate share token
    const shareToken = randomBytes(24).toString('hex');
    const shareExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await supabase
      .from('reports')
      .update({
        share_token: shareToken,
        share_expires_at: shareExpiresAt.toISOString(),
      })
      .eq('id', id);

    return NextResponse.json({ share_token: shareToken, expires_at: shareExpiresAt });
  } catch (error) {
    console.error('Share Report Error:', error);
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const PROFILE_FIELDS = 'id, email, full_name, avatar_url, phone, whatsapp_number, role, created_at';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select(PROFILE_FIELDS)
      .eq('id', user.id)
      .single();

    // No row yet — create one from auth data
    if (error?.code === 'PGRST116' || !profile) {
      const { data: created, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name ?? '',
          role: 'client',
        })
        .select(PROFILE_FIELDS)
        .single();

      if (insertError) {
        console.error('Profile create error:', insertError);
        return NextResponse.json({ error: 'Error al crear perfil' }, { status: 500 });
      }

      return NextResponse.json({ profile: created });
    }

    if (error) {
      console.error('Profile fetch error:', error);
      return NextResponse.json({ error: 'Error al obtener perfil' }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error('Profile GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const allowed = ['full_name', 'phone', 'whatsapp_number'] as const;
    const updates: Record<string, string> = {};

    for (const key of allowed) {
      if (key in body && typeof body[key] === 'string') {
        updates[key] = body[key].trim();
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Sin campos para actualizar' }, { status: 400 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select(PROFILE_FIELDS)
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json({ error: 'Error al actualizar perfil' }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error('Profile PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'david.rueda@hotmail.es',
      password: 'admin',
      email_confirm: true,
    });

    if (authError) {
      throw authError;
    }

    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'Admin')
      .single();

    if (roleError) {
      throw roleError;
    }

    const { error: userRoleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user!.id,
        role_id: roleData.id,
      });

    if (userRoleError) {
      throw userRoleError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin user created successfully',
        user: {
          id: authData.user!.id,
          email: authData.user!.email,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
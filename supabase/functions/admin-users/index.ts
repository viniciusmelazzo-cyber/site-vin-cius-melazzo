import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { action, email, password, role, full_name, invite_token } = await req.json();

    // Verify caller is admin (except for seed action with a special key)
    const authHeader = req.headers.get("Authorization");
    if (action !== "seed") {
      if (!authHeader) throw new Error("Não autenticado");
      const token = authHeader.replace("Bearer ", "");
      const { data: { user: caller } } = await supabase.auth.getUser(token);
      if (!caller) throw new Error("Usuário inválido");
      
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", caller.id);
      const isAdmin = roles?.some((r: any) => r.role === "admin");
      if (!isAdmin) throw new Error("Acesso negado: apenas administradores");
    }

    if (action === "seed" || action === "create_user") {
      // Create user via admin API
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: full_name || "" },
      });

      if (createError) throw createError;

      // If role is admin, add admin role (client role is auto-added by trigger)
      if (role === "admin" && userData.user) {
        await supabase.from("user_roles").insert({
          user_id: userData.user.id,
          role: "admin",
        });
      }

      // If there's an invite token, mark it as accepted
      if (invite_token && userData.user) {
        await supabase.from("client_invites")
          .update({ status: "accepted", accepted_by: userData.user.id })
          .eq("token", invite_token)
          .eq("status", "pending");
      }

      return new Response(JSON.stringify({ success: true, user_id: userData.user?.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create_invite") {
      const authHeader2 = req.headers.get("Authorization");
      const token2 = authHeader2!.replace("Bearer ", "");
      const { data: { user: caller2 } } = await supabase.auth.getUser(token2);

      const { data, error } = await supabase.from("client_invites").insert({
        email,
        invited_by: caller2!.id,
      }).select().single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, invite: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list_invites") {
      const { data, error } = await supabase.from("client_invites")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, invites: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "register_with_invite") {
      // Validate invite token
      const { data: invite, error: inviteError } = await supabase.from("client_invites")
        .select("*")
        .eq("token", invite_token)
        .eq("status", "pending")
        .single();

      if (inviteError || !invite) {
        return new Response(JSON.stringify({ error: "Convite inválido ou expirado" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check expiration
      if (new Date(invite.expires_at) < new Date()) {
        await supabase.from("client_invites").update({ status: "expired" }).eq("id", invite.id);
        return new Response(JSON.stringify({ error: "Convite expirado" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create user
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email: invite.email,
        password,
        email_confirm: true,
        user_metadata: { full_name: full_name || "" },
      });

      if (createError) throw createError;

      // Mark invite as accepted
      if (userData.user) {
        await supabase.from("client_invites")
          .update({ status: "accepted", accepted_by: userData.user.id })
          .eq("id", invite.id);
      }

      return new Response(JSON.stringify({ success: true, user_id: userData.user?.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "reset_password") {
      // Find user by email and update password
      const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
      if (listErr) throw listErr;
      const target = users.find((u: any) => u.email === email);
      if (!target) throw new Error("Usuário não encontrado");

      const { error: updateErr } = await supabase.auth.admin.updateUserById(target.id, { password });
      if (updateErr) throw updateErr;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Ação inválida" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

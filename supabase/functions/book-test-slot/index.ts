import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const email: string | undefined = body?.email;
    const test_date: string | undefined = body?.test_date; // YYYY-MM-DD
    const test_time: string | undefined = body?.test_time; // HH:MM

    console.log("book-test-slot invoked", { email, test_date, test_time });

    if (!email || !test_date || !test_time) {
      return new Response(JSON.stringify({ error: "Missing email, test_date, or test_time" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Basic validation for hours 09-12
    const hour = parseInt(test_time.split(":")[0], 10);
    if (isNaN(hour) || hour < 9 || hour > 12) {
      return new Response(JSON.stringify({ error: "Invalid test_time hour. Must be between 09:00 and 12:59" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Try exact email match first
    let { data: found, error: findErr } = await supabaseClient
      .from("admission_forms")
      .select("id, primary_email")
      .eq("primary_email", email)
      .maybeSingle();

    if (findErr) {
      console.error("Error finding form (eq)", findErr);
    }

    if (!found) {
      // Fallback to case-insensitive match
      const res = await supabaseClient
        .from("admission_forms")
        .select("id, primary_email")
        .ilike("primary_email", email)
        .maybeSingle();
      found = res.data ?? null;
      if (res.error) console.error("Error finding form (ilike)", res.error);
    }

    if (!found) {
      return new Response(JSON.stringify({ error: "No admission form found for this email" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    const { data: updated, error: updateErr } = await supabaseClient
      .from("admission_forms")
      .update({ test_date, test_time, status: "Test Slot Booked" })
      .eq("id", found.id)
      .select();

    if (updateErr) {
      console.error("Update error", updateErr);
      return new Response(JSON.stringify({ error: updateErr.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    if (!updated || updated.length === 0) {
      return new Response(JSON.stringify({ error: "Update did not return a record" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true, record: updated[0] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    console.error("Unexpected error in book-test-slot", err);
    return new Response(JSON.stringify({ error: err?.message ?? "Unknown error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

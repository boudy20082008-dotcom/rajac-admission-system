// supabase/functions/payment-callback/index.ts
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
    const payload = await req.json();
    console.log("Callback payload:", payload);

    const paymentIntentId = payload.paymentIntentId;
    const status = payload.status; // Should be "SUCCESS", "FAILED", etc.

    if (!paymentIntentId) {
      throw new Error("No paymentIntentId in callback payload");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let newStatus = "failed";
    if (status?.toUpperCase() === "SUCCESS") {
      newStatus = "paid";
    }

    const { error } = await supabaseClient
      .from("admission_forms")
      .update({ payment_status: newStatus })
      .eq("payment_transaction_id", paymentIntentId);

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Callback processed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Callback error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

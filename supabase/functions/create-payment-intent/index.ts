// Updated 2025-01-25: Force redeploy with updated secrets
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const reqId = crypto.randomUUID?.() || `${Date.now()}`;
  const log = (...args: unknown[]) => console.log(`[create-payment-intent][${reqId}]`, ...args);
  const logError = (...args: unknown[]) => console.error(`[create-payment-intent][${reqId}]`, ...args);

  try {
    log("Request received", {
      method: req.method,
      url: req.url,
      hasBody: req.body !== null,
      contentType: req.headers.get('content-type'),
    });

    // Parse and validate body
    let body: any;
    let rawBody = '';
    
    try {
      rawBody = await req.text();
      log("Raw request body:", rawBody);
      
      if (!rawBody.trim()) {
        logError("Empty request body");
        return new Response(
          JSON.stringify({ 
            code: "EMPTY_BODY", 
            error: "Request body is required",
            received: "Empty body"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      body = JSON.parse(rawBody);
      log("Parsed request body:", body);
    } catch (e) {
      logError("Invalid JSON body", e, "Raw body:", rawBody);
      return new Response(
        JSON.stringify({ 
          code: "INVALID_JSON", 
          error: "Request body must be valid JSON",
          received: rawBody.substring(0, 200) // First 200 chars for debugging
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const { email, amount = 20 } = body ?? {};
    log("Extracted parameters", { 
      email: email ? `${email.substring(0, 3)}***` : null,
      amount,
      hasEmail: !!email,
      emailType: typeof email,
      amountType: typeof amount
    });

    // Validate email
    if (!email) {
      logError("Missing email parameter");
      return new Response(
        JSON.stringify({ 
          code: "MISSING_EMAIL", 
          error: "Email parameter is required",
          received: { hasEmail: false, bodyKeys: Object.keys(body || {}) }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (typeof email !== "string" || !email.trim()) {
      logError("Invalid email format", { email, type: typeof email });
      return new Response(
        JSON.stringify({ 
          code: "INVALID_EMAIL", 
          error: "Valid email string is required",
          received: { email: typeof email, value: email }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Validate amount
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      logError("Invalid amount", { amount, numericAmount });
      return new Response(
        JSON.stringify({ 
          code: "INVALID_AMOUNT", 
          error: "Amount must be a positive number",
          received: { amount, type: typeof amount }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Read environment config with detailed logging
    const siteUrl = Deno.env.get("SITE_URL") ?? "";
    const apiKey = Deno.env.get("GEIDEA_API_KEY") ?? "";
    const apiPassword = Deno.env.get("GEIDEA_API_PASSWORD") ?? "";
    const callbackUrl = Deno.env.get("GEIDEA_CALLBACK_URL") ?? `${siteUrl}/payment-callback`;

    // Debug: Log all available env variables (safely)
    const allEnvKeys = Object.keys(Deno.env.toObject()).filter(key => 
      key.includes('GEIDEA') || key.includes('SITE_URL') || key.includes('SUPABASE')
    );
    log("Available environment keys", allEnvKeys);
    
    log("Environment check", {
      hasSiteUrl: !!siteUrl,
      hasApiKey: !!apiKey,
      hasApiPassword: !!apiPassword,
      callbackUrl: callbackUrl ? `${callbackUrl.substring(0, 20)}...` : null,
      siteUrlValue: siteUrl ? `${siteUrl.substring(0, 10)}...` : 'EMPTY',
      apiKeyValue: apiKey ? `${apiKey.substring(0, 5)}...` : 'EMPTY',
      apiPasswordValue: apiPassword ? `${apiPassword.substring(0, 5)}...` : 'EMPTY'
    });

    const missingSecrets = [
      !apiKey && "GEIDEA_API_KEY",
      !apiPassword && "GEIDEA_API_PASSWORD", 
      !siteUrl && "SITE_URL",
    ].filter(Boolean);

    // Force detailed environment debugging
    const debugInfo = {
      SITE_URL: Deno.env.get("SITE_URL") || "NOT_FOUND",
      GEIDEA_API_KEY: Deno.env.get("GEIDEA_API_KEY") || "NOT_FOUND", 
      GEIDEA_API_PASSWORD: Deno.env.get("GEIDEA_API_PASSWORD") || "NOT_FOUND",
      allKeys: Object.keys(Deno.env.toObject()).filter(k => k.includes('GEIDEA') || k.includes('SITE'))
    };
    
    log("FORCED DEBUG - Environment variables:", debugInfo);

    if (missingSecrets.length) {
      logError("Missing environment variables", missingSecrets);
      logError("Full debug info:", debugInfo);
      return new Response(
        JSON.stringify({
          code: "MISSING_ENV",
          error: "Server configuration error",
          details: `Missing: ${missingSecrets.join(", ")}`,
          debug: debugInfo // Include debug info in response
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 422 }
      );
    }

    // Supabase client with service role to bypass RLS for server-side updates
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Look up admission form by primary_email (case-insensitive)
    log("Fetching admission form by primary_email (ilike)");
    const { data: admissionForm, error: formError } = await supabaseClient
      .from("admission_forms")
      .select("*")
      .ilike("primary_email", email.trim())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (formError) {
      logError("Database error", formError.message, formError);
      return new Response(
        JSON.stringify({ 
          code: "DB_ERROR", 
          error: "Database error", 
          details: formError.message 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (!admissionForm) {
      log("No admission form found for email", email);
      return new Response(
        JSON.stringify({ 
          code: "FORM_NOT_FOUND", 
          error: `Admission form not found for ${email}` 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    log("Found admission form", {
      id: admissionForm.id?.substring(0, 8),
      hasFirstName: !!admissionForm.student_first_name,
      hasLastName: !!admissionForm.student_last_name,
      hasFullName: !!admissionForm.student_full_name,
    });

    // Derive a student name with fallbacks
    const candidateNameParts = [
      (admissionForm.student_first_name || "").trim(),
      (admissionForm.student_last_name || "").trim(),
    ].filter(Boolean);
    let studentName = candidateNameParts.join(" ").trim();
    if (!studentName && typeof admissionForm.student_full_name === "string") {
      studentName = (admissionForm.student_full_name || "").trim();
    }

    if (!studentName) {
      logError("Missing student name on admission form", {
        hasFirst: !!admissionForm.student_first_name,
        hasLast: !!admissionForm.student_last_name,
        hasFull: !!admissionForm.student_full_name,
      });
      return new Response(
        JSON.stringify({
          code: "MISSING_STUDENT_NAME",
          error: "Student name is required before payment",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 422 }
      );
    }

    log("Resolved student name for payment", { studentName: `${studentName.substring(0, 5)}...` });

    // Generate merchant reference ID
    const merchantReferenceId = `ADM_${Date.now()}_${admissionForm.id?.slice(0, 8) || "unknown"}`;

    // Prepare payment payload for Geidea (matching Postman structure)
    const paymentData = {
      amount: numericAmount,
      currency: "EGP",
      customer: {
        name: studentName,
        email: email.trim(),
        phoneCountryCode: "+20",
        phoneNumber: admissionForm.father_phone || "8003030083",
      },
      eInvoiceDetails: {
        subtotal: numericAmount,
        grandTotal: numericAmount,
        extraChargesType: "Amount",
        invoiceDiscountType: "Amount",
        eInvoiceItems: [
          {
            description: "Admission Fee - TFM Tech",
            price: numericAmount,
            quantity: 1,
            itemDiscountType: "Amount",
            taxType: "Amount",
            total: numericAmount,
          },
        ],
        merchantReferenceId: merchantReferenceId,
        callbackUrl: callbackUrl,
        type: "Detailed",
        language: "EN",
      },
    };

    log("Prepared payment data", {
      amount: numericAmount,
      currency: "EGP",
      merchantRef: merchantReferenceId,
      hasCallbackUrl: !!callbackUrl
    });

    // Create credentials for Basic Auth
    const credentials = btoa(`${apiKey}:${apiPassword}`);

    log("Calling Geidea direct/eInvoice API");
    const t0 = Date.now();
    const response = await fetch(
      "https://api.merchant.geidea.net/payment-intent/api/v1/direct/eInvoice",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Basic ${credentials}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(paymentData),
      }
    );
    const dt = Date.now() - t0;
    log("Geidea API responded", { status: response.status, durationMs: dt });

    let result: any;
    try {
      const responseText = await response.text();
      log("Geidea raw response", { 
        status: response.status,
        body: responseText.substring(0, 500) // First 500 chars
      });
      result = JSON.parse(responseText);
    } catch (e) {
      logError("Failed to parse Geidea response as JSON", e);
      result = {};
    }

    if (!response.ok) {
      logError("Geidea API error", { 
        status: response.status, 
        statusText: response.statusText,
        result 
      });
      return new Response(
        JSON.stringify({
          code: "GATEWAY_ERROR",
          error: result?.message || result?.error || `Payment gateway error (HTTP ${response.status})`,
          details: {
            status: response.status,
            statusText: response.statusText,
            response: result
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 502 }
      );
    }

    log("Geidea API success", { 
      hasPaymentIntentId: !!result?.paymentIntentId,
      hasPaymentUrl: !!result?.paymentUrl,
      merchantRef: merchantReferenceId,
      responseKeys: Object.keys(result || {})
    });

    // Persist transaction details if provided
    if (result?.paymentIntentId) {
      const { error: updateError } = await supabaseClient
        .from("admission_forms")
        .update({
          payment_transaction_id: result.paymentIntentId as string,
          payment_status: "initiated",
          merchant_reference_id: merchantReferenceId,
          payment_amount: numericAmount,
          updated_at: new Date().toISOString(),
        })
        .eq("primary_email", email.trim());

      if (updateError) {
        logError("Failed to save payment intent to DB", updateError.message);
        // Don't fail the request if we have a payment URL
      } else {
        log("Successfully updated admission form with payment details");
      }
    }

    // Return the payment URL for redirect
    const responseData = { 
      paymentUrl: result?.paymentUrl,
      paymentIntentId: result?.paymentIntentId,
      merchantReferenceId: merchantReferenceId,
      amount: numericAmount,
      currency: "EGP"
    };

    log("Sending success response", {
      hasPaymentUrl: !!responseData.paymentUrl,
      hasPaymentIntentId: !!responseData.paymentIntentId
    });

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    logError("Unhandled error", {
      message: error?.message,
      name: error?.name,
      stack: error?.stack?.split('\n').slice(0, 5) // First 5 lines of stack
    });
    return new Response(
      JSON.stringify({ 
        code: "UNEXPECTED_ERROR", 
        error: error?.message || "Unknown error",
        name: error?.name || "UnknownError"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
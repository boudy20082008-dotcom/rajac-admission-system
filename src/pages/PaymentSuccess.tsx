// src/pages/PaymentSuccess.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentIntentId = queryParams.get("paymentIntentId");
    const paymentStatus = queryParams.get("status"); // If Geidea sends it

    async function verifyPayment() {
      try {
        // Optional: confirm with your DB
        if (paymentIntentId) {
          const { data, error } = await supabase
            .from("admission_forms")
            .select("payment_status")
            .eq("payment_transaction_id", paymentIntentId)
            .maybeSingle();

          if (error) throw error;

          if (data?.payment_status === "paid" || paymentStatus === "SUCCESS") {
            setStatus("✅ Payment successful! Thank you.");
          } else {
            setStatus("⚠️ Payment processing. Please check back shortly.");
          }
        } else {
          setStatus("⚠️ No payment reference found.");
        }
      } catch (err) {
        console.error(err);
        setStatus("❌ Error verifying payment.");
      }
    }

    verifyPayment();
  }, [location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-cairo">
      <div className="bg-green-100 border border-green-400 rounded-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Payment Status</h2>
        <p className="text-lg text-gray-800">{status}</p>
        <button
          onClick={() => navigate("/document-requirements")}
          className="mt-6 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

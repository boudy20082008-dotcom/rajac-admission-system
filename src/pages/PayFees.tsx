import React, { useState, useEffect } from "react";
import { useEmailAuth } from "@/hooks/useEmailAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PayFees = () => {
  const { userEmail } = useEmailAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!userEmail) {
      navigate("/parent-portal");
    }
  }, [userEmail, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userEmail) {
      toast({
        title: "Missing email",
        description: "Please enter your email in the Parent Portal before paying.",
        variant: "destructive",
      });
      navigate("/parent-portal");
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-payment-intent", {
        body: { email: userEmail },
      });

      if (error) {
        // Try to surface backend error message if available
        const backendMessage = (data as any)?.error || (data as any)?.details || error.message;
        throw new Error(backendMessage);
      }

      if (!data?.paymentUrl) throw new Error("No payment URL received from gateway");

      // Redirect to Geidea Hosted Payment Page
      window.location.href = data.paymentUrl;
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({
        title: "Payment Error",
        description: err?.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-cairo flex flex-col items-center justify-center text-center">
      <div className="bg-green-100 border border-green-400 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-6xl mb-4">💳</div>
        <h2 className="text-2xl font-bold text-green-800 mb-4">Payment Required</h2>
        <div className="text-lg text-gray-800 mb-6">
          Please complete your payment of <strong>5000 EGP</strong> to finalize your admission application.
        </div>
        <form onSubmit={handlePayment}>
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
            <p className="text-green-800 font-medium">Payment for: {userEmail}</p>
            <p className="text-green-600 text-sm mt-1">Admission test fee - 5000 EGP</p>
          </div>
          <button
            type="submit"
            disabled={isProcessing || !userEmail}
            className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors text-lg"
          >
            {isProcessing ? "Processing..." : "Pay 5000 EGP"}
          </button>
        </form>
        <div className="text-sm text-gray-600 mt-4">Secure payment powered by Geidea</div>
      </div>
    </div>
  );
};

export default PayFees;

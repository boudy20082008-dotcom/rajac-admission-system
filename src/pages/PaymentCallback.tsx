import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const processPaymentCallback = async () => {
      const status = searchParams.get('status');
      const paymentIntentId = searchParams.get('paymentIntentId');
      const transactionId = searchParams.get('transactionId');
      
      try {
        // Send callback data to our Supabase edge function for processing
        if (paymentIntentId) {
          console.log('Processing payment callback:', { status, paymentIntentId, transactionId });
          
          const { data, error } = await supabase.functions.invoke('payment-callback', {
            body: {
              paymentIntentId,
              transactionId: transactionId || paymentIntentId,
              status,
            },
          });
          
          if (error) {
            console.error('Error updating payment status:', error);
            toast({
              title: "Payment Processing Error",
              description: "There was an issue processing your payment. Please contact support.",
              variant: "destructive",
            });
          } else {
            console.log('Payment status updated successfully:', data);
            toast({
              title: "Payment Processed",
              description: "Your payment has been processed successfully.",
            });
          }
        }
        
        setIsProcessing(false);
        
        // Small delay to show the success message before redirecting
        setTimeout(() => {
          if (status === 'success' || status === 'completed') {
            navigate('/payment-success');
          } else {
            navigate('/pay-fees');
          }
        }, 2000);
        
      } catch (error) {
        console.error('Unexpected error during payment processing:', error);
        setIsProcessing(false);
        toast({
          title: "Processing Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        
        setTimeout(() => {
          navigate('/pay-fees');
        }, 3000);
      }
    };
    
    processPaymentCallback();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-background font-cairo flex flex-col items-center justify-center text-center">
      <div className="text-2xl text-foreground">
        {isProcessing ? "Processing payment..." : "Payment processed"}
      </div>
      {isProcessing && (
        <div className="mt-4 text-muted-foreground">
          Please wait while we verify your payment...
        </div>
      )}
    </div>
  );
};

export default PaymentCallback;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmailAuth } from "@/hooks/useEmailAuth";
import EmailPrompt from "@/components/EmailPrompt";
import { useTranslation } from "react-i18next";

const ParentPortal: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userEmail, setUserEmail, checkUserStatus } = useEmailAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // If user already has email in session, check their status
    if (userEmail) {
      handleEmailSubmit(userEmail);
    }
  }, [userEmail]);

  const handleEmailSubmit = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const status = await checkUserStatus(email);
      setUserEmail(email);

      // Route based on user status
      if (status.hasForm) {
        if (status.hasTestSlot) {
          if (status.hasPayment) {
            // Has everything - go to document requirements
            navigate("/document-requirements", { replace: true });
          } else {
            // Has form and test slot but no payment - go to payment
            navigate("/pay-fees", { replace: true });
          }
        } else {
          // Has form but no test slot - go to test slot selection
          navigate("/enter-outlook", { replace: true });
        }
      } else {
        // No form - go to form
        navigate("/form", { replace: true });
      }
    } catch (err) {
      console.error('Error checking user status:', err);
      setError(t("errors.checkingStatus", "Error checking your status. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  // If user is already authenticated, show loading while checking status
  if (userEmail && loading) {
    return (
      <div className="min-h-screen bg-white font-cairo flex flex-col items-center justify-center">
        <div className="text-lg text-gray-600">{t("common.loading", "Loading...")}</div>
      </div>
    );
  }

  return (
    <EmailPrompt 
      onEmailSubmit={handleEmailSubmit}
      loading={loading}
      error={error}
    />
  );
};

export default ParentPortal;
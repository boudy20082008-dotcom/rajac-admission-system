import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";

type EmailAuthContextProps = {
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  clearSession: () => void;
  checkUserStatus: (email: string) => Promise<{
    hasForm: boolean;
    hasTestSlot: boolean;
    hasPayment: boolean;
    admissionForm?: any;
  }>;
};

const EmailAuthContext = createContext<EmailAuthContextProps>({
  userEmail: null,
  setUserEmail: () => {},
  clearSession: () => {},
  checkUserStatus: async () => ({ hasForm: false, hasTestSlot: false, hasPayment: false }),
});

export const useEmailAuth = () => useContext(EmailAuthContext);

export const EmailAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userEmail, setUserEmailState] = useState<string | null>(null);

  // Clear session when tab/window is closed or refreshed
  useEffect(() => {
    const handleBeforeUnload = () => {
      setUserEmailState(null);
      sessionStorage.removeItem('user-email');
    };

    // Clear any existing localStorage data
    localStorage.removeItem('simple-auth-user');
    
    // Use sessionStorage instead of localStorage for non-persistent sessions
    const storedEmail = sessionStorage.getItem('user-email');
    if (storedEmail) {
      setUserEmailState(storedEmail);
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const setUserEmail = (email: string | null) => {
    setUserEmailState(email);
    if (email) {
      sessionStorage.setItem('user-email', email);
    } else {
      sessionStorage.removeItem('user-email');
    }
  };

  const clearSession = () => {
    setUserEmailState(null);
    sessionStorage.removeItem('user-email');
    localStorage.removeItem('simple-auth-user');
  };

  const checkUserStatus = async (email: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_admission_form_by_email', { p_email: email });

      if (error) {
        console.error('Error checking user status:', error);
        return { hasForm: false, hasTestSlot: false, hasPayment: false };
      }

      const admissionForm = Array.isArray(data) ? data[0] : data;
      const hasForm = !!admissionForm;
      const hasTestSlot = hasForm && !!admissionForm.test_date && !!admissionForm.test_time;
      const hasPayment = hasForm && admissionForm.payment_status === 'paid';

      return {
        hasForm,
        hasTestSlot,
        hasPayment,
        admissionForm
      };
    } catch (error) {
      console.error('Error in checkUserStatus:', error);
      return { hasForm: false, hasTestSlot: false, hasPayment: false };
    }
  };

  return (
    <EmailAuthContext.Provider value={{ 
      userEmail, 
      setUserEmail, 
      clearSession, 
      checkUserStatus 
    }}>
      {children}
    </EmailAuthContext.Provider>
  );
};
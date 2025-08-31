
import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";

type AdminUser = {
  id: string;
  email: string;
  name: string;
};

type AdminAuthContextProps = {
  admin: AdminUser | null;
  adminPassword: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextProps>({
  admin: null,
  adminPassword: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
    const storedPassword = sessionStorage.getItem('admin_password');
    if (storedPassword) {
      setAdminPassword(storedPassword);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.rpc('verify_admin_login', {
        admin_email: email,
        admin_password: password
      });

      if (error || !data || data.length === 0) {
        return { error: 'Invalid email or password' };
      }

      const adminUser = data[0];
      setAdmin(adminUser);
      localStorage.setItem('admin', JSON.stringify(adminUser));

      // Store admin password in session storage for RPC usage (temporary solution)
      setAdminPassword(password);
      sessionStorage.setItem('admin_password', password);

      return { error: null };
    } catch (err) {
      return { error: 'Login failed. Please try again.' };
    }
  };

  const signOut = () => {
    setAdmin(null);
    setAdminPassword(null);
    localStorage.removeItem('admin');
    sessionStorage.removeItem('admin_password');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, adminPassword, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
};


import { useEffect, useState, createContext, useContext } from "react";

type SimpleUser = {
  id: string;
  email: string;
};

type AuthContextProps = {
  user: SimpleUser | null;
  session: any;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
};

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  signIn: async () => ({ error: "Not implemented" }),
  signUp: async () => ({ error: "Not implemented" }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('simple-auth-user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setSession({ user: userData });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simple validation - in a real app you'd want better security
    if (!email || !password) {
      return { error: "Email and password are required" };
    }
    
    const userData = {
      id: btoa(email), // Simple ID generation
      email: email,
    };
    
    setUser(userData);
    setSession({ user: userData });
    localStorage.setItem('simple-auth-user', JSON.stringify(userData));
    
    return {};
  };

  const signUp = async (email: string, password: string) => {
    // For this simple flow, signup works the same as signin
    return signIn(email, password);
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('simple-auth-user');
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { admin, signIn } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [admin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
    
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      navigate("/admin/dashboard", { replace: true });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-cairo">
      <form
        onSubmit={handleSubmit}
        className="bg-[#f6fef9] shadow-lg rounded-xl p-6 w-full max-w-md border border-green-200 flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
          Admin Login
        </h2>

        <label className="text-left font-medium text-green-700 mb-2">
          Email
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          autoFocus
        />

        <label className="text-left font-medium text-green-700 mb-2">
          Password
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />

        <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminLogin;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SharedNavigation from "@/components/SharedNavigation";
import { useTranslation } from "react-i18next";

const Auth: React.FC = () => {
  const [fatherName, setFatherName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"signup" | "login" | "show-credentials">("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Redirect authenticated users to dashboard (they can view their application progress)
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard", {replace:true});
    }
  // eslint-disable-next-line
  }, [user, navigate, step]);

  // SIGNUP: collect father name, email, password
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signUp(email, password);

    setLoading(false);

    if (error) {
      setError(error);
    } else {
      setStep("show-credentials");
    }
  };

  // LOGIN: with email and password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    setLoading(false);

    if (error) {
      setError(error);
    } else {
      // After successful login, redirect to dashboard to see application progress
      navigate("/dashboard", { replace: true });
    }
  };

  const switchToLogin = () => {
    setStep("login");
    setError(null);
  };

  const switchToSignUp = () => {
    setStep("signup");
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-cairo">
      {/* Navigation */}
      <div className="fixed top-4 right-4 z-10">
        <SharedNavigation showBackButton={false} />
      </div>

      <form
        onSubmit={step === "signup" ? handleSignUp : step === "login" ? handleLogin : undefined}
        className="bg-[#f6fef9] shadow-lg rounded-xl p-6 w-full max-w-md border border-green-200 flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
          {step === "signup"
            ? t("auth.signup.title", "Sign up for Admission Portal")
            : step === "login"
            ? t("auth.login.title", "Login")
            : t("auth.success.title", "Account Created")}
        </h2>

        {step === "signup" && (
          <>
            <label className="text-left font-medium text-green-700 mb-2">
              {t("auth.fatherName", "Father's Name")}
            </label>
            <Input
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              placeholder={t("auth.fatherNamePlaceholder", "Enter Father's Name")}
              required
              autoFocus
            />

            <label className="text-left font-medium text-green-700 mb-2">
              {t("auth.email", "Email")}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.emailPlaceholder", "your@email.com")}
              required
            />

            <label className="text-left font-medium text-green-700 mb-2">
              {t("auth.password", "Password")}
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.passwordPlaceholder", "Choose a password")}
              required
            />

            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
              {loading ? t("auth.creating", "Creating...") : t("auth.signup.button", "Sign Up")}
            </Button>
            <div className="text-center">
              {t("auth.hasAccount", "Already have an account?")}{" "}
              <button
                type="button"
                onClick={switchToLogin}
                className="text-green-700 underline font-medium"
              >
                {t("auth.loginLink", "Login")}
              </button>
            </div>
          </>
        )}

        {step === "login" && (
          <>
            <label className="text-left font-medium text-green-700 mb-2">
              {t("auth.email", "Email")}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.emailPlaceholder", "your@email.com")}
              required
              autoFocus
            />

            <label className="text-left font-medium text-green-700 mb-2">
              {t("auth.password", "Password")}
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.passwordPlaceholder", "Enter your password")}
              required
            />

            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
              {loading ? t("auth.loggingIn", "Logging in...") : t("auth.login.button", "Login")}
            </Button>
            <div className="text-center">
              {t("auth.needSignup", "Need to sign up?")}{" "}
              <button
                type="button"
                onClick={switchToSignUp}
                className="text-green-700 underline font-medium"
              >
                {t("auth.signupLink", "Sign Up")}
              </button>
            </div>
          </>
        )}

        {step === "show-credentials" && (
          <div className="flex flex-col gap-3 items-center">
            <div className="text-green-900 font-semibold text-lg mb-2">
              {t("auth.success.message", "Registration successful!")}
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-2 w-full text-center">
              <div className="mb-1 font-semibold">{t("auth.success.credentials", "Your Login Details:")}</div>
              <div>
                <span className="font-medium">{t("auth.email", "Email")}:</span>
                <span className="ml-2">{email}</span>
              </div>
              <div>
                <span className="font-medium">{t("auth.password", "Password")}:</span>
                <span className="ml-2">{password}</span>
              </div>
              <div className="mt-2 text-sm text-yellow-800 font-medium">
                {t("auth.success.reminder", "Please take a screenshot or photo of this screen.")}<br />
                {t("auth.success.note", "You will need these credentials when your son is approved")}.
              </div>
            </div>
            <Button
              type="button"
              className="w-full bg-green-700 hover:bg-green-800"
              onClick={() => navigate("/form", { replace: true })}
            >
              {t("auth.success.proceed", "Proceed to Admission Form")}
            </Button>
          </div>
        )}

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};
export default Auth;

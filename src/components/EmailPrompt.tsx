import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface EmailPromptProps {
  onEmailSubmit: (email: string) => void;
  loading?: boolean;
  error?: string;
}

const EmailPrompt: React.FC<EmailPromptProps> = ({ onEmailSubmit, loading, error }) => {
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onEmailSubmit(email.trim());
    }
  };

  return (
    <div className="min-h-screen bg-white font-cairo flex flex-col items-center justify-center px-4">
      <div className="mb-8">
        <img 
          src="/lovable-uploads/248e8e43-042c-4ef7-9598-479cdd8ac21a.png" 
          alt="Rajac International Schools Logo" 
          className="w-24 h-24 mx-auto"
        />
      </div>

      <Card className="w-full max-w-md border-green-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-800">
            {t("parentPortal.emailPrompt.title", "Parent Portal Access")}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {t("parentPortal.emailPrompt.description", "Please enter your email address to continue")}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-green-700 mb-2 block">
                {t("auth.email", "Email Address")}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.emailPlaceholder", "your@email.com")}
                required
                autoFocus
                className="w-full"
              />
            </div>
            
            {error && (
              <div className="text-red-600 bg-red-50 border border-red-200 rounded p-3 text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-green-700 hover:bg-green-800"
              disabled={loading || !email.trim()}
            >
              {loading ? t("common.loading", "Loading...") : t("common.continue", "Continue")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-gray-500 max-w-md">
        <p>
          {t("parentPortal.emailPrompt.privacy", "Your session will not be saved and you'll need to enter your email each time you visit.")}
        </p>
      </div>
    </div>
  );
};

export default EmailPrompt;

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import LanguageSwitcher from "./LanguageSwitcher";

interface SharedNavigationProps {
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showLanguageSwitcher?: boolean;
  className?: string;
}

const SharedNavigation: React.FC<SharedNavigationProps> = ({
  showBackButton = true,
  showHomeButton = true,
  showLanguageSwitcher = true,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showBackButton && (
        <Button onClick={handleGoBack} variant="outline" size="sm">
          ← Previous Page
        </Button>
      )}
      {showHomeButton && (
        <Button onClick={handleGoHome} variant="outline" size="sm">
          🏠 Home
        </Button>
      )}
      {showLanguageSwitcher && <LanguageSwitcher />}
    </div>
  );
};

export default SharedNavigation;

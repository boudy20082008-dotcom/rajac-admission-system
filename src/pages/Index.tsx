
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SharedNavigation from "@/components/SharedNavigation";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Get the current URL for QR code
  const currentUrl = window.location.origin;

  return (
    <div className="min-h-screen bg-white font-cairo flex flex-col items-center justify-center text-center px-4">
      {/* Navigation */}
      <div className="fixed top-4 right-4 z-10">
        <SharedNavigation showBackButton={false} showHomeButton={false} />
      </div>

      {/* Logo */}
      <div className="mb-8 animate-fade-in">
        <img 
          src="/lovable-uploads/248e8e43-042c-4ef7-9598-479cdd8ac21a.png" 
          alt="Rajac International Schools Logo" 
          className="w-32 h-32 mx-auto hover-scale"
        />
      </div>

      {/* Title with animation */}
      <h1 className="text-4xl font-bold text-green-800 mb-6 animate-fade-in">
        Welcome To Rajac International Schools
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 max-w-2xl animate-fade-in">
        {t("home.description")}
      </p>
      
      {/* Buttons with staggered animation */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button 
          onClick={() => navigate("/parent-portal")}
          className="bg-green-700 hover:bg-green-800 px-8 py-3 text-lg animate-fade-in hover-scale transition-all duration-300"
        >
          {t("home.parentPortal")}
        </Button>
        
        <Button 
          onClick={() => navigate("/admin/login")}
          variant="outline"
          className="border-green-700 text-green-700 hover:bg-green-50 px-8 py-3 text-lg animate-fade-in hover-scale transition-all duration-300"
        >
          {t("home.adminPanel")}
        </Button>
      </div>

      {/* QR Code Section */}
      <div className="mt-8 animate-fade-in">
        <div className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-4">
            {t("qrHint")}
          </h3>
          <div className="flex justify-center">
            <QRCodeSVG 
              value={`${currentUrl}/form`} 
              size={150}
              bgColor="#ffffff"
              fgColor="#15803d"
              level="H"
              includeMargin={true}
              className="border border-gray-200 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

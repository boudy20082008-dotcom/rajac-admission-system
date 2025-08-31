
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import { EmailAuthProvider } from "@/hooks/useEmailAuth";
import ParentPortal from "@/pages/ParentPortal";
import FormPage from "@/pages/Form";
import Auth from "@/pages/Auth";
import EnterOutlook from "@/pages/EnterOutlook";
import PayFees from "@/pages/PayFees";
import ParentDashboard from "@/pages/ParentDashboard";
import DocumentRequirements from "@/pages/DocumentRequirements";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCallback from "@/pages/PaymentCallback";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <EmailAuthProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/parent-portal" element={<ParentPortal />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/form" element={<FormPage />} />
                <Route path="/enter-outlook" element={<EnterOutlook />} />
                <Route path="/pay-fees" element={<PayFees />} />
                <Route path="/dashboard" element={<ParentDashboard />} />
                <Route path="/document-requirements" element={<DocumentRequirements />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-callback" element={<PaymentCallback />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AdminAuthProvider>
        </AuthProvider>
      </EmailAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

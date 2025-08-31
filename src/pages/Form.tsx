
import React, { Suspense } from "react";
import SharedNavigation from "@/components/SharedNavigation";

const LazyAdmissionForm = React.lazy(() => import("@/components/AdmissionForm"));

const FormPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="fixed top-4 right-4 z-10">
        <SharedNavigation />
      </div>
      
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading form...</div>}>
        <LazyAdmissionForm afterSubmitRedirect="/enter-outlook" />
      </Suspense>
    </div>
  );
};
export default FormPage;

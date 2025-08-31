
import React, { useEffect, useState } from "react";
import { useEmailAuth } from "@/hooks/useEmailAuth";
import { useNavigate } from "react-router-dom";
import { useGetApplications } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import SharedNavigation from "@/components/SharedNavigation";
import { useTranslation } from "react-i18next";

const ParentDashboard: React.FC = () => {
  const { userEmail } = useEmailAuth();
  const navigate = useNavigate();
  const { execute: getApplications, data: applications = [], loading: dataLoading } = useGetApplications();
  const [admissionForm, setAdmissionForm] = useState<any | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!userEmail) {
      navigate('/parent-portal');
    }
  }, [userEmail, navigate]);

  useEffect(() => {
    const fetchAdmissionForm = async () => {
      if (!userEmail) return;
      
      try {
        await getApplications();
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchAdmissionForm();
  }, [userEmail]);

  // Set admission form when applications are loaded
  useEffect(() => {
    if (applications && applications.length > 0) {
      // Find the application for the current user
      const userApplication = applications.find(app => app.parent_email === userEmail);
      setAdmissionForm(userApplication);
    }
  }, [applications, userEmail]);

  if (dataLoading) {
    return <div className="flex flex-col items-center justify-center h-screen">Loading...</div>;
  }

  if (!admissionForm) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <div className="fixed top-4 right-4 z-10">
          <SharedNavigation />
        </div>
        <div className="text-xl font-bold text-green-800 mb-4">No Application Found</div>
        <div className="text-gray-600 mb-4">You haven't submitted an admission form yet.</div>
        <Button onClick={()=>navigate("/form")} className="bg-green-700 hover:bg-green-800">
          Fill Admission Form
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-cairo flex flex-col items-center justify-center text-center px-2">
      {/* Navigation */}
      <div className="fixed top-4 right-4 z-10">
        <SharedNavigation />
      </div>

      <h2 className="text-2xl font-bold text-green-800 mb-6">{t("dashboard.title")}</h2>
      <div className="bg-[#f6fef9] border border-green-200 shadow-lg rounded-xl p-6 max-w-md w-full flex flex-col gap-4">
        <div className="text-left font-semibold text-green-700">{t("dashboard.studentInfo")}</div>
        <div className="flex justify-between items-center">
          <span className="font-medium">{t("dashboard.studentName")}:</span>
          <span>{admissionForm.student_name || t("dashboard.notSpecified")}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">{t("dashboard.gradeApplied")}:</span>
          <span>{admissionForm.grade_level || t("dashboard.notSpecified")}</span>
        </div>
        
        <div className="text-left font-semibold text-green-700 mt-4">{t("dashboard.testInfo")}</div>
        <div className="flex justify-between items-center">
          <span className="font-medium">{t("dashboard.examDate")}:</span>
          <span>{admissionForm.test_date ? format(new Date(admissionForm.test_date), "PPP") : t("dashboard.notScheduled")}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">{t("dashboard.examTime")}:</span>
          <span>{admissionForm.test_time || t("dashboard.notScheduled")}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">{t("dashboard.testResult")}:</span>
          <span className={`font-semibold ${
            admissionForm.test_result === 'Pass' ? 'text-green-600' : 
            admissionForm.test_result === 'Fail' ? 'text-red-600' : 
            'text-yellow-600'
          }`}>
            {admissionForm.test_result || t("dashboard.pending")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">{t("dashboard.status")}:</span>
          <span className={`font-semibold ${
            admissionForm.status === 'Passed' ? 'text-green-600' : 
            admissionForm.status === 'Failed' ? 'text-red-600' : 
            'text-yellow-600'
          }`}>
            {admissionForm.status || t("dashboard.underReview")}
          </span>
        </div>
        
        {/* Payment Status */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Payment Status:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            admissionForm.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
            admissionForm.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {admissionForm.payment_status || 'pending'}
          </span>
        </div>
        
        {admissionForm.admin_notes && (
          <>
            <div className="text-left font-semibold text-green-700 mt-4">{t("dashboard.adminNotes")}</div>
            <div className="text-left bg-gray-50 p-3 rounded border text-sm">
              {admissionForm.admin_notes}
            </div>
          </>
        )}
      </div>
      <div className="mt-6 text-gray-700 text-base max-w-md">
        {admissionForm.status === 'Passed' ? (
          <div className="text-green-700 font-medium">
            {t("dashboard.passedMessage")}
          </div>
        ) : admissionForm.status === 'Failed' ? (
          <div className="text-red-700 font-medium">
            {t("dashboard.failedMessage")}
          </div>
        ) : (
          <div>
            {t("dashboard.reviewMessage")}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;

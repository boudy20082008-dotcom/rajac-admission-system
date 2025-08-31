
import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import AdminFormDetails from "./AdminFormDetails";

type AdmissionForm = {
  id: string;
  user_id: string;
  student_first_name: string;
  student_last_name: string;
  student_name_ar: string;
  dob: string;
  religion: string;
  citizenship: string;
  second_lang: string;
  address: string;
  gender: string;
  school: string;
  grade: string;
  prev_school: string;
  scholar_notes: string;
  father_name: string;
  father_dob: string;
  father_phone: string;
  father_email: string;
  father_degree: string;
  father_work: string;
  father_business: string;
  mother_name: string;
  mother_dob: string;
  mother_phone: string;
  mother_email: string;
  mother_degree: string;
  mother_work: string;
  mother_business: string;
  test_date: string;
  test_time: string;
  test_result: string;
  status: string;
  admin_notes: string;
  payment_status: string;
  payment_transaction_id: string;
  created_at: string;
};

interface AdminApplicationCardProps {
  application: AdmissionForm;
  onUpdate: () => void;
  adminEmail?: string;
  adminPassword?: string;
}

const AdminApplicationCard: React.FC<AdminApplicationCardProps> = ({ 
  application, 
  onUpdate,
  adminEmail,
  adminPassword
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showFormDetails, setShowFormDetails] = useState(false);
  const [testResult, setTestResult] = useState(application.test_result || "");
  const [status, setStatus] = useState(application.status || "");
  const [adminNotes, setAdminNotes] = useState(application.admin_notes || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!adminEmail || !adminPassword) {
      console.error("Admin credentials required for update");
      return;
    }

    setLoading(true);
    
    const { data: success, error } = await supabase.rpc('admin_update_admission_form', {
      p_admin_email: adminEmail,
      p_admin_password: adminPassword,
      p_id: application.id,
      p_test_result: testResult,
      p_status: status,
      p_admin_notes: adminNotes,
    });

    if (error || !success) {
      console.error("Error updating application:", error);
    } else {
      setIsEditing(false);
      onUpdate();
    }
    
    setLoading(false);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-lg text-green-800">
              {application.student_first_name} {application.student_last_name}
            </h3>
            <p className="text-gray-600">Father: {application.father_name}</p>
            <p className="text-gray-600">Phone: {application.father_phone}</p>
            <p className="text-gray-600">Grade: {application.grade}</p>
            <p className="text-sm text-gray-500 font-mono">
              Application #: {application.id.slice(-8).toUpperCase()}
            </p>
          </div>
          
          <div>
            <p className="text-gray-600">
              <strong>Applied:</strong> {format(new Date(application.created_at), "PPP")}
            </p>
            <p className="text-gray-600">
              <strong>Payment:</strong> <span className={`px-2 py-1 rounded text-xs ${
                application.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                application.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {application.payment_status || 'pending'}
              </span>
            </p>
            <p className="text-gray-600">
              <strong>Test date:</strong> {application.test_date && application.test_time ? (
                `${format(new Date(application.test_date), "PPP")} at ${application.test_time}`
              ) : (
                'Not scheduled'
              )}
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Result
              </label>
              <Input
                value={testResult}
                onChange={(e) => setTestResult(e.target.value)}
                placeholder="Enter score or grade"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Awaiting Test Slot">Awaiting Test Slot</option>
                <option value="Test Scheduled">Test Scheduled</option>
                <option value="Test Completed">Test Completed</option>
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Admitted">Admitted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Internal Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes..."
                className="w-full p-2 border border-gray-300 rounded-md h-24"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Status:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                status === 'Passed' ? 'bg-green-100 text-green-800' :
                status === 'Failed' ? 'bg-red-100 text-red-800' :
                status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {status}
              </span>
            </div>
            
            {testResult && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Test Result:</span>
                <span>{testResult}</span>
              </div>
            )}
            
            {adminNotes && (
              <div>
                <span className="font-medium">Notes:</span>
                <p className="text-gray-600 mt-1">{adminNotes}</p>
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <Button onClick={() => setIsEditing(true)}>
                Edit Application
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowFormDetails(true)}
              >
                View Full Form
              </Button>
            </div>
          </div>
        )}
      </div>

      {showFormDetails && (
        <AdminFormDetails
          application={application}
          onClose={() => setShowFormDetails(false)}
        />
      )}
    </>
  );
};

export default AdminApplicationCard;

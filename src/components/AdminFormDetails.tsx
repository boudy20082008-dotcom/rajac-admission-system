
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
  created_at: string;
};

interface AdminFormDetailsProps {
  application: AdmissionForm;
  onClose: () => void;
}

const AdminFormDetails: React.FC<AdminFormDetailsProps> = ({ 
  application, 
  onClose 
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    return format(new Date(dateString), "PPP");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-green-800">
            Admission Form Details - Application #{application.id.slice(-8).toUpperCase()}
          </h2>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Student Information */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-700 mb-4 border-b pb-2">
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">First Name</label>
                <p className="text-gray-900">{application.student_first_name || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Name</label>
                <p className="text-gray-900">{application.student_last_name || "Not provided"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Arabic Name</label>
                <p className="text-gray-900">{application.student_name_ar || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900">{formatDate(application.dob)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900">{application.gender || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Religion</label>
                <p className="text-gray-900">{application.religion || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Citizenship</label>
                <p className="text-gray-900">{application.citizenship || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Second Language</label>
                <p className="text-gray-900">{application.second_lang || "Not provided"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-gray-900">{application.address || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-700 mb-4 border-b pb-2">
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Current School</label>
                <p className="text-gray-900">{application.school || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Grade Applying For</label>
                <p className="text-gray-900">{application.grade || "Not provided"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Previous School</label>
                <p className="text-gray-900">{application.prev_school || "Not provided"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Academic Notes</label>
                <p className="text-gray-900">{application.scholar_notes || "No notes provided"}</p>
              </div>
            </div>
          </div>

          {/* Father Information */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-700 mb-4 border-b pb-2">
              Father Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900">{application.father_name || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900">{formatDate(application.father_dob)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{application.father_phone || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{application.father_email || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Education</label>
                <p className="text-gray-900">{application.father_degree || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Occupation</label>
                <p className="text-gray-900">{application.father_work || "Not provided"}</p>
              </div>
              <div className="md:col-span-3">
                <label className="text-sm font-medium text-gray-600">Business/Company</label>
                <p className="text-gray-900">{application.father_business || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Mother Information */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-700 mb-4 border-b pb-2">
              Mother Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900">{application.mother_name || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900">{formatDate(application.mother_dob)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{application.mother_phone || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{application.mother_email || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Education</label>
                <p className="text-gray-900">{application.mother_degree || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Occupation</label>
                <p className="text-gray-900">{application.mother_work || "Not provided"}</p>
              </div>
              <div className="md:col-span-3">
                <label className="text-sm font-medium text-gray-600">Business/Company</label>
                <p className="text-gray-900">{application.mother_business || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Test and Status Information */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-700 mb-4 border-b pb-2">
              Test & Status Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Application Date</label>
                <p className="text-gray-900">{formatDate(application.created_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className={`font-medium ${
                  application.status === 'Passed' ? 'text-green-600' :
                  application.status === 'Failed' ? 'text-red-600' :
                  application.status === 'Pending Review' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {application.status}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Test Date</label>
                <p className="text-gray-900">{formatDate(application.test_date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Test Time</label>
                <p className="text-gray-900">{application.test_time || "Not scheduled"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Test Result</label>
                <p className="text-gray-900">{application.test_result || "Not available"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Application Number</label>
                <p className="text-gray-900 font-mono">#{application.id.slice(-8).toUpperCase()}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Admin Notes</label>
                <p className="text-gray-900">{application.admin_notes || "No admin notes"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4">
          <Button onClick={onClose} className="w-full">
            Close Form Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminFormDetails;

import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminApplicationCard from "@/components/AdminApplicationCard";
import SharedNavigation from "@/components/SharedNavigation";
import { useTranslation } from "react-i18next";

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

const AdminDashboard: React.FC = () => {
  const { admin, adminPassword, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<AdmissionForm[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplications, setFilteredApplications] = useState<AdmissionForm[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && !admin) {
      navigate("/admin-login");
    }
  }, [admin, loading, navigate]);

  const fetchApplications = async () => {
    console.log('=== DEBUG: Admin fetching applications via RPC ===');
    if (!admin || !adminPassword) {
      console.warn('Admin credentials not available for RPC');
      return;
    }
    const { data, error } = await supabase.rpc('admin_list_admission_forms', {
      p_admin_email: admin.email,
      p_admin_password: adminPassword,
    });

    console.log('=== DEBUG: Admin RPC fetch result ===');
    console.log('Data count:', Array.isArray(data) ? data.length : 0);
    console.log('Error:', error);

    if (data && data.length > 0) {
      console.log('Sample application data:', {
        email: data[0].primary_email,
        test_date: data[0].test_date,
        test_time: data[0].test_time,
        status: data[0].status,
        payment_status: data[0].payment_status
      });
    }

    if (error) {
      console.error("Error fetching applications:", error);
    } else {
      const formattedData = data.map(app => ({
        ...app,
        dob: app.dob || "",
        religion: app.religion || "",
        citizenship: app.citizenship || "",
        second_lang: app.second_lang || "",
        address: app.address || "",
        gender: app.gender || "",
        school: app.school || "",
        grade: app.grade || "",
        prev_school: app.prev_school || "",
        scholar_notes: app.scholar_notes || "",
        father_name: app.father_name || "",
        father_dob: app.father_dob || "",
        father_phone: app.father_phone || "",
        father_email: app.father_email || "",
        father_degree: app.father_degree || "",
        father_work: app.father_work || "",
        father_business: app.father_business || "",
        mother_name: app.mother_name || "",
        mother_dob: app.mother_dob || "",
        mother_phone: app.mother_phone || "",
        mother_email: app.mother_email || "",
        mother_degree: app.mother_degree || "",
        mother_work: app.mother_work || "",
        mother_business: app.mother_business || "",
        test_date: app.test_date || "",
        test_time: app.test_time || "",
        test_result: app.test_result || "",
        status: app.status || "",
        admin_notes: app.admin_notes || "",
        student_name_ar: app.student_name_ar || "",
      }));
      console.log('=== DEBUG: Formatted applications count ===', formattedData.length);
      setApplications(formattedData);
      setFilteredApplications(formattedData);
    }
  };

  useEffect(() => {
    if (admin && adminPassword) {
      fetchApplications();
    }
  }, [admin, adminPassword]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter(app => 
        app.father_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${app.student_first_name} ${app.student_last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredApplications(filtered);
    }
  }, [searchTerm, applications]);

  const handleLogout = async () => {
    navigate("/admin-login");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="fixed top-4 right-4 z-10">
        <SharedNavigation />
      </div>

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-800">{t("admin.dashboard")}</h1>
            <p className="text-gray-600">{t("admin.welcome", { name: admin.name })}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            {t("admin.logout")}
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder={t("admin.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={fetchApplications} variant="outline">
              {t("admin.refresh")}
            </Button>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">{t("admin.noApplications")}</p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <AdminApplicationCard
                key={application.id}
                application={application}
                onUpdate={fetchApplications}
                adminEmail={admin.email}
                adminPassword={adminPassword}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

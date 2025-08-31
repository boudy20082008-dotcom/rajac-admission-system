import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmailAuth } from "@/hooks/useEmailAuth";

const DocumentRequirements = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { clearSession } = useEmailAuth();
  const isRTL = i18n.language === "ar";

  return (
    <div className="min-h-screen bg-white font-cairo p-6">
      <div className={`max-w-4xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
        <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
          Document Requirements
        </h1>

        {/* Initial Admission Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-green-700">
              For Initial Admission Stage (رياض الأطفال):
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">•</span>
              <div>
                <div className="font-semibold">شهادة الميلاد الرقم القومي (الأصل)</div>
                <div className="text-gray-600">Original national ID birth certificate</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">•</span>
              <div>
                <div className="font-semibold">6 صور شخصية للطالب</div>
                <div className="text-gray-600">6 personal photos of the student</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">•</span>
              <div>
                <div className="font-semibold">صورة من البطاقة الوالد و الوالدة</div>
                <div className="text-gray-600">Copy of father's and mother's national ID</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfer Student Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-green-700">
              For Transfer Student:
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="font-semibold text-gray-800 mb-3">
              جميع الطلبات السابقة و الآتية
              <br />
              <span className="text-gray-600 font-normal">All of the above documents plus the following:</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">•</span>
              <div>
                <div className="font-semibold">طلب تحويل من المدرسة المحول منها</div>
                <div className="text-gray-600">Transfer request from the previous school</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">•</span>
              <div>
                <div className="font-semibold">بيان نجاح بالأعوام السابقة لمراحل النقل من الإدارة التعليمية</div>
                <div className="text-gray-600">Transcript of previous years from educational administration</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">•</span>
              <div>
                <div className="font-semibold">بيان نجاح المستوى الرفيع</div>
                <div className="text-gray-600">Transcript of advanced level</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">•</span>
              <div>
                <div className="font-semibold">شهادة الصف السادس الابتدائي</div>
                <div className="text-gray-600">Certificate of 6th grade</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">•</span>
              <div>
                <div className="font-semibold">بيان نجاح الصف السادس الابتدائي من الإدارة التعليمية</div>
                <div className="text-gray-600">Confirmation of 6th grade completion from the educational administration</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">•</span>
              <div>
                <div className="font-semibold">شهادة الإعدادية</div>
                <div className="text-gray-600">Middle school certificate</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">•</span>
              <div>
                <div className="font-semibold">بيان نجاح الإعدادية من الإدارة التعليمية</div>
                <div className="text-gray-600">Confirmation of middle school completion from the educational administration</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full text-lg mr-4"
          >
            View Dashboard
          </Button>
          <Button
            onClick={() => {
              clearSession();
              navigate("/parent-portal");
            }}
            variant="outline"
            className="border-green-700 text-green-700 hover:bg-green-50 font-bold py-3 px-8 rounded-full text-lg"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentRequirements;
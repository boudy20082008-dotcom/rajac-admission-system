import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useSubmitAdmission } from "@/hooks/useApi";
import { useEmailAuth } from "@/hooks/useEmailAuth";

interface AdmissionFormProps {
  afterSubmitRedirect?: string;
}

interface Sibling {
  name: string;
  grade: string;
  age: string;
  studentHere: string;
  school: string;
}

const AdmissionForm: React.FC<AdmissionFormProps> = ({ afterSubmitRedirect = "/enter-outlook" }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { userEmail } = useEmailAuth();
  const { execute: submitForm, loading: submitting, error: submitError, data: submitData } = useSubmitAdmission();
  const [error, setError] = React.useState<string | null>(null);

  // Check if user has email and pre-fill form
  React.useEffect(() => {
    if (!userEmail) {
      navigate('/parent-portal');
    } else {
      // Pre-fill email from authenticated user
      setForm(prev => ({
        ...prev,
        primaryEmail: userEmail
      }));
    }
  }, [userEmail, navigate]);

  // Form state with all required fields
  const [form, setForm] = React.useState({
    primaryEmail: "",
    // Student Information
    studentFirstName: "",
    studentLastName: "",
    studentFullName: "",
    studentNameAr: "",
    gender: "",
    nationality: "",
    dob: "",
    parentPassportId: "",
    address: "",
    homeNumber: "",
    studentEmail: "",
    religion: "",
    citizenship: "",
    secondLang: "",
    // School Information
    school: "",
    grade: "",
    prevSchool: "",
    scholarNotes: "",
    // Father Information
    fatherName: "",
    fatherDob: "",
    fatherEducation: "",
    fatherOccupation: "",
    fatherWorkAddress: "",
    fatherPhone: "",
    fatherEmail: "",
    fatherMobile: "",
    fatherReligion: "",
    fatherAddress: "",
    // Mother Information
    motherName: "",
    motherDob: "",
    motherEducation: "",
    motherOccupation: "",
    motherPhone: "",
    motherEmail: "",
    motherMobile: "",
    motherReligion: "",
    motherAddress: "",
  });

  const [siblings, setSiblings] = React.useState<Sibling[]>([
    { name: "", grade: "", age: "", studentHere: "", school: "" }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm(f => ({
      ...f,
      [name]: value,
    }));
  };

  const handleSiblingChange = (index: number, field: keyof Sibling, value: string) => {
    const updatedSiblings = [...siblings];
    updatedSiblings[index] = { ...updatedSiblings[index], [field]: value };
    setSiblings(updatedSiblings);
  };

  const addSibling = () => {
    setSiblings([...siblings, { name: "", grade: "", age: "", studentHere: "", school: "" }]);
  };

  const removeSibling = (index: number) => {
    if (siblings.length > 1) {
      setSiblings(siblings.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userEmail) {
      setError('Email authentication required');
      navigate('/parent-portal');
      return;
    }

    try {
      // Transform form data to match backend schema
      const admissionData = {
        application_id: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        student_name: `${form.studentFirstName} ${form.studentLastName}`,
        student_email: form.studentEmail || form.primaryEmail,
        student_phone: form.homeNumber,
        student_dob: form.dob || undefined,
        student_gender: form.gender,
        parent_name: `${form.fatherName} / ${form.motherName}`,
        parent_email: form.primaryEmail,
        parent_phone: form.fatherPhone || form.motherPhone,
        address: form.address,
        city: '', // Add if you have city field
        country: 'Saudi Arabia',
        nationality: form.nationality,
        previous_school: form.prevSchool,
        grade_level: form.grade,
        academic_year: new Date().getFullYear().toString(),
        documents: JSON.stringify({
          siblings: siblings.filter(s => s.name.trim() !== ""),
          additional_info: {
            religion: form.religion,
            citizenship: form.citizenship,
            second_lang: form.secondLang,
            scholar_notes: form.scholarNotes,
            father_details: {
              name: form.fatherName,
              dob: form.fatherDob,
              education: form.fatherEducation,
              occupation: form.fatherOccupation,
              phone: form.fatherPhone,
              email: form.fatherEmail,
              mobile: form.fatherMobile,
              religion: form.fatherReligion,
              address: form.fatherAddress
            },
            mother_details: {
              name: form.motherName,
              dob: form.motherDob,
              education: form.motherEducation,
              occupation: form.motherOccupation,
              phone: form.motherPhone,
              email: form.motherEmail,
              mobile: form.motherMobile,
              religion: form.motherReligion,
              address: form.motherAddress
            }
          }
        })
      };

      await submitForm(admissionData);

      if (submitData) {
        alert(t("form.thankYou"));
        setTimeout(() => navigate(afterSubmitRedirect, { replace: true }), 1000);
      }
    } catch (error: any) {
      setError(error.message || "Could not submit form. Please try again.");
    }
  };

  const rtl = i18n.language === "ar";
  const direction = rtl ? "rtl" : "ltr";
  const align = rtl ? "items-end" : "items-start";
  const labelAlign = rtl ? "text-right" : "text-left";

  return (
    <form
      dir={direction}
      onSubmit={handleSubmit}
      className="bg-[#f6fef9] shadow-lg rounded-xl p-6 max-w-4xl mx-auto mt-6 w-full flex flex-col gap-6 border border-green-200"
    >
      <h2 className="text-2xl font-bold text-green-800 mb-2 text-center">
        {t("form.title")}
      </h2>
      {(error || submitError) && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error || submitError}
        </div>
      )}

      {/* Contact Email */}
      <div>
        <h3 className="font-semibold text-green-700 mb-2">Contact Information</h3>
        <div>
          <label className={labelAlign}>Primary Email *</label>
          <Input 
            name="primaryEmail" 
            type="email"
            value={form.primaryEmail} 
            onChange={handleChange} 
            required 
            placeholder="Enter your email address" 
            autoComplete="email" 
          />
        </div>
      </div>

      {/* Student Personal Information */}
      <div>
        <h3 className="font-semibold text-green-700 mb-2">{t("form.student.section")}</h3>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${align}`}>
          <div>
            <label className={labelAlign}>{t("form.student.firstName")} *</label>
            <Input 
              name="studentFirstName" 
              value={form.studentFirstName} 
              onChange={handleChange} 
              required 
              placeholder="Enter student's first name" 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.student.lastName")} *</label>
            <Input 
              name="studentLastName" 
              value={form.studentLastName} 
              onChange={handleChange} 
              required 
              placeholder="Enter student's last name" 
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelAlign}>{t("form.student.fullName")}</label>
            <Input 
              name="studentFullName" 
              value={form.studentFullName} 
              onChange={handleChange} 
              required 
              placeholder={t("form.student.fullNamePh")} 
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelAlign}>Student Name in Arabic (الاسم بالعربية)</label>
            <Input 
              name="studentNameAr" 
              value={form.studentNameAr} 
              onChange={handleChange} 
              placeholder="ادخل اسم الطالب بالعربية" 
              dir="rtl"
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.student.gender")}</label>
            <Select value={form.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("form.student.genderPh")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className={labelAlign}>{t("form.student.nationality")}</label>
            <Input 
              name="nationality" 
              value={form.nationality} 
              onChange={handleChange} 
              required 
              placeholder={t("form.student.nationalityPh")} 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.student.dob")}</label>
            <Input name="dob" type="date" value={form.dob} onChange={handleChange} required />
          </div>
          <div>
            <label className={labelAlign}>{t("form.student.parentId")}</label>
            <Input 
              name="parentPassportId" 
              value={form.parentPassportId} 
              onChange={handleChange} 
              required 
              placeholder={t("form.student.parentIdPh")} 
            />
          </div>
          <div>
            <label className={labelAlign}>Religion</label>
            <Input 
              name="religion" 
              value={form.religion} 
              onChange={handleChange} 
              placeholder="Enter religion" 
            />
          </div>
          <div>
            <label className={labelAlign}>Citizenship</label>
            <Input 
              name="citizenship" 
              value={form.citizenship} 
              onChange={handleChange} 
              placeholder="Enter citizenship" 
            />
          </div>
          <div>
            <label className={labelAlign}>Second Language</label>
            <Select value={form.secondLang} onValueChange={(value) => handleSelectChange("secondLang", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select second language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arabic">Arabic</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className={labelAlign}>{t("form.student.address")}</label>
            <Input 
              name="address" 
              value={form.address} 
              onChange={handleChange} 
              required 
              placeholder={t("form.student.addressPh")} 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.student.homeNumber")}</label>
            <Input 
              name="homeNumber" 
              value={form.homeNumber} 
              onChange={handleChange} 
              placeholder={t("form.student.homeNumberPh")} 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.student.email")}</label>
            <Input 
              name="studentEmail" 
              type="email" 
              value={form.studentEmail} 
              onChange={handleChange} 
              placeholder={t("form.student.emailPh")} 
            />
          </div>
        </div>
      </div>

      {/* School Information */}
      <div>
        <h3 className="font-semibold text-green-700 mb-2">{t("form.scholar.section")}</h3>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${align}`}>
          <div>
            <label className={labelAlign}>{t("form.scholar.school")}</label>
            <Select value={form.school} onValueChange={(value) => handleSelectChange("school", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("form.scholar.schoolPh")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="National">National</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="IG">IG</SelectItem>
                <SelectItem value="Special needs">Special needs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className={labelAlign}>{t("form.scholar.grade")}</label>
            <Select value={form.grade} onValueChange={(value) => handleSelectChange("grade", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("form.scholar.gradePh")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KG1">KG1</SelectItem>
                <SelectItem value="KG2">KG2</SelectItem>
                <SelectItem value="1st Grade">1st Grade</SelectItem>
                <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                <SelectItem value="4th Grade">4th Grade</SelectItem>
                <SelectItem value="5th Grade">5th Grade</SelectItem>
                <SelectItem value="6th Grade">6th Grade</SelectItem>
                <SelectItem value="7th Grade">7th Grade</SelectItem>
                <SelectItem value="8th Grade">8th Grade</SelectItem>
                <SelectItem value="9th Grade">9th Grade</SelectItem>
                <SelectItem value="10th Grade">10th Grade</SelectItem>
                <SelectItem value="11th Grade">11th Grade</SelectItem>
                <SelectItem value="12th Grade">12th Grade</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className={labelAlign}>{t("form.scholar.prevSchool")}</label>
            <Input 
              name="prevSchool" 
              value={form.prevSchool} 
              onChange={handleChange} 
              placeholder={t("form.scholar.prevSchoolPh")} 
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelAlign}>{t("form.scholar.notes")}</label>
            <Textarea 
              name="scholarNotes" 
              value={form.scholarNotes} 
              onChange={handleChange} 
              placeholder={t("form.scholar.notesPh")} 
              rows={2} 
            />
          </div>
        </div>
      </div>

      {/* Father Information */}
      <div>
        <h3 className="font-semibold text-green-700 mb-2">{t("form.father.section")}</h3>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${align}`}>
          <div>
            <label className={labelAlign}>{t("form.father.name")}</label>
            <Input 
              name="fatherName" 
              value={form.fatherName} 
              onChange={handleChange} 
              required 
              placeholder={t("form.father.namePh")} 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.father.dob")}</label>
            <Input name="fatherDob" type="date" value={form.fatherDob} onChange={handleChange} />
          </div>
          <div>
            <label className={labelAlign}>{t("form.father.education")}</label>
            <Input 
              name="fatherEducation" 
              value={form.fatherEducation} 
              onChange={handleChange} 
              placeholder={t("form.father.educationPh")} 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.father.occupation")}</label>
            <Input 
              name="fatherOccupation" 
              value={form.fatherOccupation} 
              onChange={handleChange} 
              placeholder={t("form.father.occupationPh")} 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.father.workAddress")}</label>
            <Input 
              name="fatherWorkAddress" 
              value={form.fatherWorkAddress} 
              onChange={handleChange} 
              placeholder={t("form.father.workAddressPh")} 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.father.phone")}</label>
            <Input 
              name="fatherPhone" 
              value={form.fatherPhone} 
              onChange={handleChange} 
              placeholder="Father's home phone" 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.father.email")}</label>
            <Input 
              name="fatherEmail" 
              type="email"
              value={form.fatherEmail} 
              onChange={handleChange} 
              placeholder="Father's email address" 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.father.mobile")}</label>
            <Input 
              name="fatherMobile" 
              value={form.fatherMobile} 
              onChange={handleChange} 
              required 
              placeholder={t("form.father.mobilePh")} 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.father.religion")}</label>
            <Input 
              name="fatherReligion" 
              value={form.fatherReligion} 
              onChange={handleChange} 
              placeholder={t("form.father.religionPh")} 
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelAlign}>{t("form.father.address")}</label>
            <Input 
              name="fatherAddress" 
              value={form.fatherAddress} 
              onChange={handleChange} 
              placeholder={t("form.father.addressPh")} 
            />
          </div>
        </div>
      </div>

      {/* Mother Information */}
      <div>
        <h3 className="font-semibold text-green-700 mb-2">{t("form.mother.section")}</h3>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${align}`}>
          <div>
            <label className={labelAlign}>{t("form.mother.name")}</label>
            <Input 
              name="motherName" 
              value={form.motherName} 
              onChange={handleChange} 
              required 
              placeholder={t("form.mother.namePh")} 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.mother.dob")}</label>
            <Input name="motherDob" type="date" value={form.motherDob} onChange={handleChange} />
          </div>
          <div>
            <label className={labelAlign}>{t("form.mother.education")}</label>
            <Input 
              name="motherEducation" 
              value={form.motherEducation} 
              onChange={handleChange} 
              placeholder={t("form.mother.educationPh")} 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.mother.occupation")}</label>
            <Input 
              name="motherOccupation" 
              value={form.motherOccupation} 
              onChange={handleChange} 
              placeholder={t("form.mother.occupationPh")} 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.mother.phone")}</label>
            <Input 
              name="motherPhone" 
              value={form.motherPhone} 
              onChange={handleChange} 
              placeholder="Mother's home phone" 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.mother.email")}</label>
            <Input 
              name="motherEmail" 
              type="email"
              value={form.motherEmail} 
              onChange={handleChange} 
              placeholder="Mother's email address" 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.mother.mobile")}</label>
            <Input 
              name="motherMobile" 
              value={form.motherMobile} 
              onChange={handleChange} 
              required 
              placeholder={t("form.mother.mobilePh")} 
            />
          </div>
          <div>
            <label className={labelAlign}>{t("form.mother.religion")}</label>
            <Input 
              name="motherReligion" 
              value={form.motherReligion} 
              onChange={handleChange} 
              placeholder={t("form.mother.religionPh")} 
            />
          </div>
          <div className="md:col-span-3">
            <label className={labelAlign}>{t("form.mother.address")}</label>
            <Input 
              name="motherAddress" 
              value={form.motherAddress} 
              onChange={handleChange} 
              placeholder={t("form.mother.addressPh")} 
            />
          </div>
        </div>
      </div>

      {/* Siblings Information */}
      <div>
        <h3 className="font-semibold text-green-700 mb-2">{t("form.siblings.section")}</h3>
        {siblings.map((sibling, index) => (
          <div key={index} className="border border-gray-300 rounded p-4 mb-4">
            <div className={`grid grid-cols-1 md:grid-cols-5 gap-4 ${align}`}>
              <div>
                <label className={labelAlign}>{t("form.siblings.name")}</label>
                <Input 
                  value={sibling.name}
                  onChange={(e) => handleSiblingChange(index, 'name', e.target.value)}
                  placeholder={t("form.siblings.namePh")} 
                />
              </div>
              <div>
                <label className={labelAlign}>{t("form.siblings.grade")}</label>
                <Input 
                  value={sibling.grade}
                  onChange={(e) => handleSiblingChange(index, 'grade', e.target.value)}
                  placeholder={t("form.siblings.gradePh")} 
                />
              </div>
              <div>
                <label className={labelAlign}>{t("form.siblings.age")}</label>
                <Input 
                  value={sibling.age}
                  onChange={(e) => handleSiblingChange(index, 'age', e.target.value)}
                  placeholder={t("form.siblings.agePh")} 
                />
              </div>
              <div>
                <label className={labelAlign}>{t("form.siblings.studentHere")}</label>
                <Select value={sibling.studentHere} onValueChange={(value) => handleSiblingChange(index, 'studentHere', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">{t("form.siblings.yes")}</SelectItem>
                    <SelectItem value="no">{t("form.siblings.no")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={labelAlign}>{t("form.siblings.school")}</label>
                <Input 
                  value={sibling.school}
                  onChange={(e) => handleSiblingChange(index, 'school', e.target.value)}
                  placeholder={t("form.siblings.schoolPh")} 
                />
              </div>
            </div>
            {siblings.length > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => removeSibling(index)}
                className="mt-2"
              >
                {t("form.siblings.removeSibling")}
              </Button>
            )}
          </div>
        ))}
        <Button 
          type="button" 
          variant="outline" 
          onClick={addSibling}
          className="mb-4"
        >
          {t("form.siblings.addSibling")}
        </Button>
      </div>

      <div className="text-center mt-4">
        <Button disabled={submitting} className="w-40 h-12 rounded-full bg-green-700 hover:bg-green-800 text-white font-bold text-lg">
          {submitting ? "Saving..." : t("form.submit")}
        </Button>
      </div>
    </form>
  );
};

export default AdmissionForm;
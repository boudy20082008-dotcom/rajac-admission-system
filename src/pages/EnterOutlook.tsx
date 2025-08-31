
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEmailAuth } from "@/hooks/useEmailAuth";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

const EnterOutlook = () => {
  const { userEmail } = useEmailAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!userEmail) {
      navigate('/parent-portal');
    }
  }, [userEmail, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log('=== DEBUG: Starting form submission ===');
    console.log('userEmail from context:', userEmail);
    console.log('selectedDate:', selectedDate);
    console.log('selectedTime:', selectedTime);
    
    // Debug: Check if userEmail is available
    if (!userEmail) {
      console.log('=== DEBUG: No userEmail found ===');
      setError("Please go back to parent portal and enter your email first.");
      navigate('/parent-portal');
      return;
    }

    if (!selectedDate) {
      setError(t("outlook.selectDate"));
      return;
    }
    if (!selectedTime) {
      setError(t("outlook.selectTime"));
      return;
    }
    
    // Validate hour selection (9, 10, 11, 12)
    const selectedHour = parseInt(selectedTime);
    if (!selectedHour || selectedHour < 9 || selectedHour > 12) {
      setError("Please select a valid hour (9 AM - 12 PM)");
      return;
    }

    setSubmitting(true);

    try {
      const testDate = selectedDate.toISOString().split("T")[0];
      const testTime = `${selectedTime}:00`; // Format as HH:00
      console.log('=== DEBUG: Attempting database update ===');
      console.log('Update data:', { test_date: testDate, test_time: testTime, status: "Test Slot Booked" });
      console.log('Where primary_email =', userEmail);

      // Call edge function to perform the update with service role (bypasses RLS)
      console.log('=== DEBUG: Invoking book-test-slot function ===', { email: userEmail, testDate, testTime });
      const { data: result, error: fnError } = await supabase.functions.invoke('book-test-slot', {
        body: {
          email: userEmail,
          test_date: testDate,
          test_time: testTime,
        }
      });

      if (fnError) {
        console.error('Edge function error:', fnError);
        setError(`Failed to save your selection: ${fnError.message}`);
        setSubmitting(false);
        return;
      }

      if (!result || !result.success) {
        console.error('Unexpected response from book-test-slot:', result);
        setError("Failed to save your selection. Please try again.");
        setSubmitting(false);
        return;
      }

      console.log('=== DEBUG: Update successful via edge function ===');
      toast({
        title: t("outlook.slotBooked"),
        description: t("outlook.slotBookedDesc", { 
          date: format(selectedDate, "PPP"), 
          time: `${selectedTime}:00`
        }),
      });
      setTimeout(() => navigate("/pay-fees", { replace: true }), 1000);
    } catch (error) {
      console.error('Unexpected error:', error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-white font-cairo flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Access Required</h2>
        <p className="text-gray-600 mb-4">Please go through the Parent Portal first to access time selection.</p>
        <Button onClick={() => navigate('/parent-portal')} className="bg-green-700 text-white">
          Go to Parent Portal
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-cairo flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold text-green-800 mb-6">{t("outlook.title")}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center w-full max-w-xs">
        <div className="w-full">
          <label className="font-semibold text-green-700 text-left block mb-1">{t("outlook.chooseDate")}</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>{t("outlook.pickDate")}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="p-3 pointer-events-auto"
                disabled={date => {
                  const today = new Date(new Date().setHours(0,0,0,0));
                  const dayOfWeek = date.getDay();
                  // Disable past dates and weekends (0=Sunday, 6=Saturday)
                  // Only allow Monday(1) to Thursday(4)
                  return date < today || dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full">
          <label className="font-semibold text-green-700 text-left block mb-1">{t("outlook.chooseTime")}</label>
          <select
            value={selectedTime}
            onChange={e => setSelectedTime(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-lg w-full bg-white z-10"
            required
          >
            <option value="">Select Hour</option>
            <option value="09">9 AM</option>
            <option value="10">10 AM</option>
            <option value="11">11 AM</option>
            <option value="12">12 PM</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Available: 9 AM - 12 PM, Monday-Thursday only</p>
        </div>
        <Button type="submit" disabled={submitting} className="rounded-lg bg-green-700 text-white font-bold mt-2 w-full">
          {submitting ? t("outlook.saving") : t("outlook.confirmSlot")}
        </Button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default EnterOutlook;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          password_hash: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          password_hash: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          password_hash?: string
        }
        Relationships: []
      }
      admission_forms: {
        Row: {
          address: string | null
          admin_notes: string | null
          citizenship: string | null
          created_at: string | null
          dob: string | null
          father_address: string | null
          father_business: string | null
          father_degree: string | null
          father_dob: string | null
          father_education: string | null
          father_email: string | null
          father_mobile: string | null
          father_name: string | null
          father_occupation: string | null
          father_phone: string | null
          father_religion: string | null
          father_work: string | null
          father_work_address: string | null
          gender: string | null
          grade: string | null
          id: string
          mother_address: string | null
          mother_business: string | null
          mother_degree: string | null
          mother_dob: string | null
          mother_education: string | null
          mother_email: string | null
          mother_mobile: string | null
          mother_name: string | null
          mother_occupation: string | null
          mother_phone: string | null
          mother_religion: string | null
          mother_work: string | null
          parent_passport_id: string | null
          payment_status: string | null
          payment_transaction_id: string | null
          prev_school: string | null
          primary_email: string | null
          religion: string | null
          scholar_notes: string | null
          school: string | null
          second_lang: string | null
          siblings_info: Json | null
          status: string | null
          student_email: string | null
          student_first_name: string | null
          student_full_name: string | null
          student_home_number: string | null
          student_last_name: string | null
          student_name_ar: string | null
          student_nationality: string | null
          test_date: string | null
          test_result: string | null
          test_time: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          citizenship?: string | null
          created_at?: string | null
          dob?: string | null
          father_address?: string | null
          father_business?: string | null
          father_degree?: string | null
          father_dob?: string | null
          father_education?: string | null
          father_email?: string | null
          father_mobile?: string | null
          father_name?: string | null
          father_occupation?: string | null
          father_phone?: string | null
          father_religion?: string | null
          father_work?: string | null
          father_work_address?: string | null
          gender?: string | null
          grade?: string | null
          id?: string
          mother_address?: string | null
          mother_business?: string | null
          mother_degree?: string | null
          mother_dob?: string | null
          mother_education?: string | null
          mother_email?: string | null
          mother_mobile?: string | null
          mother_name?: string | null
          mother_occupation?: string | null
          mother_phone?: string | null
          mother_religion?: string | null
          mother_work?: string | null
          parent_passport_id?: string | null
          payment_status?: string | null
          payment_transaction_id?: string | null
          prev_school?: string | null
          primary_email?: string | null
          religion?: string | null
          scholar_notes?: string | null
          school?: string | null
          second_lang?: string | null
          siblings_info?: Json | null
          status?: string | null
          student_email?: string | null
          student_first_name?: string | null
          student_full_name?: string | null
          student_home_number?: string | null
          student_last_name?: string | null
          student_name_ar?: string | null
          student_nationality?: string | null
          test_date?: string | null
          test_result?: string | null
          test_time?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          citizenship?: string | null
          created_at?: string | null
          dob?: string | null
          father_address?: string | null
          father_business?: string | null
          father_degree?: string | null
          father_dob?: string | null
          father_education?: string | null
          father_email?: string | null
          father_mobile?: string | null
          father_name?: string | null
          father_occupation?: string | null
          father_phone?: string | null
          father_religion?: string | null
          father_work?: string | null
          father_work_address?: string | null
          gender?: string | null
          grade?: string | null
          id?: string
          mother_address?: string | null
          mother_business?: string | null
          mother_degree?: string | null
          mother_dob?: string | null
          mother_education?: string | null
          mother_email?: string | null
          mother_mobile?: string | null
          mother_name?: string | null
          mother_occupation?: string | null
          mother_phone?: string | null
          mother_religion?: string | null
          mother_work?: string | null
          parent_passport_id?: string | null
          payment_status?: string | null
          payment_transaction_id?: string | null
          prev_school?: string | null
          primary_email?: string | null
          religion?: string | null
          scholar_notes?: string | null
          school?: string | null
          second_lang?: string | null
          siblings_info?: Json | null
          status?: string | null
          student_email?: string | null
          student_first_name?: string | null
          student_full_name?: string | null
          student_home_number?: string | null
          student_last_name?: string | null
          student_name_ar?: string | null
          student_nationality?: string | null
          test_date?: string | null
          test_result?: string | null
          test_time?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_list_admission_forms: {
        Args: { p_admin_email: string; p_admin_password: string }
        Returns: {
          address: string | null
          admin_notes: string | null
          citizenship: string | null
          created_at: string | null
          dob: string | null
          father_address: string | null
          father_business: string | null
          father_degree: string | null
          father_dob: string | null
          father_education: string | null
          father_email: string | null
          father_mobile: string | null
          father_name: string | null
          father_occupation: string | null
          father_phone: string | null
          father_religion: string | null
          father_work: string | null
          father_work_address: string | null
          gender: string | null
          grade: string | null
          id: string
          mother_address: string | null
          mother_business: string | null
          mother_degree: string | null
          mother_dob: string | null
          mother_education: string | null
          mother_email: string | null
          mother_mobile: string | null
          mother_name: string | null
          mother_occupation: string | null
          mother_phone: string | null
          mother_religion: string | null
          mother_work: string | null
          parent_passport_id: string | null
          payment_status: string | null
          payment_transaction_id: string | null
          prev_school: string | null
          primary_email: string | null
          religion: string | null
          scholar_notes: string | null
          school: string | null
          second_lang: string | null
          siblings_info: Json | null
          status: string | null
          student_email: string | null
          student_first_name: string | null
          student_full_name: string | null
          student_home_number: string | null
          student_last_name: string | null
          student_name_ar: string | null
          student_nationality: string | null
          test_date: string | null
          test_result: string | null
          test_time: string | null
          user_id: string | null
        }[]
      }
      admin_update_admission_form: {
        Args: {
          p_admin_email: string
          p_admin_notes: string
          p_admin_password: string
          p_id: string
          p_status: string
          p_test_result: string
        }
        Returns: boolean
      }
      get_admission_form_by_email: {
        Args: { p_email: string }
        Returns: {
          address: string | null
          admin_notes: string | null
          citizenship: string | null
          created_at: string | null
          dob: string | null
          father_address: string | null
          father_business: string | null
          father_degree: string | null
          father_dob: string | null
          father_education: string | null
          father_email: string | null
          father_mobile: string | null
          father_name: string | null
          father_occupation: string | null
          father_phone: string | null
          father_religion: string | null
          father_work: string | null
          father_work_address: string | null
          gender: string | null
          grade: string | null
          id: string
          mother_address: string | null
          mother_business: string | null
          mother_degree: string | null
          mother_dob: string | null
          mother_education: string | null
          mother_email: string | null
          mother_mobile: string | null
          mother_name: string | null
          mother_occupation: string | null
          mother_phone: string | null
          mother_religion: string | null
          mother_work: string | null
          parent_passport_id: string | null
          payment_status: string | null
          payment_transaction_id: string | null
          prev_school: string | null
          primary_email: string | null
          religion: string | null
          scholar_notes: string | null
          school: string | null
          second_lang: string | null
          siblings_info: Json | null
          status: string | null
          student_email: string | null
          student_first_name: string | null
          student_full_name: string | null
          student_home_number: string | null
          student_last_name: string | null
          student_name_ar: string | null
          student_nationality: string | null
          test_date: string | null
          test_result: string | null
          test_time: string | null
          user_id: string | null
        }[]
      }
      is_admin: {
        Args: { check_user_id?: string }
        Returns: boolean
      }
      verify_admin_login: {
        Args: { admin_email: string; admin_password: string }
        Returns: {
          email: string
          id: string
          name: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

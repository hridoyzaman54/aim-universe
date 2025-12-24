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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_courses: {
        Row: {
          category: string
          class: string
          course_id: number
          created_at: string
          created_by: string
          description: string | null
          duration: string | null
          id: string
          instructor: string
          is_free: boolean
          is_published: boolean
          price: string
          subject: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category: string
          class: string
          course_id: number
          created_at?: string
          created_by: string
          description?: string | null
          duration?: string | null
          id?: string
          instructor: string
          is_free?: boolean
          is_published?: boolean
          price?: string
          subject: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string
          class?: string
          course_id?: number
          created_at?: string
          created_by?: string
          description?: string | null
          duration?: string | null
          id?: string
          instructor?: string
          is_free?: boolean
          is_published?: boolean
          price?: string
          subject?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean
          message: string
          priority: string
          target_roles: string[] | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message: string
          priority?: string
          target_roles?: string[] | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message?: string
          priority?: string
          target_roles?: string[] | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          counsellor_name: string | null
          created_at: string
          id: string
          notes: string | null
          preferred_date: string
          preferred_time: string | null
          service_type: string
          session_type: string
          status: string
          student_id: string | null
          student_name: string | null
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          counsellor_name?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          preferred_date: string
          preferred_time?: string | null
          service_type: string
          session_type: string
          status?: string
          student_id?: string | null
          student_name?: string | null
          updated_at?: string
          user_id: string
          user_type: string
        }
        Update: {
          counsellor_name?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          preferred_date?: string
          preferred_time?: string | null
          service_type?: string
          session_type?: string
          status?: string
          student_id?: string | null
          student_name?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: number
          course_title: string
          enrolled_at: string
          id: string
          progress: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: number
          course_title: string
          enrolled_at?: string
          id?: string
          progress?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: number
          course_title?: string
          enrolled_at?: string
          id?: string
          progress?: number
          user_id?: string
        }
        Relationships: []
      }
      course_materials: {
        Row: {
          course_id: number
          created_at: string
          created_by: string
          file_size: string | null
          file_url: string
          id: string
          title: string
          type: string
        }
        Insert: {
          course_id: number
          created_at?: string
          created_by: string
          file_size?: string | null
          file_url: string
          id?: string
          title: string
          type: string
        }
        Update: {
          course_id?: number
          created_at?: string
          created_by?: string
          file_size?: string | null
          file_url?: string
          id?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          course_id: number
          created_at: string
          id: string
          lesson_id: string
          lesson_title: string
          updated_at: string
          user_id: string
          watched_seconds: number | null
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          course_id: number
          created_at?: string
          id?: string
          lesson_id: string
          lesson_title: string
          updated_at?: string
          user_id: string
          watched_seconds?: number | null
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          course_id?: number
          created_at?: string
          id?: string
          lesson_id?: string
          lesson_title?: string
          updated_at?: string
          user_id?: string
          watched_seconds?: number | null
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          created_at: string
          id: string
          mood: string
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood: string
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood?: string
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      parent_student_links: {
        Row: {
          created_at: string
          id: string
          parent_user_id: string
          student_email: string
          student_id: string
          student_name: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          parent_user_id: string
          student_email: string
          student_id: string
          student_name: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          parent_user_id?: string
          student_email?: string
          student_id?: string
          student_name?: string
          verified?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          student_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          student_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          student_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_student_id: { Args: never; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "parent" | "admin"
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
    Enums: {
      app_role: ["student", "parent", "admin"],
    },
  },
} as const

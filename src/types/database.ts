export type OrderStatus = "waiting" | "completed" | "rejected";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  cover_image: string | null;
  preview_images: string[] | null;
  pdf_path: string | null;
  modules: string[] | null;
  is_published: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  course_id: string;
  status: OrderStatus;
  pdf_password: string | null;
  download_token: string | null;
  delivered_at: string | null;
  created_at: string;
  course?: Course;
  profile?: Profile;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at"> & { created_at?: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      courses: {
        Row: Course;
        Insert: Omit<Course, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Course>;
        Relationships: [];
      };
      orders: {
        Row: Omit<Order, "course" | "profile">;
        Insert: Omit<Order, "id" | "created_at" | "course" | "profile"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Order, "course" | "profile">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

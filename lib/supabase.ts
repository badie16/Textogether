import { createClient } from "@supabase/supabase-js";

// These would be environment variables in a real application
const supabaseUrl = "https://gesaavthgwabqvbiiisi.supabase.co";
const supabaseAnonKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlc2FhdnRoZ3dhYnF2YmlpaXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4ODg5MzQsImV4cCI6MjA2MjQ2NDkzNH0.ppYJ0DP6vbSdOODcvNFQNEueju6yVZ54j6pp7GXAxxE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

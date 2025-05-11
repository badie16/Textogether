import { createClient } from "@supabase/supabase-js"

// Utiliser les variables d'environnement qui ont été ajoutées au projet
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Vérifier que les variables d'environnement sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Les variables d'environnement Supabase ne sont pas définies")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

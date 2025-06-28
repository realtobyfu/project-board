import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Enhanced error logging for deployment debugging
if (!supabaseUrl) {
  console.error('SUPABASE_URL environment variable is missing');
}

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_KEY environment variable is missing');
}

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Key must be provided in environment variables');
}

// Create a Supabase client with the service key for admin access
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Test the connection (disabled for local development)
// (async () => {
//   try {
//     const { data, error } = await supabase
//       .from('projects')
//       .select('count', { count: 'exact' })
//       .limit(1);
//     if (error) {
//       console.error('Supabase connection test failed:', error);
//     } else {
//       console.log('Supabase connection established successfully');
//     }
//   } catch (err) {
//     console.error('Supabase connection test error:', err);
//   }
// })();

export default supabase;

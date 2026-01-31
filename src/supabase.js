import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://baenytyzmyegtwuverlc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZW55dHl6bXllZ3R3dXZlcmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MzcxNjMsImV4cCI6MjA4NTMxMzE2M30.P-UqfJs-tAZQtX5tXpA30upYOGBvm9CPZTt-3-NjlR8'

export const supabase = createClient(supabaseUrl, supabaseKey)

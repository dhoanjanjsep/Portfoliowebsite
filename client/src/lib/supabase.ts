import { createClient } from '@supabase/supabase-js'

// Supabase 프로젝트 설정
const supabaseUrl = 'https://zzolnfllmmgairourgcc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6b2xuZmxsbW1nYWlyb3VyZ2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NjQ0NTgsImV4cCI6MjA3MDQ0MDQ1OH0.1QJTp3BtyWr72u-rZx-91RS6nlkj7Wjb43JFBsIl5P0'

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 개발 일지 관련 타입 정의 (BlogPost와 일치)
export interface DevLog {
  id: string
  title: string
  content: string
  category: string
  tags: string[] | null
  imageUrl: string | null
  views: number
  createdAt: string
  updatedAt: string
}

export interface CreateDevLogData {
  title: string
  content: string
  category: string
  tags: string[] | null
  imageUrl?: string | null
}

export interface UpdateDevLogData {
  title?: string
  content?: string
  category?: string
  tags?: string[] | null
  imageUrl?: string | null
}

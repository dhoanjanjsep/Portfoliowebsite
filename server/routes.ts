import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { fileURLToPath, URL } from "node:url";
import { z } from "zod";
import { insertGameSchema, insertProjectSchema } from "@shared/schema";
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zzolnfllmmgairourgcc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6b2xuZmxsbW1nYWlyb3VyZ2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NjQ0NTgsImV4cCI6MjA3MDQ0MDQ1OH0.1QJTp3BtyWr72u-rZx-91RS6nlkj7Wjb43JFBsIl5P0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for Unity WebGL builds
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Games Routes
  app.get("/api/games", async (req, res) => {
    try {
      // Supabase를 사용하도록 수정 예정
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  app.post("/api/games", upload.single('buildFile'), async (req, res) => {
    try {
      const gameData = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        buildPath: req.file?.path || undefined,
        thumbnailUrl: req.body.thumbnailUrl
      };
      
      const validatedGame = insertGameSchema.parse(gameData);
      // Supabase를 사용하도록 수정 예정
      res.status(201).json(validatedGame);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create game" });
    }
  });

  app.delete("/api/games/:id", async (req, res) => {
    try {
      // Supabase를 사용하도록 수정 예정
      res.json({ message: "Game deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete game" });
    }
  });

  // DevLog Routes - 메인 엔드포인트
  app.get("/api/dev-logs", async (req, res) => {
    try {
      console.log('DevLog API 호출됨');
      
      const { category, tags, search } = req.query;
      let query = supabase
        .from('dev_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      // 카테고리 필터링
      if (category && category !== '전체 카테고리') {
        query = query.eq('category', category);
      }
      
      // 태그 검색
      if (tags) {
        try {
          const tagArray = JSON.parse(tags as string);
          if (Array.isArray(tagArray)) {
            query = query.overlaps('tags', tagArray);
          }
        } catch (e) {
          console.error('태그 파싱 오류:', e);
        }
      }
      
      // 텍스트 검색
      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Supabase 오류:', error);
        return res.status(500).json({ message: "Failed to fetch dev logs", error: error.message });
      }
      
      console.log('가져온 DevLog 데이터:', data);
      res.json(data || []);
    } catch (error) {
      console.error('DevLog API 오류:', error);
      res.status(500).json({ message: "Failed to fetch dev logs" });
    }
  });

  app.post("/api/dev-logs", async (req, res) => {
    try {
      console.log('DevLog 생성 요청:', req.body);
      
      const { title, content, category, tags, imageUrl } = req.body;
      
      // 필수 필드 검증
      if (!title || !content || !category) {
        return res.status(400).json({ 
          message: "Title, content, and category are required" 
        });
      }
      
      const { data, error } = await supabase
        .from('dev_logs')
        .insert([{ 
          title, 
          content, 
          category, 
          tags: tags || null, 
          image_url: imageUrl || null,
          views: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) {
        console.error('DevLog 생성 오류:', error);
        return res.status(500).json({ message: "Failed to create dev log", error: error.message });
      }
      
      console.log('생성된 DevLog:', data[0]);
      res.status(201).json(data[0]);
    } catch (error) {
      console.error('DevLog 생성 오류:', error);
      res.status(500).json({ message: "Failed to create dev log" });
    }
  });

  // 특정 DevLog 조회
  app.get("/api/dev-logs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('dev_logs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('DevLog 조회 오류:', error);
        return res.status(404).json({ message: "DevLog not found", error: error.message });
      }
      
      res.json(data);
    } catch (error) {
      console.error('DevLog 조회 오류:', error);
      res.status(500).json({ message: "Failed to fetch dev log" });
    }
  });

  // DevLog 수정
  app.put("/api/dev-logs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // updated_at 필드 자동 설정
      updateData.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('dev_logs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('DevLog 수정 오류:', error);
        return res.status(500).json({ message: "Failed to update dev log", error: error.message });
      }
      
      res.json(data);
    } catch (error) {
      console.error('DevLog 수정 오류:', error);
      res.status(500).json({ message: "Failed to update dev log" });
    }
  });

  // DevLog 삭제
  app.delete("/api/dev-logs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const { error } = await supabase
        .from('dev_logs')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('DevLog 삭제 오류:', error);
        return res.status(500).json({ message: "Failed to delete dev log", error: error.message });
      }
      
      res.json({ message: "DevLog deleted successfully" });
    } catch (error) {
      console.error('DevLog 삭제 오류:', error);
      res.status(500).json({ message: "Failed to delete dev log" });
    }
  });

  // 조회수 증가
  app.post("/api/dev-logs/:id/views", async (req, res) => {
    try {
      const { id } = req.params;
      
      const { error } = await supabase
        .from('dev_logs')
        .update({ views: supabase.rpc('increment_views', { log_id: id }) })
        .eq('id', id);
      
      if (error) {
        console.error('조회수 증가 오류:', error);
        return res.status(500).json({ message: "Failed to increment views", error: error.message });
      }
      
      res.json({ message: "Views incremented successfully" });
    } catch (error) {
      console.error('조회수 증가 오류:', error);
      res.status(500).json({ message: "Failed to increment views" });
    }
  });

  // Projects Routes
  app.get("/api/projects", async (req, res) => {
    try {
      // Supabase를 사용하도록 수정 예정
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedProject = insertProjectSchema.parse(req.body);
      // Supabase를 사용하도록 수정 예정
      res.status(201).json(validatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // File upload for images
  app.post("/api/upload", upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    res.json({ 
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`
    });
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  // Blog posts API (dev-logs로 리다이렉트)
  app.get("/api/blog-posts", async (req, res) => {
    try {
      console.log('Blog posts API 호출됨 - dev-logs로 리다이렉트');
      
      const { data, error } = await supabase
        .from('dev_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase 오류:', error);
        return res.status(500).json({ message: "Failed to fetch blog posts", error: error.message });
      }
      
      console.log('가져온 Blog posts 데이터:', data);
      res.json(data || []);
    } catch (error) {
      console.error('Blog posts API 오류:', error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, projectType, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ message: "Name, email, and message are required" });
      }

      // In a real app, this would send an email
      console.log('Contact form submission:', { name, email, projectType, message });
      
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

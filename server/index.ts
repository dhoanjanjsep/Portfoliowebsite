import 'dotenv/config'; // .env 파일 로드
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경변수 설정 (Windows 환경 대응)
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// Supabase 환경변수 설정
if (!process.env.VITE_SUPABASE_URL) {
  process.env.VITE_SUPABASE_URL = 'https://zzolnfllmmgairourgcc.supabase.co';
}
if (!process.env.VITE_SUPABASE_ANON_KEY) {
  process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6b2xuZmxsbW1nYWlyb3VyZ2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NjQ0NTgsImV4cCI6MjA3MDQ0MDQ1OH0.1QJTp3BtyWr72u-rZx-91RS6nlkj7Wjb43JFBsIl5P0';
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:Xi8AOp3@Bqr@db.zzolnfllmmgairourgcc.supabase.co:5432/postgres';
}

console.log(`서버가 ${process.env.NODE_ENV} 모드로 시작됩니다.`);
console.log(`Supabase URL: ${process.env.VITE_SUPABASE_URL}`);
console.log(`Database URL: ${process.env.DATABASE_URL}`);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS 설정 추가
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

const PORT = parseInt(process.env.PORT || '3000', 10);

// 사용 가능한 포트들을 시도
const tryPort = (port: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(port, () => {
      server.close();
      resolve(port);
    });
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        resolve(tryPort(port + 1));
      } else {
        reject(err);
      }
    });
  });
};

// 서버 시작
async function startServer() {
  try {
    const availablePort = await tryPort(PORT);
    const httpServer = await registerRoutes(app);
    
    // 개발 모드에서는 Vite 미들웨어 설정
    if (process.env.NODE_ENV === 'development') {
      await setupVite(app, httpServer);
    } else {
      // 프로덕션 모드에서는 정적 파일 서빙
      serveStatic(app);
    }
    
    httpServer.listen(availablePort, () => {
      console.log(`🚀 서버가 포트 ${availablePort}에서 실행 중입니다.`);
      if (process.env.NODE_ENV === 'development') {
        console.log(`🌐 통합 서버: http://localhost:${availablePort}`);
        console.log(`📱 클라이언트와 서버가 통합되어 실행 중입니다.`);
      } else {
        console.log(`🌐 프로덕션 서버: http://localhost:${availablePort}`);
        console.log(`📁 정적 파일 서빙: dist/public/`);
      }
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
}

startServer();

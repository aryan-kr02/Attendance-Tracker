import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getOrCreateStudentData } from './src/data/students.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // GET /api/student/:registrationNo - Returns student profile info
  app.get('/api/student/:registrationNo', (req, res) => {
    const { registrationNo } = req.params;
    if (!registrationNo || registrationNo.trim().length === 0) {
      return res.status(400).json({ error: 'Registration number is required' });
    }
    const data = getOrCreateStudentData(registrationNo);
    return res.json(data.student);
  });

  // GET /api/student/:registrationNo/subjects - Returns subject-wise attendance
  app.get('/api/student/:registrationNo/subjects', (req, res) => {
    const { registrationNo } = req.params;
    const data = getOrCreateStudentData(registrationNo);
    return res.json(data.subjects);
  });

  // GET /api/student/:registrationNo/attendance - Returns overall attendance metrics & insights
  app.get('/api/student/:registrationNo/attendance', (req, res) => {
    const { registrationNo } = req.params;
    const data = getOrCreateStudentData(registrationNo);
    return res.json({
      overall: data.overall,
      trend: data.trend,
      insights: data.insights,
    });
  });

  // GET /api/student/:registrationNo/history - Returns attendance log/history
  app.get('/api/student/:registrationNo/history', (req, res) => {
    const { registrationNo } = req.params;
    const data = getOrCreateStudentData(registrationNo);
    return res.json(data.history);
  });

  // GET /api/student/:registrationNo/all - Combined payload for smooth single-roundtrip load
  app.get('/api/student/:registrationNo/all', (req, res) => {
    const { registrationNo } = req.params;
    const data = getOrCreateStudentData(registrationNo);
    return res.json(data);
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Attendance Portal Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

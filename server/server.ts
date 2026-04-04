import express from 'express';
import cors from 'cors';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'lessonlens-api', timestamp: Date.now() });
});

// ── Sync endpoint ──────────────────────────────
// Teachers with internet can sync anonymized class statistics
// to the cloud for district-level dashboards.

interface SyncPayload {
  schoolId: string;
  teacherId: string;
  stats: {
    totalStudents: number;
    totalScans: number;
    averageScore: number;
    commonGaps: { concept: string; count: number }[];
    scoreDistribution: { range: string; count: number }[];
  };
  syncedAt: number;
}

// In-memory store for demo; replace with GCP Firestore / Cloud SQL in production
const syncStore: SyncPayload[] = [];

app.post('/api/sync', (req, res) => {
  const payload = req.body as SyncPayload;

  if (!payload.schoolId || !payload.teacherId || !payload.stats) {
    res.status(400).json({ error: 'Missing required fields: schoolId, teacherId, stats' });
    return;
  }

  payload.syncedAt = Date.now();
  syncStore.push(payload);

  console.log(`[Sync] ${payload.teacherId} @ ${payload.schoolId} — ${payload.stats.totalScans} scans`);

  res.json({ success: true, syncedAt: payload.syncedAt });
});

// District-level aggregate (for admin dashboards)
app.get('/api/district/:schoolId', (req, res) => {
  const schoolData = syncStore.filter(
    (s) => s.schoolId === req.params.schoolId,
  );

  if (schoolData.length === 0) {
    res.status(404).json({ error: 'No data for this school' });
    return;
  }

  const totalScans = schoolData.reduce((a, s) => a + s.stats.totalScans, 0);
  const avgScore = Math.round(
    schoolData.reduce((a, s) => a + s.stats.averageScore, 0) / schoolData.length,
  );

  const gapMap = new Map<string, number>();
  for (const s of schoolData) {
    for (const g of s.stats.commonGaps) {
      gapMap.set(g.concept, (gapMap.get(g.concept) ?? 0) + g.count);
    }
  }

  const commonGaps = Array.from(gapMap.entries())
    .map(([concept, count]) => ({ concept, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  res.json({
    schoolId: req.params.schoolId,
    teacherCount: new Set(schoolData.map((s) => s.teacherId)).size,
    totalScans,
    averageScore: avgScore,
    commonGaps,
    lastSync: Math.max(...schoolData.map((s) => s.syncedAt)),
  });
});

app.listen(PORT, () => {
  console.log(`LessonLens API running on port ${PORT}`);
});

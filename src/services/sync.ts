import axios from 'axios';
import type { ClassStats } from '../types';

const SYNC_API =
  import.meta.env.VITE_SYNC_API_URL ?? 'http://localhost:3001';

export async function syncToCloud(
  schoolId: string,
  teacherId: string,
  stats: ClassStats,
): Promise<{ success: boolean; syncedAt: number }> {
  const response = await axios.post(`${SYNC_API}/api/sync`, {
    schoolId,
    teacherId,
    stats: {
      totalStudents: stats.totalStudents,
      totalScans: stats.totalScans,
      averageScore: stats.averageScore,
      commonGaps: stats.commonGaps,
      scoreDistribution: stats.scoreDistribution,
    },
  });
  return response.data;
}

export async function checkCloudStatus(): Promise<boolean> {
  try {
    const res = await axios.get(`${SYNC_API}/health`, { timeout: 3000 });
    return res.data.status === 'ok';
  } catch {
    return false;
  }
}

import { Grid, Paper, Typography } from '@mui/material';
import KpiCard from '../components/KpiCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

type DashboardSummary = {
  totalProjects: number;
  openRisks: number;
  highSeverityRisks: number;
  breaches: number;
  riskTrend: Array<{ date: string; risks: number }>;
  byCategory: Array<{ category: string; count: number }>;
};

const mockSummary: DashboardSummary = {
  totalProjects: 12,
  openRisks: 37,
  highSeverityRisks: 9,
  breaches: 3,
  riskTrend: [
    { date: '2025-08', risks: 25 },
    { date: '2025-09', risks: 29 },
    { date: '2025-10', risks: 33 },
    { date: '2025-11', risks: 35 },
    { date: '2025-12', risks: 36 },
    { date: '2025-13', risks: 37 },
  ],
  byCategory: [
    { category: 'Schedule', count: 12 },
    { category: 'Budget', count: 8 },
    { category: 'Scope', count: 10 },
    { category: 'Quality', count: 7 },
  ],
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    if (!baseURL) {
      // No backend yet — use mock
      setSummary(mockSummary);
      return;
    }
    axios.get(`${baseURL}/api/dashboard/summary`)
      .then((res) => setSummary(res.data))
      .catch(() => setSummary(mockSummary));
  }, []);

  if (!summary) return null;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}><KpiCard title="Total Projects" value={summary.totalProjects} color="#1976d2" /></Grid>
      <Grid item xs={12} md={3}><KpiCard title="Open Risks" value={summary.openRisks} color="#ef6c00" /></Grid>
      <Grid item xs={12} md={3}><KpiCard title="High Severity" value={summary.highSeverityRisks} color="#d32f2f" /></Grid>
      <Grid item xs={12} md={3}><KpiCard title="Breaches" value={summary.breaches} color="#6a1b9a" /></Grid>

      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, height: 360 }}>
          <Typography variant="h6" gutterBottom>Risk Trend</Typography>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={summary.riskTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="risks" stroke="#1976d2" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: 360 }}>
          <Typography variant="h6" gutterBottom>Risks by Category</Typography>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={summary.byCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ef6c00" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}
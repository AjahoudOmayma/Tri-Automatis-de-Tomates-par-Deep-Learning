import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Activity, CheckCircle2, XCircle, Target, Clock, TrendingUp, Cpu, Zap } from "lucide-react";
import { PageWrapper } from "../components/page-wrapper";

interface DashboardData {
  total_analyzed: number;
  fresh_count: number;
  rotten_count: number;
  accuracy: number;
  avg_inference_time: number;
  chart_data: Array<{ date: string; fresh: number; rotten: number; total: number }>;
  recent_detections: Array<{
    id: string; timestamp: string; total_tomatoes: number;
    fresh_count: number; rotten_count: number; average_confidence: number; inference_time: number;
  }>;
}

export function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000); // Rafraîchit toutes les 5 sec
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/dashboard-stats");
      const data = await response.json();
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur dashboard:", error);
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return <PageWrapper><div className="p-8">Chargement...</div></PageWrapper>;
  }

  const stats = [
    { title: "Total Analyzed", value: dashboardData.total_analyzed.toString(), change: "+0%", icon: Activity, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Fresh Tomatoes", value: dashboardData.fresh_count.toString(), change: "+0%", icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Rotten Detected", value: dashboardData.rotten_count.toString(), change: "-0%", icon: XCircle, color: "text-red-600", bgColor: "bg-red-50" },
    { title: "Accuracy", value: `${dashboardData.accuracy}%`, change: "+0%", icon: Target, color: "text-purple-600", bgColor: "bg-purple-50" },
  ];

  const systemStats = [
    { label: "Avg Inference Time", value: `${dashboardData.avg_inference_time}ms`, icon: Clock },
    { label: "GPU Utilization", value: "67%", icon: Cpu },
    { label: "Throughput", value: "23/min", icon: Zap },
    { label: "Uptime", value: "99.8%", icon: TrendingUp },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Real-time analytics for automated tomato sorting system</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}><stat.icon className={`size-4 ${stat.color}`} /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader><CardTitle>Detection Trends</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.chart_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="fresh" fill="#22c55e" name="Fresh" />
                  <Bar dataKey="rotten" fill="#ef4444" name="Rotten" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader><CardTitle>System Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-primary/10 p-2"><stat.icon className="size-4" /></div>
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <span className="font-semibold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Detections</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead><TableHead>Total</TableHead><TableHead>Fresh</TableHead>
                  <TableHead>Rotten</TableHead><TableHead>Confidence</TableHead><TableHead>Inference Time</TableHead><TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.recent_detections.length > 0 ? (
                  dashboardData.recent_detections.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{new Date(result.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{result.total_tomatoes}</TableCell>
                      <TableCell className="text-green-600">{result.fresh_count}</TableCell>
                      <TableCell className="text-red-600">{result.rotten_count}</TableCell>
                      <TableCell>{(result.average_confidence * 100).toFixed(1)}%</TableCell>
                      <TableCell>{result.inference_time}ms</TableCell>
                      <TableCell><Badge>{result.average_confidence > 0.9 ? "Excellent" : "Good"}</Badge></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={7} className="text-center">Aucune détection récente</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
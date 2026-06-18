import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Bug,
  CheckCircle2,
  Clock,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { PageWrapper } from "../components/page-wrapper";

interface DetectionRecord {
  id: number;
  timestamp: string;
  filename: string;
  totalDetections: number;
  anthracnose: number;
  blossomEndRot: number;
  healthy: number;
  spottedWiltVirus: number;
  averageConfidence: number;
}

interface ChartItem {
  date: string;
  anthracnose: number;
  blossom: number;
  healthy: number;
  virus: number;
}

interface DashboardStats {
  totalAnalyzed: number;
  totalTomatoes: number;
  anthracnoseCount: number;
  blossomEndRotCount: number;
  healthyCount: number;
  spottedWiltVirusCount: number;
  avgConfidence: number;
  avgInferenceTime: number;
  chartData: ChartItem[];
  recentDetections: DetectionRecord[];
}

const API_BASE_URL = "http://127.0.0.1:5000";

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/history`);
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const history: DetectionRecord[] = await response.json();

      const sortedHistory = [...history].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      const totalAnalyzed = sortedHistory.length;
      const totalTomatoes = sortedHistory.reduce(
        (sum, item) => sum + item.totalDetections,
        0
      );
      const anthracnoseCount = sortedHistory.reduce(
        (sum, item) => sum + item.anthracnose,
        0
      );
      const blossomEndRotCount = sortedHistory.reduce(
        (sum, item) => sum + item.blossomEndRot,
        0
      );
      const healthyCount = sortedHistory.reduce(
        (sum, item) => sum + item.healthy,
        0
      );
      const spottedWiltVirusCount = sortedHistory.reduce(
        (sum, item) => sum + item.spottedWiltVirus,
        0
      );

      const avgConfidence =
        totalAnalyzed > 0
          ? (sortedHistory.reduce(
              (sum, item) => sum + item.averageConfidence,
              0
            ) /
              totalAnalyzed) *
            100
          : 0;

      const chartData: ChartItem[] = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - i);

        chartData.push({
          date: date.toLocaleDateString("en-US", { weekday: "short" }),
          anthracnose: 0,
          blossom: 0,
          healthy: 0,
          virus: 0,
        });
      }

      sortedHistory.forEach((record) => {
        const recordDate = new Date(record.timestamp);
        const today = new Date();

        const startOfToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        const startOfRecordDate = new Date(
          recordDate.getFullYear(),
          recordDate.getMonth(),
          recordDate.getDate()
        );

        const diffMs = startOfToday.getTime() - startOfRecordDate.getTime();
        const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (daysAgo >= 0 && daysAgo < 7) {
          const dayIndex = 6 - daysAgo;
          chartData[dayIndex].anthracnose += record.anthracnose;
          chartData[dayIndex].blossom += record.blossomEndRot;
          chartData[dayIndex].healthy += record.healthy;
          chartData[dayIndex].virus += record.spottedWiltVirus;
        }
      });

      setStats({
        totalAnalyzed,
        totalTomatoes,
        anthracnoseCount,
        blossomEndRotCount,
        healthyCount,
        spottedWiltVirusCount,
        avgConfidence,
        avgInferenceTime: 43.5,
        chartData,
        recentDetections: sortedHistory.slice(0, 5),
      });
    } catch (error) {
      console.error("Erreur dashboard:", error);

      setStats({
        totalAnalyzed: 0,
        totalTomatoes: 0,
        anthracnoseCount: 0,
        blossomEndRotCount: 0,
        healthyCount: 0,
        spottedWiltVirusCount: 0,
        avgConfidence: 0,
        avgInferenceTime: 43.5,
        chartData: Array.from({ length: 7 }, (_, index) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - index));

          return {
            date: date.toLocaleDateString("en-US", { weekday: "short" }),
            anthracnose: 0,
            blossom: 0,
            healthy: 0,
            virus: 0,
          };
        }),
        recentDetections: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <PageWrapper>
        <div className="p-8">Chargement...</div>
      </PageWrapper>
    );
  }

  if (!stats) {
    return (
      <PageWrapper>
        <div className="p-8">Impossible de charger le dashboard.</div>
      </PageWrapper>
    );
  }

  const statsCards = [
    {
      title: "Healthy Tomatoes",
      value: stats.healthyCount.toString(),
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Anthracnose",
      value: stats.anthracnoseCount.toString(),
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Blossom End Rot",
      value: stats.blossomEndRotCount.toString(),
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: "Spotted Wilt Virus",
      value: stats.spottedWiltVirusCount.toString(),
      icon: Bug,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  const systemStats = [
    {
      label: "Total Analyzed",
      value: stats.totalAnalyzed.toString(),
      icon: Activity,
    },
    {
      label: "Total Tomatoes",
      value: stats.totalTomatoes.toString(),
      icon: TrendingUp,
    },
    {
      label: "Avg Inference Time",
      value: `${stats.avgInferenceTime}ms`,
      icon: Clock,
    },
    {
      label: "Avg Confidence",
      value: `${stats.avgConfidence.toFixed(1)}%`,
      icon: CheckCircle2,
    },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time analytics for automated tomato disease detection
            </p>
          </div>

          <Button variant="outline" onClick={fetchDashboardData}>
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <stat.icon className={`size-4 ${stat.color}`} />
                </div>
              </CardHeader>

              <CardContent>
                <div className={`text-2xl font-semibold ${stat.color}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Detection Trends</CardTitle>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="healthy" fill="#22c55e" name="Healthy" />
                  <Bar dataKey="anthracnose" fill="#ef4444" name="Anthracnose" />
                  <Bar dataKey="blossom" fill="#f59e0b" name="Blossom End Rot" />
                  <Bar dataKey="virus" fill="#8b5cf6" name="Spotted Wilt Virus" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {systemStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-primary/10 p-2">
                        <stat.icon className="size-4" />
                      </div>
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
          <CardHeader>
            <CardTitle>Recent Detections</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Healthy</TableHead>
                  <TableHead>Anthracnose</TableHead>
                  <TableHead>Blossom</TableHead>
                  <TableHead>Virus</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {stats.recentDetections.length > 0 ? (
                  stats.recentDetections.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        {new Date(result.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate">
                        {result.filename}
                      </TableCell>
                      <TableCell>{result.totalDetections}</TableCell>
                      <TableCell className="text-green-600">
                        {result.healthy}
                      </TableCell>
                      <TableCell className="text-red-600">
                        {result.anthracnose}
                      </TableCell>
                      <TableCell className="text-orange-600">
                        {result.blossomEndRot}
                      </TableCell>
                      <TableCell className="text-purple-600">
                        {result.spottedWiltVirus}
                      </TableCell>
                      <TableCell>
                        {(result.averageConfidence * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            result.averageConfidence > 0.9
                              ? "default"
                              : "secondary"
                          }
                        >
                          {result.averageConfidence > 0.9
                            ? "Excellent"
                            : "Good"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      Aucune détection récente
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
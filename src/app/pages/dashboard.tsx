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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Target,
  Clock,
  TrendingUp,
  Cpu,
  Zap,
} from "lucide-react";
import {
  mockDetectionResults,
  mockChartData,
  formatTimestamp,
} from "../lib/mock-data";

const stats = [
  {
    title: "Total Analyzed",
    value: "1,247",
    change: "+12.5%",
    icon: Activity,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    title: "Fresh Tomatoes",
    value: "1,089",
    change: "+8.2%",
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  {
    title: "Rotten Detected",
    value: "158",
    change: "-3.1%",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-red-50 dark:bg-red-950",
  },
  {
    title: "Accuracy",
    value: "94.7%",
    change: "+1.2%",
    icon: Target,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
];

const systemStats = [
  { label: "Avg Inference Time", value: "43.5ms", icon: Clock },
  { label: "GPU Utilization", value: "67%", icon: Cpu },
  { label: "Throughput", value: "23/min", icon: Zap },
  { label: "Uptime", value: "99.8%", icon: TrendingUp },
];

import { PageWrapper } from "../components/page-wrapper";

export function DashboardPage() {
  return (
    <PageWrapper>
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time analytics for automated tomato sorting system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
              <div className="text-2xl font-semibold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span
                  className={
                    stat.change.startsWith("+")
                      ? "text-success"
                      : "text-destructive"
                  }
                >
                  {stat.change}
                </span>{" "}
                from last week
              </p>
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
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="fresh"
                  fill="hsl(var(--success))"
                  radius={[4, 4, 0, 0]}
                  name="Fresh"
                />
                <Bar
                  dataKey="rotten"
                  fill="hsl(var(--destructive))"
                  radius={[4, 4, 0, 0]}
                  name="Rotten"
                />
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
                  className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <stat.icon className="size-4 text-primary" />
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
                <TableHead>Timestamp</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Fresh</TableHead>
                <TableHead>Rotten</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Inference Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDetectionResults.slice(0, 5).map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">
                    {formatTimestamp(result.timestamp)}
                  </TableCell>
                  <TableCell>{result.totalTomatoes}</TableCell>
                  <TableCell>
                    <span className="text-success">{result.freshCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-destructive">
                      {result.rottenCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    {(result.averageConfidence * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell>{result.inferenceTime}ms</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        result.averageConfidence > 0.9 ? "default" : "secondary"
                      }
                    >
                      {result.averageConfidence > 0.9 ? "Excellent" : "Good"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </PageWrapper>
  );
}

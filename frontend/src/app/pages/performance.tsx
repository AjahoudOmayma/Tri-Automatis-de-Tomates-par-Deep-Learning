import { PageWrapper } from "../components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Target, Zap, TrendingUp, Activity } from "lucide-react";
import {
  mockModelMetrics,
  mockPerformanceData,
  mockInferenceTimeData,
} from "../lib/mock-data";

const metricsCards = [
  {
    title: "Accuracy",
    value: mockModelMetrics.accuracy,
    icon: Target,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    title: "Precision",
    value: mockModelMetrics.precision,
    icon: Activity,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
  {
    title: "Recall",
    value: mockModelMetrics.recall,
    icon: TrendingUp,
    color: "text-success",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  {
    title: "F1-Score",
    value: mockModelMetrics.f1Score,
    icon: Zap,
    color: "text-warning",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
  },
];

export function PerformancePage() {
  return (
    <PageWrapper>
    <div className="space-y-6">
      <div>
        <h1>Model Performance</h1>
        <p className="text-muted-foreground">
          YOLOv8 metrics and performance analytics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricsCards.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${metric.bgColor}`}>
                <metric.icon className={`size-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {(metric.value * 100).toFixed(1)}%
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${metric.value * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Model Metrics Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={mockPerformanceData}>
                <PolarGrid className="stroke-muted" />
                <PolarAngleAxis dataKey="metric" className="text-xs" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inference Time (ms)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockInferenceTimeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="batch" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  name="Time (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockPerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" domain={[0, 100]} className="text-xs" />
              <YAxis dataKey="metric" type="category" width={80} className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar
                dataKey="value"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Avg Inference Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {mockModelMetrics.avgInferenceTime}ms
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Per image detection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Inferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {mockModelMetrics.totalInferences.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Lifetime detections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Model Version
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">YOLOv8</div>
            <p className="text-sm text-muted-foreground mt-1">
              Latest stable release
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    </PageWrapper>
  );
}

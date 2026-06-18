import { useEffect, useMemo, useState } from "react";
import { PageWrapper } from "../components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:5000";

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

export function ResultsPage() {
  const [history, setHistory] = useState<DetectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/history`);

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data: DetectionRecord[] = await response.json();

      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setHistory(sorted);
    } catch (error) {
      console.error("Error loading results:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const analysis = useMemo(() => {
    const totalSessions = history.length;
    const totalDetections = history.reduce((sum, item) => sum + item.totalDetections, 0);
    const healthy = history.reduce((sum, item) => sum + item.healthy, 0);
    const anthracnose = history.reduce((sum, item) => sum + item.anthracnose, 0);
    const blossom = history.reduce((sum, item) => sum + item.blossomEndRot, 0);
    const virus = history.reduce((sum, item) => sum + item.spottedWiltVirus, 0);

    const diseaseTotal = anthracnose + blossom + virus;

    const avgConfidence =
      totalSessions > 0
        ? history.reduce((sum, item) => sum + item.averageConfidence, 0) / totalSessions
        : 0;

    const healthyRate = totalDetections > 0 ? (healthy / totalDetections) * 100 : 0;
    const anthracnoseRate = totalDetections > 0 ? (anthracnose / totalDetections) * 100 : 0;
    const blossomRate = totalDetections > 0 ? (blossom / totalDetections) * 100 : 0;
    const virusRate = totalDetections > 0 ? (virus / totalDetections) * 100 : 0;
    const diseaseRate = totalDetections > 0 ? (diseaseTotal / totalDetections) * 100 : 0;

    const mostAffectedClass = [
      { label: "Anthracnose", value: anthracnose },
      { label: "Blossom End Rot", value: blossom },
      { label: "Spotted Wilt Virus", value: virus },
    ].sort((a, b) => b.value - a.value)[0];

    const healthiestSession =
      history.length > 0
        ? [...history].sort((a, b) => {
            const rateA = a.totalDetections > 0 ? a.healthy / a.totalDetections : 0;
            const rateB = b.totalDetections > 0 ? b.healthy / b.totalDetections : 0;
            return rateB - rateA;
          })[0]
        : null;

    const riskiestSession =
      history.length > 0
        ? [...history].sort((a, b) => {
            const diseaseA =
              a.anthracnose + a.blossomEndRot + a.spottedWiltVirus;
            const diseaseB =
              b.anthracnose + b.blossomEndRot + b.spottedWiltVirus;
            return diseaseB - diseaseA;
          })[0]
        : null;

    const lowConfidenceSessions = history.filter(
      (item) => item.averageConfidence < 0.7
    );

    let globalStatus = "Stable";
    let globalMessage =
      "The crop condition appears globally stable based on the recorded detections.";

    if (diseaseRate >= 50) {
      globalStatus = "Critical";
      globalMessage =
        "A high disease ratio has been detected. Immediate inspection and intervention are recommended.";
    } else if (diseaseRate >= 25) {
      globalStatus = "Warning";
      globalMessage =
        "A moderate disease presence is visible. Monitoring and targeted treatment are recommended.";
    }

    return {
      totalSessions,
      totalDetections,
      healthy,
      anthracnose,
      blossom,
      virus,
      diseaseTotal,
      avgConfidence,
      healthyRate,
      anthracnoseRate,
      blossomRate,
      virusRate,
      diseaseRate,
      mostAffectedClass,
      healthiestSession,
      riskiestSession,
      lowConfidenceSessions,
      globalStatus,
      globalMessage,
    };
  }, [history]);

  const recommendations = useMemo(() => {
    const items: string[] = [];

    if (analysis.virusRate > 0) {
      items.push("Prioritize inspection of tomatoes affected by Spotted Wilt Virus and isolate suspicious batches.");
    }

    if (analysis.anthracnoseRate > 0) {
      items.push("Review storage and handling conditions to reduce Anthracnose spread.");
    }

    if (analysis.blossomRate > 0) {
      items.push("Monitor irrigation and calcium-related stress factors linked to Blossom End Rot.");
    }

    if (analysis.avgConfidence < 0.75) {
      items.push("Recheck low-confidence detections and consider improving image quality for more reliable predictions.");
    }

    if (analysis.diseaseRate < 20) {
      items.push("Current results are generally reassuring; continue periodic monitoring to maintain crop quality.");
    }

    return items;
  }, [analysis]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="p-6">Loading analytical results...</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1>Results Interpretation</h1>
            <p className="text-muted-foreground">
              Analytical summary and decision-oriented insights from detection history
            </p>
          </div>

          <Button variant="outline" onClick={fetchResults}>
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Global Assessment</CardTitle>
          </CardHeader>
          <CardContent className="flex items-start gap-3">
            {analysis.globalStatus === "Stable" ? (
              <ShieldCheck className="mt-0.5 text-green-600" />
            ) : (
              <ShieldAlert className="mt-0.5 text-red-600" />
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    analysis.globalStatus === "Critical"
                      ? "destructive"
                      : analysis.globalStatus === "Warning"
                      ? "secondary"
                      : "default"
                  }
                >
                  {analysis.globalStatus}
                </Badge>
              </div>
              <p>{analysis.globalMessage}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Healthy Ratio</p>
              <h2 className="text-2xl font-bold text-green-600">
                {analysis.healthyRate.toFixed(1)}%
              </h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Disease Ratio</p>
              <h2 className="text-2xl font-bold text-red-600">
                {analysis.diseaseRate.toFixed(1)}%
              </h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Most Affected Class</p>
              <h2 className="text-xl font-bold">
                {analysis.mostAffectedClass?.label || "N/A"}
              </h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Low Confidence Sessions</p>
              <h2 className="text-2xl font-bold">
                {analysis.lowConfidenceSessions.length}
              </h2>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Class Interpretation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600" />
                  <span className="font-medium">Healthy Tomatoes</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Count: {analysis.healthy} • Rate: {analysis.healthyRate.toFixed(1)}%
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="size-4 text-red-600" />
                  <span className="font-medium">Anthracnose</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Count: {analysis.anthracnose} • Rate: {analysis.anthracnoseRate.toFixed(1)}%
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="size-4 text-orange-600" />
                  <span className="font-medium">Blossom End Rot</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Count: {analysis.blossom} • Rate: {analysis.blossomRate.toFixed(1)}%
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="size-4 text-purple-600" />
                  <span className="font-medium">Spotted Wilt Virus</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Count: {analysis.virus} • Rate: {analysis.virusRate.toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.length > 0 ? (
                recommendations.map((item, index) => (
                  <div key={index} className="rounded-lg border p-3 text-sm">
                    {item}
                  </div>
                ))
              ) : (
                <div className="rounded-lg border p-3 text-sm">
                  No recommendation available.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Best Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.healthiestSession ? (
                <>
                  <p className="text-sm"><strong>ID:</strong> {analysis.healthiestSession.id}</p>
                  <p className="text-sm"><strong>File:</strong> {analysis.healthiestSession.filename}</p>
                  <p className="text-sm">
                    <strong>Date:</strong>{" "}
                    {new Date(analysis.healthiestSession.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    <strong>Healthy:</strong> {analysis.healthiestSession.healthy}
                  </p>
                  <p className="text-sm">
                    <strong>Confidence:</strong>{" "}
                    {(analysis.healthiestSession.averageConfidence * 100).toFixed(1)}%
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No session available.</p>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Most Critical Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.riskiestSession ? (
                <>
                  <p className="text-sm"><strong>ID:</strong> {analysis.riskiestSession.id}</p>
                  <p className="text-sm"><strong>File:</strong> {analysis.riskiestSession.filename}</p>
                  <p className="text-sm">
                    <strong>Date:</strong>{" "}
                    {new Date(analysis.riskiestSession.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    <strong>Disease Count:</strong>{" "}
                    {analysis.riskiestSession.anthracnose +
                      analysis.riskiestSession.blossomEndRot +
                      analysis.riskiestSession.spottedWiltVirus}
                  </p>
                  <p className="text-sm">
                    <strong>Confidence:</strong>{" "}
                    {(analysis.riskiestSession.averageConfidence * 100).toFixed(1)}%
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No session available.</p>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Quality Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-primary" />
                <span className="text-sm">
                  Total sessions analyzed: {analysis.totalSessions}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <span className="text-sm">
                  Total tomatoes detected: {analysis.totalDetections}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <span className="text-sm">
                  Average confidence: {(analysis.avgConfidence * 100).toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
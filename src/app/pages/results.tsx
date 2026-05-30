import { PageWrapper } from "../components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Download, ZoomIn } from "lucide-react";
import { mockDetectionResults } from "../lib/mock-data";

export function ResultsPage() {
  const latestResult = mockDetectionResults[0];

  return (
    <PageWrapper>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Detection Results</h1>
          <p className="text-muted-foreground">
            Detailed analysis of the latest detection
          </p>
        </div>
        <Button>
          <Download className="mr-2 size-4" />
          Export Results
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Original Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="group relative aspect-video overflow-hidden rounded-lg border bg-muted">
              <img
                src={latestResult.imageUrl}
                alt="Original"
                className="size-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/50 group-hover:opacity-100">
                <Button size="sm" variant="secondary">
                  <ZoomIn className="mr-2 size-4" />
                  View Full Size
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Annotated Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="group relative aspect-video overflow-hidden rounded-lg border bg-muted">
              <img
                src={latestResult.imageUrl}
                alt="Annotated"
                className="size-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute left-4 top-4 space-y-2">
                <div className="rounded border-2 border-success bg-success/10 px-2 py-1">
                  <span className="text-xs font-medium text-success">
                    Fresh 96%
                  </span>
                </div>
                <div className="rounded border-2 border-destructive bg-destructive/10 px-2 py-1">
                  <span className="text-xs font-medium text-destructive">
                    Rotten 88%
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/50 group-hover:opacity-100">
                <Button size="sm" variant="secondary">
                  <ZoomIn className="mr-2 size-4" />
                  View Full Size
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Total Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {latestResult.totalTomatoes}
            </div>
            <p className="text-xs text-muted-foreground mt-1">tomatoes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Fresh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-success">
              {latestResult.freshCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((latestResult.freshCount / latestResult.totalTomatoes) * 100).toFixed(
                1
              )}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Rotten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-destructive">
              {latestResult.rottenCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((latestResult.rottenCount / latestResult.totalTomatoes) * 100).toFixed(
                1
              )}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Avg Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {(latestResult.averageConfidence * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {latestResult.inferenceTime}ms inference
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detection Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Object</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Freshness</TableHead>
                <TableHead>Bounding Box</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestResult.detections.map((detection, index) => (
                <TableRow key={detection.id}>
                  <TableCell className="font-mono text-xs">
                    {String(index + 1).padStart(3, "0")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {detection.label}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${detection.confidence * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm">
                        {(detection.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        detection.freshness === "fresh"
                          ? "default"
                          : detection.freshness === "rotten"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {detection.freshness}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    [{detection.bbox.join(", ")}]
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

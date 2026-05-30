import { useState } from "react";
import { PageWrapper } from "../components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import {
  mockDetectionResults,
  formatTimestamp,
  formatDate,
} from "../lib/mock-data";

export function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredResults = mockDetectionResults.filter((result) => {
    if (filterStatus === "excellent" && result.averageConfidence <= 0.9)
      return false;
    if (filterStatus === "good" && result.averageConfidence > 0.9) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  return (
    <PageWrapper>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Detection History</h1>
          <p className="text-muted-foreground">
            Browse and export past detection sessions
          </p>
        </div>
        <Button>
          <Download className="mr-2 size-4" />
          Export All
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Detections</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9 sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="sm:w-40">
                  <Filter className="mr-2 size-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Fresh</TableHead>
                <TableHead>Rotten</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-mono text-xs">
                    {result.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatDate(result.timestamp)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(result.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
                  <TableCell>
                    <Badge
                      variant={
                        result.averageConfidence > 0.9 ? "default" : "secondary"
                      }
                    >
                      {result.averageConfidence > 0.9 ? "Excellent" : "Good"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="size-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredResults.length} of {mockDetectionResults.length}{" "}
              results
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {mockDetectionResults.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-success">98.4%</div>
            <p className="text-sm text-muted-foreground mt-1">
              High confidence detections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Avg Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">43ms</div>
            <p className="text-sm text-muted-foreground mt-1">
              Per detection session
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    </PageWrapper>
  );
}

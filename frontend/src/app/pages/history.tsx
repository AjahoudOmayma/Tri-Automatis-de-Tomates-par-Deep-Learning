import { useEffect, useMemo, useState } from "react";
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
  RefreshCw,
} from "lucide-react";

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

const API_BASE_URL = "http://127.0.0.1:5000";

export function HistoryPage() {
  const [history, setHistory] = useState<DetectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/history`);
      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }

      const data: DetectionRecord[] = await response.json();

      const sortedData = [...data].sort((a, b) => {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });

      setHistory(sortedData);
      setCurrentPage(1);
    } catch (error) {
      console.error("Erreur chargement history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return history.filter((result) => {
      const matchesSearch =
        query === "" ||
        result.filename.toLowerCase().includes(query) ||
        result.id.toString().includes(query) ||
        new Date(result.timestamp).toLocaleDateString().toLowerCase().includes(query);

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "excellent" && result.averageConfidence > 0.9) ||
        (filterStatus === "good" && result.averageConfidence <= 0.9);

      return matchesSearch && matchesStatus;
    });
  }, [history, searchQuery, filterStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / itemsPerPage));

  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportAsJson = () => {
    const blob = new Blob([JSON.stringify(filteredResults, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "detection-history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCsv = () => {
    const headers = [
      "id",
      "timestamp",
      "filename",
      "totalDetections",
      "anthracnose",
      "blossomEndRot",
      "healthy",
      "spottedWiltVirus",
      "averageConfidence",
    ];

    const rows = filteredResults.map((item) => [
      item.id,
      item.timestamp,
      item.filename,
      item.totalDetections,
      item.anthracnose,
      item.blossomEndRot,
      item.healthy,
      item.spottedWiltVirus,
      item.averageConfidence,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "detection-history.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const totalSessions = history.length;

  const excellentCount = history.filter(
    (item) => item.averageConfidence > 0.9
  ).length;

  const successRate =
    history.length > 0 ? ((excellentCount / history.length) * 100).toFixed(1) : "0.0";

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1>Detection History</h1>
            <p className="text-muted-foreground">
              Browse and export real detection sessions from the backend history
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchHistory}>
              <RefreshCw className="mr-2 size-4" />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportAsJson} disabled={filteredResults.length === 0}>
              <Download className="mr-2 size-4" />
              Export JSON
            </Button>
            <Button onClick={exportAsCsv} disabled={filteredResults.length === 0}>
              <Download className="mr-2 size-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>All Detections</CardTitle>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by file, id, date..."
                    className="pl-9 sm:w-72"
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
                  <TableHead>File</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Healthy</TableHead>
                  <TableHead>Anthracnose</TableHead>
                  <TableHead>Blossom</TableHead>
                  <TableHead>Virus</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : paginatedResults.length > 0 ? (
                  paginatedResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-mono text-xs">
                        {result.id}
                      </TableCell>

                      <TableCell className="font-medium">
                        {new Date(result.timestamp).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {new Date(result.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </TableCell>

                      <TableCell className="max-w-[180px] truncate">
                        {result.filename}
                      </TableCell>

                      <TableCell>{result.totalDetections}</TableCell>
                      <TableCell className="text-green-600">{result.healthy}</TableCell>
                      <TableCell className="text-red-600">{result.anthracnose}</TableCell>
                      <TableCell className="text-orange-600">{result.blossomEndRot}</TableCell>
                      <TableCell className="text-purple-600">
                        {result.spottedWiltVirus}
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
                          <Button
                            size="sm"
                            variant="ghost"
                            title={result.filename}
                          >
                            <Eye className="size-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const blob = new Blob(
                                [JSON.stringify(result, null, 2)],
                                { type: "application/json" }
                              );
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `detection-${result.id}.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                          >
                            <Download className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center">
                      Aucune détection réelle trouvée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedResults.length} of {filteredResults.length} results
              </p>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
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
              <div className="text-3xl font-semibold">{totalSessions}</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Real backend sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-green-600">
                {successRate}%
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
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
              <p className="mt-1 text-sm text-muted-foreground">
                Static placeholder metric
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
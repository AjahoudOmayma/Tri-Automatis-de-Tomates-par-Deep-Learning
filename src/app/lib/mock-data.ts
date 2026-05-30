export interface DetectionResult {
  id: string;
  timestamp: string;
  totalTomatoes: number;
  freshCount: number;
  rottenCount: number;
  averageConfidence: number;
  inferenceTime: number;
  imageUrl: string;
  detections: Detection[];
}

export interface Detection {
  id: string;
  label: string;
  confidence: number;
  bbox: [number, number, number, number];
  freshness: "fresh" | "rotten" | "ripening";
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  avgInferenceTime: number;
  totalInferences: number;
}

export const mockDetectionResults: DetectionResult[] = [
  {
    id: "det-001",
    timestamp: "2026-05-24T14:30:15Z",
    totalTomatoes: 12,
    freshCount: 9,
    rottenCount: 3,
    averageConfidence: 0.94,
    inferenceTime: 45,
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800",
    detections: [
      { id: "d1", label: "tomato", confidence: 0.96, bbox: [120, 150, 80, 80], freshness: "fresh" },
      { id: "d2", label: "tomato", confidence: 0.92, bbox: [220, 160, 75, 75], freshness: "fresh" },
      { id: "d3", label: "tomato", confidence: 0.88, bbox: [320, 145, 78, 78], freshness: "rotten" },
    ],
  },
  {
    id: "det-002",
    timestamp: "2026-05-24T13:15:42Z",
    totalTomatoes: 8,
    freshCount: 7,
    rottenCount: 1,
    averageConfidence: 0.91,
    inferenceTime: 42,
    imageUrl: "https://images.unsplash.com/photo-1546470427-e26264be0b11?w=800",
    detections: [
      { id: "d4", label: "tomato", confidence: 0.94, bbox: [100, 120, 85, 85], freshness: "fresh" },
      { id: "d5", label: "tomato", confidence: 0.89, bbox: [200, 130, 80, 80], freshness: "ripening" },
    ],
  },
  {
    id: "det-003",
    timestamp: "2026-05-24T12:45:20Z",
    totalTomatoes: 15,
    freshCount: 12,
    rottenCount: 3,
    averageConfidence: 0.93,
    inferenceTime: 48,
    imageUrl: "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=800",
    detections: [],
  },
  {
    id: "det-004",
    timestamp: "2026-05-24T11:20:10Z",
    totalTomatoes: 6,
    freshCount: 5,
    rottenCount: 1,
    averageConfidence: 0.95,
    inferenceTime: 38,
    imageUrl: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=800",
    detections: [],
  },
  {
    id: "det-005",
    timestamp: "2026-05-24T10:05:33Z",
    totalTomatoes: 10,
    freshCount: 8,
    rottenCount: 2,
    averageConfidence: 0.89,
    inferenceTime: 44,
    imageUrl: "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=800",
    detections: [],
  },
];

export const mockModelMetrics: ModelMetrics = {
  accuracy: 0.947,
  precision: 0.932,
  recall: 0.956,
  f1Score: 0.944,
  avgInferenceTime: 43.5,
  totalInferences: 1247,
};

export const mockChartData = [
  { date: "Mon", fresh: 120, rotten: 15, total: 135 },
  { date: "Tue", fresh: 145, rotten: 22, total: 167 },
  { date: "Wed", fresh: 138, rotten: 18, total: 156 },
  { date: "Thu", fresh: 162, rotten: 25, total: 187 },
  { date: "Fri", fresh: 155, rotten: 20, total: 175 },
  { date: "Sat", fresh: 142, rotten: 17, total: 159 },
  { date: "Sun", fresh: 128, rotten: 14, total: 142 },
];

export const mockPerformanceData = [
  { metric: "Accuracy", value: 94.7 },
  { metric: "Precision", value: 93.2 },
  { metric: "Recall", value: 95.6 },
  { metric: "F1-Score", value: 94.4 },
];

export const mockInferenceTimeData = [
  { batch: "1", time: 42 },
  { batch: "2", time: 45 },
  { batch: "3", time: 38 },
  { batch: "4", time: 48 },
  { batch: "5", time: 44 },
  { batch: "6", time: 41 },
  { batch: "7", time: 46 },
  { batch: "8", time: 43 },
];

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { PageWrapper } from "../components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Upload,
  Camera,
  Play,
  Square,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

type Detection = {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
};

type DetectionResponse = {
  filename?: string;
  image_width?: number;
  image_height?: number;
  total_detections: number;
  detections: Detection[];
};

export function DetectionPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isWebcamProcessing, setIsWebcamProcessing] = useState(false);

  const [detectionResults, setDetectionResults] =
    useState<DetectionResponse | null>(null);

  const [webcamResults, setWebcamResults] =
    useState<DetectionResponse | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const webcamBusyRef = useRef(false);

  const [imageSize, setImageSize] = useState({
    naturalWidth: 0,
    naturalHeight: 0,
  });

  const updateImageSize = () => {
    const img = imageRef.current;
    if (!img) return;

    setImageSize({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", updateImageSize);
    return () => window.removeEventListener("resize", updateImageSize);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setDetectionResults(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first");
      return;
    }

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();
      setDetectionResults(data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to YOLO backend. Make sure Flask is running.");
    } finally {
      setIsProcessing(false);
    }
  };

  const predictWebcamFrame = async () => {
    if (!webcamRef.current || webcamBusyRef.current) return;

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    webcamBusyRef.current = true;
    setIsWebcamProcessing(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict-frame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: screenshot }),
      });

      if (!response.ok) {
        throw new Error("Webcam backend error");
      }

      const data = await response.json();
      setWebcamResults(data);
    } catch (error) {
      console.error("Webcam prediction error:", error);
    } finally {
      webcamBusyRef.current = false;
      setIsWebcamProcessing(false);
    }
  };

  useEffect(() => {
    if (!isWebcamActive) return;

    const interval = setInterval(() => {
      predictWebcamFrame();
    }, 1000);

    return () => clearInterval(interval);
  }, [isWebcamActive]);

  const toggleWebcam = () => {
    setIsWebcamActive((prev) => {
      const next = !prev;

      if (!next) {
        setWebcamResults(null);
      }

      return next;
    });
  };

  const renderBoxes = (
    detections: Detection[] | undefined,
    width: number,
    height: number
  ) => {
    if (!detections || width === 0 || height === 0) return null;

    return detections.map((item, index) => {
      const [x1, y1, x2, y2] = item.bbox;

      return (
        <div
          key={index}
          className="absolute border-2 border-red-500"
          style={{
            left: `${(x1 / width) * 100}%`,
            top: `${(y1 / height) * 100}%`,
            width: `${((x2 - x1) / width) * 100}%`,
            height: `${((y2 - y1) / height) * 100}%`,
          }}
        >
          <span className="absolute -top-7 left-0 whitespace-nowrap rounded bg-red-500 px-2 py-1 text-xs font-medium text-white">
            {item.class} {(item.confidence * 100).toFixed(1)}%
          </span>
        </div>
      );
    });
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1>Live Detection</h1>
          <p className="text-muted-foreground">
            Upload images or use webcam for real-time tomato detection
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Image Upload</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-muted/30">
                {previewImage ? (
                  <div className="relative flex h-full w-full items-center justify-center">
                    <div className="relative max-h-full max-w-full">
                      <img
                        ref={imageRef}
                        src={previewImage}
                        alt="Selected tomato"
                        onLoad={updateImageSize}
                        className="max-h-full max-w-full object-contain"
                      />

                      {renderBoxes(
                        detectionResults?.detections,
                        imageSize.naturalWidth,
                        imageSize.naturalHeight
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 p-8 text-center">
                    <div className="rounded-full bg-primary/10 p-4">
                      <Upload className="size-8 text-primary" />
                    </div>

                    <div className="space-y-1">
                      <p className="font-medium">Upload tomato image</p>
                      <p className="text-sm text-muted-foreground">
                        Choose an image to send it to YOLO model
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <label htmlFor="file-upload">
                <Button size="sm" className="w-full" asChild>
                  <span>
                    <ImageIcon className="mr-2 size-4" />
                    Choose File
                  </span>
                </Button>
              </label>

              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {selectedFile.name}
                </p>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Processing with YOLO...
                    </span>
                    <span>Analyzing</span>
                  </div>
                  <Progress value={70} />
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleUpload}
                disabled={isProcessing || !selectedFile}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    <Play className="mr-2 size-4" />
                    Start Detection
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webcam Detection</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-black">
                {isWebcamActive ? (
                  <div className="relative h-full w-full">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      className="absolute inset-0 h-full w-full object-cover"
                      videoConstraints={{
                        width: 1280,
                        height: 720,
                        facingMode: "environment",
                      }}
                    />

                    {webcamResults?.image_width &&
                      webcamResults?.image_height &&
                      renderBoxes(
                        webcamResults.detections,
                        webcamResults.image_width,
                        webcamResults.image_height
                      )}

                    <div className="absolute bottom-4 left-4">
                      <Badge variant="destructive" className="animate-pulse">
                        <div className="mr-2 size-2 rounded-full bg-white" />
                        LIVE
                      </Badge>
                    </div>

                    <div className="absolute right-4 top-4">
                      <Badge variant="secondary">
                        {isWebcamProcessing ? "Analyzing..." : "YOLO Ready"}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white/70">
                    <Camera className="size-12" />
                    <p className="text-sm">Webcam Inactive</p>
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                variant={isWebcamActive ? "destructive" : "default"}
                onClick={toggleWebcam}
              >
                {isWebcamActive ? (
                  <>
                    <Square className="mr-2 size-4" />
                    Stop Webcam
                  </>
                ) : (
                  <>
                    <Play className="mr-2 size-4" />
                    Start Webcam
                  </>
                )}
              </Button>

              {webcamResults && (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    Live detections
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {webcamResults.total_detections}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {detectionResults && (
          <Card>
            <CardHeader>
              <CardTitle>Detection Results</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Total Detected</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {detectionResults.total_detections}
                  </p>
                </div>

                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Image</p>
                  <p className="mt-1 truncate text-sm font-medium">
                    {detectionResults.filename}
                  </p>
                </div>

                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Backend Status</p>
                  <p className="mt-1 text-2xl font-semibold text-green-600">
                    Success
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="font-medium">Detected Objects</h3>

                {detectionResults.detections.length > 0 ? (
                  <div className="space-y-2">
                    {detectionResults.detections.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border bg-card p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-xs font-medium">
                              {index + 1}
                            </span>
                          </div>

                          <div>
                            <span className="font-medium">{item.class}</span>
                            <p className="text-xs text-muted-foreground">
                              BBox: [{item.bbox.join(", ")}]
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge variant="default">Detected</Badge>
                          <span className="text-sm text-muted-foreground">
                            {(item.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                    No tomatoes detected in this image.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}
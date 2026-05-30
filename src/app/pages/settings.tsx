import { useState } from "react";
import { PageWrapper } from "../components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { useTheme } from "next-themes";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Cpu,
  Zap,
  Server,
  Save,
} from "lucide-react";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [confidence, setConfidence] = useState([75]);
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [modelVersion, setModelVersion] = useState("yolov8n");

  return (
    <PageWrapper>
    <div className="space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground">
          Configure your detection system preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="size-5" />
                Detection Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Confidence Threshold</Label>
                  <span className="text-sm font-medium">{confidence[0]}%</span>
                </div>
                <Slider
                  value={confidence}
                  onValueChange={setConfidence}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum confidence level to accept detections
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="model">Model Version</Label>
                <Select value={modelVersion} onValueChange={setModelVersion}>
                  <SelectTrigger id="model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yolov8n">YOLOv8n (Nano)</SelectItem>
                    <SelectItem value="yolov8s">YOLOv8s (Small)</SelectItem>
                    <SelectItem value="yolov8m">YOLOv8m (Medium)</SelectItem>
                    <SelectItem value="yolov8l">YOLOv8l (Large)</SelectItem>
                    <SelectItem value="yolov8x">YOLOv8x (Extra Large)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Larger models are more accurate but slower
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save">Auto-save Results</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically save detection results
                  </p>
                </div>
                <Switch
                  id="auto-save"
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive alerts for detections
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === "dark" ? (
                  <Moon className="size-5" />
                ) : (
                  <Sun className="size-5" />
                )}
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className="justify-start"
                  >
                    <Sun className="mr-2 size-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className="justify-start"
                  >
                    <Moon className="mr-2 size-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    onClick={() => setTheme("system")}
                    className="justify-start"
                  >
                    <Cpu className="mr-2 size-4" />
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="size-5" />
                API Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm">Backend API</span>
                </div>
                <Badge variant="default">Active</Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm">Model Server</span>
                </div>
                <Badge variant="default">Active</Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm">Database</span>
                </div>
                <Badge variant="default">Active</Badge>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">GPU</span>
                  <span className="text-sm font-medium">NVIDIA RTX 4090</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">VRAM</span>
                  <span className="text-sm font-medium">12GB / 24GB</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-1/2 bg-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="size-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                <Save className="mr-2 size-4" />
                Save Settings
              </Button>
              <Button className="w-full" variant="outline">
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </PageWrapper>
  );
}

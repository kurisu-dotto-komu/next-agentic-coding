"use client";

import { useRef, useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface LatteArtCanvasProps {
  playerId: Id<"players">;
  onClose: () => void;
}

export default function LatteArtCanvas({
  playerId,
  onClose,
}: LatteArtCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [selectedPattern] = useState("heart");

  const submitScore = useMutation(api.games.submitLatteArtScore);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up canvas
    ctx.fillStyle = "#D2691E"; // Coffee color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add foam
    ctx.fillStyle = "#FFF8DC"; // Cream color
    ctx.beginPath();
    ctx.arc(150, 150, 120, 0, 2 * Math.PI);
    ctx.fill();
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    if (!startTime) {
      setStartTime(Date.now());
    }
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = "#8B4513"; // Dark brown
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
  };

  const submitArt = async () => {
    if (!startTime) return;

    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const similarity = calculateSimilarity();

    const result = await submitScore({
      playerId,
      pattern: selectedPattern,
      similarity,
      timeElapsed,
    });

    setScore(result.score);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const calculateSimilarity = () => {
    // Simplified similarity calculation
    // In a real implementation, this would compare the drawn pattern
    // to a reference pattern
    return 0.7 + Math.random() * 0.3;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset canvas
    ctx.fillStyle = "#D2691E";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFF8DC";
    ctx.beginPath();
    ctx.arc(150, 150, 120, 0, 2 * Math.PI);
    ctx.fill();

    setScore(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card variant="elevated" className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
            Latte Art Canvas
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Draw your best latte art! Use your mouse to create patterns in the
            foam.
          </p>

          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="border-2 border-amber-600 rounded-full cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>

          {score !== null && (
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                Score: {score}/100
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={clearCanvas}
              variant="secondary"
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              onClick={submitArt}
              variant="primary"
              className="flex-1"
              disabled={score !== null}
            >
              Submit Art
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

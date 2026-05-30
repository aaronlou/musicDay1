import { useEffect, useRef } from "react";

/**
 * 声波动画 Canvas 组件
 *
 * 展示不同频率/音高的波形差异
 */

interface WaveAnimationProps {
  freq: number;       // 基础频率
  harmonics?: number; // 泛音数量
  width?: number;
  height?: number;
}

export default function WaveAnimation({
  freq,
  harmonics = 3,
  width = 360,
  height = 120,
}: WaveAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 中心线
      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // 波形
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#6366f1";
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        let y = 0;
        for (let h = 1; h <= harmonics; h++) {
          const amp = (height / 4) / h;
          y += Math.sin((x / width) * Math.PI * 4 * h * (freq / 261.63) + phase * h) * amp;
        }
        if (x === 0) ctx.moveTo(x, height / 2 + y);
        else ctx.lineTo(x, height / 2 + y);
      }
      ctx.stroke();

      // 泛音小波形（右侧）
      for (let h = 2; h <= harmonics; h++) {
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.3 / h})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const amp = (height / 6) / h;
          const y = Math.sin((x / width) * Math.PI * 4 * h * (freq / 261.63) + phase * h) * amp;
          if (x === 0) ctx.moveTo(x, height / 2 + y);
          else ctx.lineTo(x, height / 2 + y);
        }
        ctx.stroke();
      }

      phase += 0.03;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [freq, harmonics, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="rounded-xl bg-surface-light/30"
    />
  );
}

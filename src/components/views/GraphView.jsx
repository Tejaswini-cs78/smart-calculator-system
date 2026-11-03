import React, { useState, useRef, useEffect } from 'react';
import { parse } from '../../engine/parser';
import { evaluateAST } from '../../engine/evaluator';
import { LineChart, ZoomIn, ZoomOut, RotateCcw, AlertCircle } from 'lucide-react';

export default function GraphView() {
  const [functionStr, setFunctionStr] = useState('x^2');
  const [zoom, setZoom] = useState(1);
  const [hoverCoord, setHoverCoord] = useState(null);
  const [error, setError] = useState(null);

  const canvasRef = useRef(null);

  const presets = ['x^2', 'sin(x)', 'cos(x)', 'tan(x)', 'cot(x)', 'cosec(x)', 'sec(x)', '2*x + 3', 'x^3 - 3*x', 'sqrt(x)', 'abs(x)'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Grid coordinates
    const scale = 30 * zoom; // pixels per unit
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;

    for (let x = centerX % scale; x < width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = centerY % scale; y < height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Main Axes
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
    ctx.lineWidth = 2;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw Axis Tick Labels
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.font = '10px Fira Code, monospace';

    for (let x = -Math.floor(centerX / scale); x <= Math.floor((width - centerX) / scale); x++) {
      if (x !== 0) {
        const px = centerX + x * scale;
        ctx.fillText(x.toString(), px - 5, centerY + 14);
      }
    }

    for (let y = -Math.floor(centerY / scale); y <= Math.floor((height - centerY) / scale); y++) {
      if (y !== 0) {
        const py = centerY - y * scale;
        ctx.fillText(y.toString(), centerX + 6, py + 4);
      }
    }

    // Plot Function f(x)
    try {
      setError(null);
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 3;
      ctx.beginPath();

      let isDrawing = false;
      let prevPy = null;

      for (let px = 0; px < width; px += 2) {
        const xVal = (px - centerX) / scale;

        // Replace 'x' in expression or evaluate AST
        try {
          const exprWithX = functionStr.replace(/\bx\b/g, `(${xVal})`);
          const ast = parse(exprWithX);
          const { result } = evaluateAST(ast, { angleMode: 'RAD' });

          if (typeof result === 'number' && isFinite(result) && !isNaN(result)) {
            const py = centerY - result * scale;

            if (py >= -100 && py <= height + 100) {
              // Asymptote jump check: if y changes sign dramatically across canvas height
              const isAsymptoteJump = prevPy !== null && Math.abs(py - prevPy) > height * 0.5;

              if (!isDrawing || isAsymptoteJump) {
                ctx.moveTo(px, py);
                isDrawing = true;
              } else {
                ctx.lineTo(px, py);
              }
              prevPy = py;
            } else {
              isDrawing = false;
              prevPy = null;
            }
          } else {
            isDrawing = false;
            prevPy = null;
          }
        } catch {
          isDrawing = false;
          prevPy = null;
        }
      }

      ctx.stroke();
    } catch (err) {
      setError(`Invalid function equation '${functionStr}'`);
    }

    // Hover Crosshair & Tooltip
    if (hoverCoord) {
      const { px, py } = hoverCoord;
      const xVal = ((px - centerX) / scale).toFixed(2);
      const yVal = ((centerY - py) / scale).toFixed(2);

      ctx.strokeStyle = 'rgba(236, 72, 153, 0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      ctx.beginPath();
      ctx.moveTo(px, 0); ctx.lineTo(px, height);
      ctx.moveTo(0, py); ctx.lineTo(width, py);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tooltip Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(px + 8, py - 30, 110, 24);
      ctx.strokeStyle = '#ec4899';
      ctx.strokeRect(px + 8, py - 30, 110, 24);

      ctx.fillStyle = '#ffffff';
      ctx.font = '11px Fira Code, monospace';
      ctx.fillText(`(${xVal}, ${yVal})`, px + 14, py - 14);
    }
  }, [functionStr, zoom, hoverCoord]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setHoverCoord({ px, py });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Function Control Panel */}
      <div className="lg:col-span-5 space-y-4">
        <div className="glass-panel p-5 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <LineChart className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-200 text-base">2D Function Plotter</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Enter Function y = f(x):
            </label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-indigo-400 font-bold text-lg">y =</span>
              <input
                type="text"
                value={functionStr}
                onChange={(e) => setFunctionStr(e.target.value)}
                className="w-full bg-slate-900/80 text-white font-mono px-3 py-2 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="e.g. x^2 or sin(x)"
              />
            </div>
          </div>

          {/* Presets */}
          <div>
            <span className="block text-xs font-semibold text-slate-400 mb-2">Preset Functions:</span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setFunctionStr(p)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all ${
                    functionStr === p
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  y = {p}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-xs font-semibold text-slate-400">Zoom Scale: {(zoom * 100).toFixed(0)}%</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoom((z) => Math.min(z * 1.2, 5))}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z / 1.2, 0.2))}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Graph Canvas */}
      <div className="lg:col-span-7 space-y-4">
        <div className="glass-panel p-3 border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={600}
            height={420}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverCoord(null)}
            className="w-full h-[320px] md:h-[420px] rounded-xl bg-slate-950 cursor-crosshair border border-slate-800"
          />
          <div className="text-[11px] text-slate-400 mt-2 font-mono">
            Hover over the graph to inspect exact coordinates (x, y)
          </div>
        </div>
      </div>
    </div>
  );
}

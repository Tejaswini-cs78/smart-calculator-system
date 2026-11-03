import React, { useState } from 'react';
import {
  calculateSquare,
  calculateRectangle,
  calculateTriangleBaseHeight,
  calculateTriangleThreeSides,
  calculateCircle,
  calculateParallelogram,
  calculateTrapezium,
  calculateRhombus,
  calculateKite,
  calculatePentagon,
  calculateRegularHexagon,
  calculateRegularPolygon,
  calculateSemicircle,
  calculateCube,
  calculateCuboid,
  calculateCylinder,
  calculateCone,
  calculateSphere,
  calculateHemisphere,
  calculateTriangularPrism,
  calculateRectangularPrism,
  calculateSquarePyramid,
  calculateGeneralPrism,
  calculateGeneralPyramid
} from '../../engine/geometryEngine';
import ExplanationCard from '../common/ExplanationCard';
import { AlertCircle, Shapes } from 'lucide-react';

export default function GeometryView({ onSaveHistory }) {
  const [dimension, setDimension] = useState('2D'); // '2D' | '3D'
  const [shape, setShape] = useState('Square');

  // Input states
  const [inputs, setInputs] = useState({
    side: '5',
    length: '8',
    width: '5',
    height: '6',
    base: '10',
    sideA: '3',
    sideB: '4',
    sideC: '5',
    radius: '7',
    edge: '4',
    d1: '6',
    d2: '8',
    n: '5',
    baseArea: '20',
    basePerimeter: '16',
    slantHeight: '5',
    prismLength: '10'
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = (e) => {
    e?.preventDefault();
    try {
      setError(null);
      let res;
      if (shape === 'Square') res = calculateSquare(inputs.side);
      else if (shape === 'Rectangle') res = calculateRectangle(inputs.length, inputs.width);
      else if (shape === 'Triangle (Base/Height)') res = calculateTriangleBaseHeight(inputs.base, inputs.height);
      else if (shape === 'Triangle (Heron)') res = calculateTriangleThreeSides(inputs.sideA, inputs.sideB, inputs.sideC);
      else if (shape === 'Circle') res = calculateCircle(inputs.radius);
      else if (shape === 'Parallelogram') res = calculateParallelogram(inputs.base, inputs.height, inputs.side);
      else if (shape === 'Trapezium') res = calculateTrapezium(inputs.sideA, inputs.sideB, inputs.height);
      else if (shape === 'Rhombus') res = calculateRhombus(inputs.d1, inputs.d2, inputs.side);
      else if (shape === 'Kite') res = calculateKite(inputs.d1, inputs.d2, inputs.sideA, inputs.sideB);
      else if (shape === 'Pentagon') res = calculatePentagon(inputs.side);
      else if (shape === 'Hexagon') res = calculateRegularHexagon(inputs.side);
      else if (shape === 'Regular Polygon') res = calculateRegularPolygon(inputs.n, inputs.side);
      else if (shape === 'Semicircle') res = calculateSemicircle(inputs.radius);
      else if (shape === 'Cube') res = calculateCube(inputs.edge);
      else if (shape === 'Cuboid') res = calculateCuboid(inputs.length, inputs.width, inputs.height);
      else if (shape === 'Cylinder') res = calculateCylinder(inputs.radius, inputs.height);
      else if (shape === 'Cone') res = calculateCone(inputs.radius, inputs.height);
      else if (shape === 'Sphere') res = calculateSphere(inputs.radius);
      else if (shape === 'Hemisphere') res = calculateHemisphere(inputs.radius);
      else if (shape === 'Triangular Prism') res = calculateTriangularPrism(inputs.base, inputs.height, inputs.prismLength, inputs.sideA, inputs.sideB, inputs.sideC);
      else if (shape === 'Rectangular Prism') res = calculateRectangularPrism(inputs.length, inputs.width, inputs.height);
      else if (shape === 'Square Pyramid') res = calculateSquarePyramid(inputs.side, inputs.height);
      else if (shape === 'General Prism') res = calculateGeneralPrism(inputs.baseArea, inputs.basePerimeter, inputs.height);
      else if (shape === 'General Pyramid') res = calculateGeneralPyramid(inputs.baseArea, inputs.basePerimeter, inputs.height, inputs.slantHeight);

      setResult(res);
      onSaveHistory?.({
        expression: `Geometry [${res.shape}]`,
        result: res.area !== undefined ? `Area: ${res.area} square units` : `Volume: ${res.volume} cubic units`,
        explanation: { title: `${res.shape} Calculation`, steps: res.steps, finalAnswer: res.area !== undefined ? `Area = ${res.area} square units` : `Volume = ${res.volume} cubic units` },
        mode: 'Geometry'
      });
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 2D / 3D Switch */}
      <div className="glass-panel p-2 flex items-center justify-center gap-2 max-w-sm mx-auto border border-white/10">
        <button
          onClick={() => { setDimension('2D'); setShape('Square'); setResult(null); setError(null); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            dimension === '2D' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          2D Shapes
        </button>
        <button
          onClick={() => { setDimension('3D'); setShape('Cube'); setResult(null); setError(null); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            dimension === '3D' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          3D Mensuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Shapes className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-slate-200 text-base">{dimension} Geometry Parameters</h3>
            </div>

            <form onSubmit={handleCalculate} className="space-y-4">
              {/* Shape selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Select Shape:</label>
                <select
                  value={shape}
                  onChange={(e) => { setShape(e.target.value); setResult(null); setError(null); }}
                  className="w-full bg-slate-900/80 text-white font-semibold px-3 py-2 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  {dimension === '2D' ? (
                    <>
                      <option value="Square">Square</option>
                      <option value="Rectangle">Rectangle</option>
                      <option value="Circle">Circle</option>
                      <option value="Triangle (Base/Height)">Triangle (Base & Height)</option>
                      <option value="Triangle (Heron)">Triangle (3 Sides - Heron's)</option>
                      <option value="Parallelogram">Parallelogram</option>
                      <option value="Trapezium">Trapezium</option>
                      <option value="Rhombus">Rhombus</option>
                      <option value="Kite">Kite</option>
                      <option value="Pentagon">Pentagon (Regular)</option>
                      <option value="Hexagon">Regular Hexagon</option>
                      <option value="Regular Polygon">Regular Polygon (n sides)</option>
                      <option value="Semicircle">Semicircle</option>
                    </>
                  ) : (
                    <>
                      <option value="Cube">Cube</option>
                      <option value="Cuboid">Cuboid</option>
                      <option value="Cylinder">Cylinder</option>
                      <option value="Cone">Cone</option>
                      <option value="Sphere">Sphere</option>
                      <option value="Hemisphere">Hemisphere</option>
                      <option value="Triangular Prism">Triangular Prism</option>
                      <option value="Rectangular Prism">Rectangular Prism</option>
                      <option value="Square Pyramid">Square Pyramid</option>
                      <option value="General Prism">General Prism</option>
                      <option value="General Pyramid">General Pyramid</option>
                    </>
                  )}
                </select>
              </div>

              {/* Dynamic Parameter Inputs */}
              <div className="space-y-3">
                {(shape === 'Square' || shape === 'Pentagon' || shape === 'Hexagon') && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Side Length (a)</label>
                    <input type="number" step="any" value={inputs.side} onChange={(e) => handleInputChange('side', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                  </div>
                )}

                {(shape === 'Rectangle' || shape === 'Rectangular Prism') && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Length (l)</label>
                      <input type="number" step="any" value={inputs.length} onChange={(e) => handleInputChange('length', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Width (w)</label>
                      <input type="number" step="any" value={inputs.width} onChange={(e) => handleInputChange('width', e.target.value)} className="w-full bg-slate-900/80 text-slate-700 p-2 rounded-lg border border-slate-700" />
                    </div>
                    {shape === 'Rectangular Prism' && (
                      <div className="col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">Height (h)</label>
                        <input type="number" step="any" value={inputs.height} onChange={(e) => handleInputChange('height', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                      </div>
                    )}
                  </div>
                )}

                {(shape === 'Circle' || shape === 'Sphere' || shape === 'Semicircle' || shape === 'Hemisphere') && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Radius (r)</label>
                    <input type="number" step="any" value={inputs.radius} onChange={(e) => handleInputChange('radius', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                  </div>
                )}

                {(shape === 'Rhombus' || shape === 'Kite') && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Diagonal 1 (d₁)</label>
                      <input type="number" step="any" value={inputs.d1} onChange={(e) => handleInputChange('d1', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Diagonal 2 (d₂)</label>
                      <input type="number" step="any" value={inputs.d2} onChange={(e) => handleInputChange('d2', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                    {shape === 'Rhombus' && (
                      <div className="col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">Side Length (optional, auto-derived if empty)</label>
                        <input type="number" step="any" value={inputs.side} onChange={(e) => handleInputChange('side', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                      </div>
                    )}
                    {shape === 'Kite' && (
                      <>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Side a (optional)</label>
                          <input type="number" step="any" value={inputs.sideA} onChange={(e) => handleInputChange('sideA', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Side b (optional)</label>
                          <input type="number" step="any" value={inputs.sideB} onChange={(e) => handleInputChange('sideB', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {shape === 'Regular Polygon' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Number of Sides (n)</label>
                      <input type="number" step="1" min="3" value={inputs.n} onChange={(e) => handleInputChange('n', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Side Length (a)</label>
                      <input type="number" step="any" value={inputs.side} onChange={(e) => handleInputChange('side', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                  </div>
                )}

                {shape === 'Square Pyramid' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Base Edge (a)</label>
                      <input type="number" step="any" value={inputs.side} onChange={(e) => handleInputChange('side', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Pyramid Height (h)</label>
                      <input type="number" step="any" value={inputs.height} onChange={(e) => handleInputChange('height', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                  </div>
                )}

                {shape === 'Triangular Prism' && (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Base (b)</label>
                      <input type="number" step="any" value={inputs.base} onChange={(e) => handleInputChange('base', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Base Height (h)</label>
                      <input type="number" step="any" value={inputs.height} onChange={(e) => handleInputChange('height', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Length (L)</label>
                      <input type="number" step="any" value={inputs.prismLength} onChange={(e) => handleInputChange('prismLength', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                  </div>
                )}

                {(shape === 'General Prism' || shape === 'General Pyramid') && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Base Area (B)</label>
                      <input type="number" step="any" value={inputs.baseArea} onChange={(e) => handleInputChange('baseArea', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Height (h)</label>
                      <input type="number" step="any" value={inputs.height} onChange={(e) => handleInputChange('height', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Base Perimeter (P)</label>
                      <input type="number" step="any" value={inputs.basePerimeter} onChange={(e) => handleInputChange('basePerimeter', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                    {shape === 'General Pyramid' && (
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Slant Height (l)</label>
                        <input type="number" step="any" value={inputs.slantHeight} onChange={(e) => handleInputChange('slantHeight', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                      </div>
                    )}
                  </div>
                )}

                {shape === 'Triangle (Base/Height)' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Base (b)</label>
                      <input type="number" step="any" value={inputs.base} onChange={(e) => handleInputChange('base', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Height (h)</label>
                      <input type="number" step="any" value={inputs.height} onChange={(e) => handleInputChange('height', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                  </div>
                )}

                {shape === 'Triangle (Heron)' && (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Side a</label>
                      <input type="number" step="any" value={inputs.sideA} onChange={(e) => handleInputChange('sideA', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Side b</label>
                      <input type="number" step="any" value={inputs.sideB} onChange={(e) => handleInputChange('sideB', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Side c</label>
                      <input type="number" step="any" value={inputs.sideC} onChange={(e) => handleInputChange('sideC', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                    </div>
                  </div>
                )}

                {shape === 'Cube' && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Edge Length (a)</label>
                    <input type="number" step="any" value={inputs.edge} onChange={(e) => handleInputChange('edge', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                  </div>
                )}

                {(shape === 'Cylinder' || shape === 'Cone' || shape === 'Parallelogram' || shape === 'Trapezium') && (
                  <div className="grid grid-cols-2 gap-2">
                    {shape === 'Trapezium' ? (
                      <>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Parallel side a</label>
                          <input type="number" step="any" value={inputs.sideA} onChange={(e) => handleInputChange('sideA', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Parallel side b</label>
                          <input type="number" step="any" value={inputs.sideB} onChange={(e) => handleInputChange('sideB', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-slate-400 mb-1">Height (h)</label>
                          <input type="number" step="any" value={inputs.height} onChange={(e) => handleInputChange('height', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                        </div>
                      </>
                    ) : shape === 'Parallelogram' ? (
                      <>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Base (b)</label>
                          <input type="number" step="any" value={inputs.base} onChange={(e) => handleInputChange('base', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Height (h)</label>
                          <input type="number" step="any" value={inputs.height} onChange={(e) => handleInputChange('height', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Radius (r)</label>
                          <input type="number" step="any" value={inputs.radius} onChange={(e) => handleInputChange('radius', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Height (h)</label>
                          <input type="number" step="any" value={inputs.height} onChange={(e) => handleInputChange('height', e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700" />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:from-indigo-500 hover:to-purple-500 transition-all"
              >
                Calculate {shape} Geometry
              </button>
            </form>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.area !== undefined && (
                  <div className="glass-card p-4 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Area</span>
                      <div className="font-mono text-xl font-bold text-indigo-300 mt-1">{result.area} square units</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-semibold text-slate-400 block">Approximately:</span>
                      <span className="font-mono text-sm font-semibold text-indigo-200">{Math.round(result.area)} square units</span>
                    </div>
                  </div>
                )}
                {result.perimeter !== undefined && (
                  <div className="glass-card p-4 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Perimeter</span>
                      <div className="font-mono text-xl font-bold text-indigo-300 mt-1">{result.perimeter} units</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-semibold text-slate-400 block">Approximately:</span>
                      <span className="font-mono text-sm font-semibold text-indigo-200">{Math.round(result.perimeter)} units</span>
                    </div>
                  </div>
                )}
                {result.diameter !== undefined && (
                  <div className="glass-card p-4 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Diameter</span>
                      <div className="font-mono text-xl font-bold text-indigo-300 mt-1">{result.diameter} units</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-semibold text-slate-400 block">Approximately:</span>
                      <span className="font-mono text-sm font-semibold text-indigo-200">{Math.round(result.diameter)} units</span>
                    </div>
                  </div>
                )}
                {result.circumference !== undefined && (
                  <div className="glass-card p-4 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Circumference</span>
                      <div className="font-mono text-xl font-bold text-indigo-300 mt-1">{result.circumference} units</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-semibold text-slate-400 block">Approximately:</span>
                      <span className="font-mono text-sm font-semibold text-indigo-200">{Math.round(result.circumference)} units</span>
                    </div>
                  </div>
                )}
                {result.diagonal !== undefined && (
                  <div className="glass-card p-4 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Diagonal</span>
                      <div className="font-mono text-xl font-bold text-indigo-300 mt-1">{result.diagonal} units</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-semibold text-slate-400 block">Approximately:</span>
                      <span className="font-mono text-sm font-semibold text-indigo-200">{Math.round(result.diagonal)} units</span>
                    </div>
                  </div>
                )}
                {result.slantHeight !== undefined && (
                  <div className="glass-card p-4 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Slant Height</span>
                      <div className="font-mono text-xl font-bold text-indigo-300 mt-1">{result.slantHeight} units</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-semibold text-slate-400 block">Approximately:</span>
                      <span className="font-mono text-sm font-semibold text-indigo-200">{Math.round(result.slantHeight)} units</span>
                    </div>
                  </div>
                )}
                {result.semiPerimeter !== undefined && (
                  <div className="glass-card p-4 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Semi-Perimeter</span>
                      <div className="font-mono text-xl font-bold text-indigo-300 mt-1">{result.semiPerimeter} units</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-semibold text-slate-400 block">Approximately:</span>
                      <span className="font-mono text-sm font-semibold text-indigo-200">{Math.round(result.semiPerimeter)} units</span>
                    </div>
                  </div>
                )}
                {result.arcLength !== undefined && (
                  <div className="glass-card p-4 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Curved Arc Length</span>
                      <div className="font-mono text-xl font-bold text-indigo-300 mt-1">{result.arcLength} units</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-semibold text-slate-400 block">Approximately:</span>
                      <span className="font-mono text-sm font-semibold text-indigo-200">{Math.round(result.arcLength)} units</span>
                    </div>
                  </div>
                )}
                {result.volume !== undefined && (
                  <div className="glass-card p-4 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Volume</span>
                      <div className="font-mono text-xl font-bold text-indigo-300 mt-1">{result.volume} cubic units</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-semibold text-slate-400 block">Approximately:</span>
                      <span className="font-mono text-sm font-semibold text-indigo-200">{Math.round(result.volume)} cubic units</span>
                    </div>
                  </div>
                )}
                {result.tsa !== undefined && (
                  <div className="glass-card p-4 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Surface Area</span>
                      <div className="font-mono text-xl font-bold text-indigo-300 mt-1">{result.tsa} square units</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-semibold text-slate-400 block">Approximately:</span>
                      <span className="font-mono text-sm font-semibold text-indigo-200">{Math.round(result.tsa)} square units</span>
                    </div>
                  </div>
                )}
                {result.csa !== undefined && (
                  <div className="glass-card p-4 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Curved Surface Area</span>
                      <div className="font-mono text-xl font-bold text-indigo-300 mt-1">{result.csa} square units</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-semibold text-slate-400 block">Approximately:</span>
                      <span className="font-mono text-sm font-semibold text-indigo-200">{Math.round(result.csa)} square units</span>
                    </div>
                  </div>
                )}
                {result.lsa !== undefined && (
                  <div className="glass-card p-4 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Lateral Surface Area</span>
                      <div className="font-mono text-xl font-bold text-indigo-300 mt-1">{result.lsa} square units</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-semibold text-slate-400 block">Approximately:</span>
                      <span className="font-mono text-sm font-semibold text-indigo-200">{Math.round(result.lsa)} square units</span>
                    </div>
                  </div>
                )}
                {result.surfaceArea !== undefined && (
                  <div className="glass-card p-4 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Surface Area</span>
                      <div className="font-mono text-xl font-bold text-indigo-300 mt-1">{result.surfaceArea} square units</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-semibold text-slate-400 block">Approximately:</span>
                      <span className="font-mono text-sm font-semibold text-indigo-200">{Math.round(result.surfaceArea)} square units</span>
                    </div>
                  </div>
                )}
              </div>

              <ExplanationCard
                explanation={{
                  title: `${result.shape} Formulas & Substitution`,
                  steps: result.steps,
                  finalAnswer: result.area !== undefined ? `Area = ${result.area} square units (Approx: ${Math.round(result.area)} square units)` : `Volume = ${result.volume} cubic units (Approx: ${Math.round(result.volume)} cubic units)`
                }}
                defaultExpanded={true}
              />
            </div>
          ) : (
            <div className="glass-card p-6 text-center text-slate-400 space-y-2">
              <h3 className="font-semibold text-slate-300">Geometric Mensuration</h3>
              <p className="text-xs">
                Select a 2D shape or 3D solid, enter dimensions, and view exact geometric formula evaluations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

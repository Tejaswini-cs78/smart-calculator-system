import React from 'react';
import {
  Calculator,
  Compass,
  Binary,
  Shapes,
  PieChart,
  ArrowRightLeft,
  DollarSign,
  LineChart,
  History,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const CARDS = [
  {
    id: 'Basic',
    title: 'Basic Calculator',
    description: 'Everyday arithmetic calculations',
    icon: Calculator,
    color: 'from-blue-500 to-indigo-600',
    items: ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Percentage', 'Parentheses']
  },
  {
    id: 'Scientific',
    title: 'Scientific Calculator',
    description: 'Advanced scientific and mathematical calculations',
    icon: Compass,
    color: 'from-indigo-500 to-purple-600',
    items: ['Sin, Cos, Tan', 'Csc, Sec, Cot', 'Log, Ln, log₂', 'Powers & Roots', 'Factorial (n!)', 'π, e & DEG/RAD']
  },
  {
    id: 'Algebra',
    title: 'Algebra',
    description: 'Solve and understand algebraic equations',
    icon: Binary,
    color: 'from-purple-500 to-pink-600',
    items: ['Linear equations', 'Quadratic equations', 'Step-by-step solving', 'Substitution verification']
  },
  {
    id: 'Geometry',
    title: 'Geometry & Mensuration',
    description: 'Calculate 2D and 3D mathematical measurements',
    icon: Shapes,
    color: 'from-pink-500 to-rose-600',
    items: ['Square & Rectangle', 'Triangle & Circle', 'Parallelogram & Trapezium', 'Cube, Cuboid & Sphere', 'Cylinder & Cone']
  },
  {
    id: 'Statistics',
    title: 'Statistics',
    description: 'Analyze numerical data',
    icon: PieChart,
    color: 'from-amber-500 to-orange-600',
    items: ['Mean & Median', 'Mode & Range', 'Variance (s², σ²)', 'Standard deviation']
  },
  {
    id: 'Converter',
    title: 'Unit Converter',
    description: 'Convert common measurement units',
    icon: ArrowRightLeft,
    color: 'from-emerald-500 to-teal-600',
    items: ['Length & Mass', 'Temperature (°C, °F, K)', 'Time & Area', 'Digital storage']
  },
  {
    id: 'Finance',
    title: 'Finance',
    description: 'Perform common financial calculations',
    icon: DollarSign,
    color: 'from-teal-500 to-cyan-600',
    items: ['Percentage', 'Profit / Loss', 'Simple Interest', 'Compound Interest', 'Loan EMI']
  },
  {
    id: 'Graph',
    title: 'Graphing',
    description: 'Visualize mathematical functions',
    icon: LineChart,
    color: 'from-cyan-500 to-blue-600',
    items: ['Linear functions', 'Quadratic functions', 'Trigonometric functions', '2D Function graphs']
  },
  {
    id: 'History',
    title: 'History & Favorites',
    description: 'View previous calculations and explanations',
    icon: History,
    color: 'from-violet-500 to-indigo-600',
    items: ['Calculation history', 'Step explanations', 'Saved favorites', 'Recall expressions']
  }
];

export default function HomePage({ onSelectMode }) {
  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* Dashboard Title & Tagline Banner */}
      <div className="glass-panel p-6 text-center border border-white/10 shadow-xl space-y-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-indigo-400" />
        </div>
        <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 inline-block">
          DASHBOARD
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
          SMART CALCULATOR SYSTEM
        </h1>
        <p className="text-sm md:text-base text-indigo-300 font-medium">
          Calculate. Understand. Learn.
        </p>
        <p className="text-xs text-slate-400 max-w-xl mx-auto pt-1">
          Choose your desired mathematical tool from the cards below to begin calculating with step-by-step explanations.
        </p>
      </div>

      {/* Grid of Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onSelectMode(card.id)}
              className="glass-card p-5 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-xl group flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Row: Icon & Title */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl bg-gradient-to-tr ${card.color} text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    {card.description}
                  </p>
                </div>

                {/* Feature checklist tags */}
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">Includes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {card.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-indigo-200 border border-white/10 group-hover:bg-indigo-500/10 transition-colors"
                      >
                        • {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Action Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-indigo-400">
                <span>Launch {card.title}</span>
                <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Geometry and 3D Mensuration Engine

import { cleanFloat } from './evaluator.js';

export function calculateSquare(sideInput) {
  const s = parseFloat(sideInput);
  if (isNaN(s) || s <= 0) throw new Error('Square side length must be a positive number.');

  const area = cleanFloat(s * s);
  const perimeter = cleanFloat(4 * s);
  const diagonal = cleanFloat(s * Math.SQRT2);

  const steps = [
    `Square Side (a) = ${s}`,
    `Area Formula: A = a² = (${s})² = ${area} square units`,
    `Perimeter Formula: P = 4a = 4 × ${s} = ${perimeter} units`,
    `Diagonal Formula: d = a√2 = ${s} × 1.41421... = ${diagonal} units`
  ];

  return { shape: 'Square', area, perimeter, diagonal, steps };
}

export function calculateRectangle(lInput, wInput) {
  const l = parseFloat(lInput);
  const w = parseFloat(wInput);
  if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) {
    throw new Error('Rectangle length and width must be positive numbers.');
  }

  const area = cleanFloat(l * w);
  const perimeter = cleanFloat(2 * (l + w));
  const diagonal = cleanFloat(Math.sqrt(l * l + w * w));

  const steps = [
    `Length (l) = ${l}, Width (w) = ${w}`,
    `Area Formula: A = l × w = ${l} × ${w} = ${area} square units`,
    `Perimeter Formula: P = 2(l + w) = 2(${l} + ${w}) = ${perimeter} units`,
    `Diagonal Formula: d = √(l² + w²) = √(${l * l} + ${w * w}) = √${l * l + w * w} = ${diagonal} units`
  ];

  return { shape: 'Rectangle', area, perimeter, diagonal, steps };
}

export function calculateTriangleBaseHeight(baseInput, heightInput) {
  const b = parseFloat(baseInput);
  const h = parseFloat(heightInput);
  if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) {
    throw new Error('Triangle base and height must be positive numbers.');
  }

  const area = cleanFloat(0.5 * b * h);
  const steps = [
    `Base (b) = ${b}, Height (h) = ${h}`,
    `Area Formula: A = ½ × b × h = ½ × ${b} × ${h} = ${area} square units`
  ];

  return { shape: 'Triangle (Base/Height)', area, steps };
}

export function calculateTriangleThreeSides(aInput, bInput, cInput) {
  const a = parseFloat(aInput);
  const b = parseFloat(bInput);
  const c = parseFloat(cInput);

  if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
    throw new Error('Triangle side lengths must be positive numbers.');
  }

  // Check triangle inequality rule
  if (a + b <= c || a + c <= b || b + c <= a) {
    throw new Error(`Side lengths (${a}, ${b}, ${c}) violate triangle inequality (a + b > c). No valid triangle can be formed.`);
  }

  const perimeter = cleanFloat(a + b + c);
  const s = cleanFloat(perimeter / 2); // Semi-perimeter
  const areaVal = cleanFloat(Math.sqrt(s * (s - a) * (s - b) * (s - c)));

  const steps = [
    `Side lengths: a = ${a}, b = ${b}, c = ${c}`,
    `Triangle Inequality Check: ${a}+${b}>${c}, ${a}+${c}>${b}, ${b}+${c}>${a} ✓ Valid Triangle`,
    `Perimeter: P = a + b + c = ${a} + ${b} + ${c} = ${perimeter} units`,
    `Semi-perimeter (s): s = P / 2 = ${perimeter} / 2 = ${s} units`,
    `Heron's Area Formula: A = √(s(s - a)(s - b)(s - c))`,
    `A = √(${s} × (${s} - ${a}) × (${s} - ${b}) × (${s} - ${c}))`,
    `A = √(${s} × ${s - a} × ${s - b} × ${s - c}) = ${areaVal} square units`
  ];

  return { shape: 'Triangle (Heron\'s Formula)', area: areaVal, perimeter, semiPerimeter: s, steps };
}

export function calculateCircle(radiusInput) {
  const r = parseFloat(radiusInput);
  if (isNaN(r) || r <= 0) throw new Error('Circle radius must be a positive number.');

  const diameter = cleanFloat(2 * r);
  const circumference = cleanFloat(2 * Math.PI * r);
  const area = cleanFloat(Math.PI * r * r);

  const steps = [
    `Radius (r) = ${r}`,
    `Diameter (d) = 2r = 2 × ${r} = ${diameter} units`,
    `Circumference (C) = 2πr = 2 × π × ${r} ≈ ${circumference} units`,
    `Area (A) = πr² = π × (${r})² = π × ${r * r} ≈ ${area} square units`
  ];

  return { shape: 'Circle', radius: r, diameter, circumference, area, steps };
}

export function calculateParallelogram(baseInput, heightInput, sideInput) {
  const b = parseFloat(baseInput);
  const h = parseFloat(heightInput);
  const s = sideInput ? parseFloat(sideInput) : null;

  if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) {
    throw new Error('Parallelogram base and height must be positive numbers.');
  }

  const area = cleanFloat(b * h);
  let perimeter = null;
  const steps = [
    `Base (b) = ${b}, Height (h) = ${h}`,
    `Area Formula: A = b × h = ${b} × ${h} = ${area} square units`
  ];

  if (s && !isNaN(s) && s > 0) {
    perimeter = cleanFloat(2 * (b + s));
    steps.push(`Side (s) = ${s}`);
    steps.push(`Perimeter Formula: P = 2(b + s) = 2(${b} + ${s}) = ${perimeter} units`);
  }

  return { shape: 'Parallelogram', area, perimeter, steps };
}

export function calculateTrapezium(aInput, bInput, heightInput) {
  const a = parseFloat(aInput);
  const b = parseFloat(bInput);
  const h = parseFloat(heightInput);

  if (isNaN(a) || isNaN(b) || isNaN(h) || a <= 0 || b <= 0 || h <= 0) {
    throw new Error('Trapezium parallel sides (a, b) and height (h) must be positive numbers.');
  }

  const area = cleanFloat(0.5 * (a + b) * h);
  const steps = [
    `Parallel side 1 (a) = ${a}, Parallel side 2 (b) = ${b}, Height (h) = ${h}`,
    `Area Formula: A = ½ × (a + b) × h`,
    `A = ½ × (${a} + ${b}) × ${h} = ½ × ${a + b} × ${h} = ${area} square units`
  ];

  return { shape: 'Trapezium', area, steps };
}

// 3D Mensuration
export function calculateCube(edgeInput) {
  const a = parseFloat(edgeInput);
  if (isNaN(a) || a <= 0) throw new Error('Cube edge must be a positive number.');

  const volume = cleanFloat(a * a * a);
  const tsa = cleanFloat(6 * a * a); // Total Surface Area
  const csa = cleanFloat(4 * a * a); // Curved/Lateral Surface Area

  const steps = [
    `Cube Edge (a) = ${a}`,
    `Volume Formula: V = a³ = (${a})³ = ${volume} cubic units`,
    `Total Surface Area (TSA): 6a² = 6 × (${a})² = ${tsa} square units`,
    `Lateral Surface Area (LSA): 4a² = 4 × (${a})² = ${csa} square units`
  ];

  return { shape: 'Cube (3D)', volume, tsa, csa, steps };
}

export function calculateCuboid(lInput, wInput, hInput) {
  const l = parseFloat(lInput);
  const w = parseFloat(wInput);
  const h = parseFloat(hInput);

  if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) {
    throw new Error('Cuboid dimensions (l, w, h) must be positive numbers.');
  }

  const volume = cleanFloat(l * w * h);
  const tsa = cleanFloat(2 * (l * w + l * h + w * h));
  const lsa = cleanFloat(2 * h * (l + w));

  const steps = [
    `Cuboid Dimensions: Length = ${l}, Width = ${w}, Height = ${h}`,
    `Volume Formula: V = l × w × h = ${l} × ${w} × ${h} = ${volume} cubic units`,
    `Total Surface Area (TSA): 2(lw + lh + wh) = 2(${l * w} + ${l * h} + ${w * h}) = ${tsa} square units`,
    `Lateral Surface Area (LSA): 2h(l + w) = 2(${h}) × (${l} + ${w}) = ${lsa} square units`
  ];

  return { shape: 'Cuboid (3D)', volume, tsa, lsa, steps };
}

export function calculateCylinder(rInput, hInput) {
  const r = parseFloat(rInput);
  const h = parseFloat(hInput);

  if (isNaN(r) || isNaN(h) || r <= 0 || h <= 0) {
    throw new Error('Cylinder radius and height must be positive numbers.');
  }

  const volume = cleanFloat(Math.PI * r * r * h);
  const csa = cleanFloat(2 * Math.PI * r * h);
  const tsa = cleanFloat(2 * Math.PI * r * (r + h));

  const steps = [
    `Cylinder: Radius (r) = ${r}, Height (h) = ${h}`,
    `Volume Formula: V = πr²h = π × (${r})² × ${h} ≈ ${volume} cubic units`,
    `Curved Surface Area (CSA): 2πrh = 2 × π × ${r} × ${h} ≈ ${csa} square units`,
    `Total Surface Area (TSA): 2πr(r + h) = 2 × π × ${r} × (${r} + ${h}) ≈ ${tsa} square units`
  ];

  return { shape: 'Cylinder (3D)', volume, csa, tsa, steps };
}

export function calculateCone(rInput, hInput) {
  const r = parseFloat(rInput);
  const h = parseFloat(hInput);

  if (isNaN(r) || isNaN(h) || r <= 0 || h <= 0) {
    throw new Error('Cone radius and height must be positive numbers.');
  }

  const slantHeight = cleanFloat(Math.sqrt(r * r + h * h));
  const volume = cleanFloat((1 / 3) * Math.PI * r * r * h);
  const csa = cleanFloat(Math.PI * r * slantHeight);
  const tsa = cleanFloat(Math.PI * r * (r + slantHeight));

  const steps = [
    `Cone: Radius (r) = ${r}, Height (h) = ${h}`,
    `Slant Height (l): l = √(r² + h²) = √(${r * r} + ${h * h}) = ${slantHeight} units`,
    `Volume Formula: V = ⅓πr²h = ⅓ × π × (${r})² × ${h} ≈ ${volume} cubic units`,
    `Curved Surface Area (CSA): πrl = π × ${r} × ${slantHeight} ≈ ${csa} square units`,
    `Total Surface Area (TSA): πr(r + l) = π × ${r} × (${r} + ${slantHeight}) ≈ ${tsa} square units`
  ];

  return { shape: 'Cone (3D)', slantHeight, volume, csa, tsa, steps };
}

export function calculateSphere(rInput) {
  const r = parseFloat(rInput);
  if (isNaN(r) || r <= 0) throw new Error('Sphere radius must be a positive number.');

  const volume = cleanFloat((4 / 3) * Math.PI * Math.pow(r, 3));
  const surfaceArea = cleanFloat(4 * Math.PI * r * r);

  const steps = [
    `Sphere Radius (r) = ${r}`,
    `Volume Formula: V = ⁴⁄₃πr³ = ⁴⁄₃ × π × (${r})³ ≈ ${volume} cubic units`,
    `Surface Area Formula: SA = 4πr² = 4 × π × (${r})² ≈ ${surfaceArea} square units`
  ];

  return { shape: 'Sphere (3D)', volume, surfaceArea, steps };
}

// New 2D Shapes
export function calculateRhombus(d1Input, d2Input, sideInput) {
  const d1 = parseFloat(d1Input);
  const d2 = parseFloat(d2Input);
  let s = sideInput ? parseFloat(sideInput) : null;

  if (isNaN(d1) || isNaN(d2) || d1 <= 0 || d2 <= 0) {
    throw new Error('Rhombus diagonals (d1, d2) must be positive numbers.');
  }

  const area = cleanFloat((d1 * d2) / 2);
  if (!s || isNaN(s) || s <= 0) {
    s = cleanFloat(Math.sqrt(Math.pow(d1 / 2, 2) + Math.pow(d2 / 2, 2)));
  }
  const perimeter = cleanFloat(4 * s);

  const steps = [
    `Diagonal 1 (d₁) = ${d1}, Diagonal 2 (d₂) = ${d2}`,
    `Area Formula: A = (d₁ × d₂) / 2 = (${d1} × ${d2}) / 2 = ${area} square units`,
    `Side Length (a): a = √((d₁/2)² + (d₂/2)²) = ${s} units`,
    `Perimeter Formula: P = 4a = 4 × ${s} = ${perimeter} units`
  ];

  return { shape: 'Rhombus', area, perimeter, side: s, steps };
}

export function calculateKite(d1Input, d2Input, aInput, bInput) {
  const d1 = parseFloat(d1Input);
  const d2 = parseFloat(d2Input);
  const a = aInput ? parseFloat(aInput) : null;
  const b = bInput ? parseFloat(bInput) : null;

  if (isNaN(d1) || isNaN(d2) || d1 <= 0 || d2 <= 0) {
    throw new Error('Kite diagonals (d1, d2) must be positive numbers.');
  }

  const area = cleanFloat((d1 * d2) / 2);
  let perimeter = null;
  const steps = [
    `Diagonal 1 (d₁) = ${d1}, Diagonal 2 (d₂) = ${d2}`,
    `Area Formula: A = (d₁ × d₂) / 2 = (${d1} × ${d2}) / 2 = ${area} square units`
  ];

  if (a && b && !isNaN(a) && !isNaN(b) && a > 0 && b > 0) {
    perimeter = cleanFloat(2 * (a + b));
    steps.push(`Sides: a = ${a}, b = ${b}`);
    steps.push(`Perimeter Formula: P = 2(a + b) = 2(${a} + ${b}) = ${perimeter} units`);
  }

  return { shape: 'Kite', area, perimeter, steps };
}

export function calculatePentagon(sideInput) {
  const a = parseFloat(sideInput);
  if (isNaN(a) || a <= 0) throw new Error('Pentagon side length must be a positive number.');

  const area = cleanFloat((1 / 4) * Math.sqrt(5 * (5 + 2 * Math.sqrt(5))) * a * a);
  const perimeter = cleanFloat(5 * a);

  const steps = [
    `Regular Pentagon Side (a) = ${a}`,
    `Perimeter Formula: P = 5a = 5 × ${a} = ${perimeter} units`,
    `Area Formula: A = ¼ × √(5(5 + 2√5)) × a² ≈ 1.720477 × (${a})² = ${area} square units`
  ];

  return { shape: 'Regular Pentagon', area, perimeter, steps };
}

export function calculateRegularHexagon(sideInput) {
  const a = parseFloat(sideInput);
  if (isNaN(a) || a <= 0) throw new Error('Hexagon side length must be a positive number.');

  const area = cleanFloat(((3 * Math.sqrt(3)) / 2) * a * a);
  const perimeter = cleanFloat(6 * a);

  const steps = [
    `Regular Hexagon Side (a) = ${a}`,
    `Perimeter Formula: P = 6a = 6 × ${a} = ${perimeter} units`,
    `Area Formula: A = (3√3 / 2) × a² = (2.598076...) × (${a})² = ${area} square units`
  ];

  return { shape: 'Regular Hexagon', area, perimeter, steps };
}

export function calculateRegularPolygon(nInput, sideInput) {
  const n = parseInt(nInput, 10);
  const a = parseFloat(sideInput);

  if (isNaN(n) || n < 3) throw new Error('Number of sides (n) must be an integer ≥ 3.');
  if (isNaN(a) || a <= 0) throw new Error('Polygon side length must be a positive number.');

  const perimeter = cleanFloat(n * a);
  const area = cleanFloat((n * a * a) / (4 * Math.tan(Math.PI / n)));

  const steps = [
    `Regular Polygon: Number of sides (n) = ${n}, Side length (a) = ${a}`,
    `Perimeter Formula: P = n × a = ${n} × ${a} = ${perimeter} units`,
    `Area Formula: A = (n × a²) / (4 × tan(π/n))`,
    `A = (${n} × (${a})²) / (4 × tan(π/${n})) = ${area} square units`
  ];

  return { shape: 'Regular Polygon', sides: n, area, perimeter, steps };
}

export function calculateSemicircle(radiusInput) {
  const r = parseFloat(radiusInput);
  if (isNaN(r) || r <= 0) throw new Error('Semicircle radius must be a positive number.');

  const area = cleanFloat((Math.PI * r * r) / 2);
  const arcLength = cleanFloat(Math.PI * r);
  const totalPerimeter = cleanFloat(Math.PI * r + 2 * r);

  const steps = [
    `Semicircle Radius (r) = ${r}`,
    `Area Formula: A = (πr²) / 2 = (π × (${r})²) / 2 ≈ ${area} square units`,
    `Curved Arc Length: L = πr = π × ${r} ≈ ${arcLength} units`,
    `Total Perimeter (Arc + Diameter): P = πr + 2r = ${arcLength} + ${2 * r} ≈ ${totalPerimeter} units`
  ];

  return { shape: 'Semicircle', radius: r, area, arcLength, perimeter: totalPerimeter, steps };
}

// New 3D Solids
export function calculateHemisphere(radiusInput) {
  const r = parseFloat(radiusInput);
  if (isNaN(r) || r <= 0) throw new Error('Hemisphere radius must be a positive number.');

  const volume = cleanFloat((2 / 3) * Math.PI * Math.pow(r, 3));
  const csa = cleanFloat(2 * Math.PI * r * r);
  const tsa = cleanFloat(3 * Math.PI * r * r);

  const steps = [
    `Hemisphere Radius (r) = ${r}`,
    `Volume Formula: V = ⅔πr³ = ⅔ × π × (${r})³ ≈ ${volume} cubic units`,
    `Curved Surface Area (CSA): 2πr² = 2 × π × (${r})² ≈ ${csa} square units`,
    `Total Surface Area (TSA): 3πr² = 3 × π × (${r})² ≈ ${tsa} square units`
  ];

  return { shape: 'Hemisphere (3D)', volume, csa, tsa, steps };
}

export function calculateTriangularPrism(bInput, hInput, LInput, a1Input, a2Input, a3Input) {
  const b = parseFloat(bInput);
  const h = parseFloat(hInput);
  const L = parseFloat(LInput);

  if (isNaN(b) || isNaN(h) || isNaN(L) || b <= 0 || h <= 0 || L <= 0) {
    throw new Error('Triangular prism base (b), height (h), and length (L) must be positive numbers.');
  }

  const baseArea = cleanFloat(0.5 * b * h);
  const volume = cleanFloat(baseArea * L);

  const a1 = a1Input ? parseFloat(a1Input) : b;
  const a2 = a2Input ? parseFloat(a2Input) : b;
  const a3 = a3Input ? parseFloat(a3Input) : b;
  const basePerimeter = cleanFloat(a1 + a2 + a3);
  const tsa = cleanFloat(2 * baseArea + basePerimeter * L);

  const steps = [
    `Triangular Prism: Base = ${b}, Base Height = ${h}, Prism Length = ${L}`,
    `Base Area (B): B = ½ × b × h = ½ × ${b} × ${h} = ${baseArea} square units`,
    `Volume Formula: V = B × L = ${baseArea} × ${L} = ${volume} cubic units`,
    `Total Surface Area (TSA): 2B + (a₁ + a₂ + a₃)L = 2(${baseArea}) + (${basePerimeter}) × ${L} = ${tsa} square units`
  ];

  return { shape: 'Triangular Prism (3D)', volume, tsa, steps };
}

export function calculateRectangularPrism(lInput, wInput, hInput) {
  return calculateCuboid(lInput, wInput, hInput);
}

export function calculateSquarePyramid(baseEdgeInput, heightInput) {
  const a = parseFloat(baseEdgeInput);
  const h = parseFloat(heightInput);

  if (isNaN(a) || isNaN(h) || a <= 0 || h <= 0) {
    throw new Error('Square pyramid base edge (a) and height (h) must be positive numbers.');
  }

  const slantHeight = cleanFloat(Math.sqrt(Math.pow(a / 2, 2) + h * h));
  const volume = cleanFloat((1 / 3) * a * a * h);
  const lsa = cleanFloat(2 * a * slantHeight);
  const tsa = cleanFloat(a * a + lsa);

  const steps = [
    `Square Pyramid: Base Edge (a) = ${a}, Height (h) = ${h}`,
    `Slant Height (l): l = √((a/2)² + h²) = √(${Math.pow(a / 2, 2)} + ${h * h}) = ${slantHeight} units`,
    `Volume Formula: V = ⅓a²h = ⅓ × (${a})² × ${h} = ${volume} cubic units`,
    `Lateral Surface Area (LSA): 2al = 2 × ${a} × ${slantHeight} = ${lsa} square units`,
    `Total Surface Area (TSA): a² + 2al = (${a})² + ${lsa} = ${tsa} square units`
  ];

  return { shape: 'Square Pyramid (3D)', slantHeight, volume, lsa, tsa, steps };
}

export function calculateGeneralPrism(baseAreaInput, basePerimeterInput, heightInput) {
  const B = parseFloat(baseAreaInput);
  const P = parseFloat(basePerimeterInput);
  const h = parseFloat(heightInput);

  if (isNaN(B) || isNaN(P) || isNaN(h) || B <= 0 || P <= 0 || h <= 0) {
    throw new Error('Prism base area (B), base perimeter (P), and height (h) must be positive numbers.');
  }

  const volume = cleanFloat(B * h);
  const lsa = cleanFloat(P * h);
  const tsa = cleanFloat(2 * B + lsa);

  const steps = [
    `General Prism: Base Area (B) = ${B}, Base Perimeter (P) = ${P}, Height (h) = ${h}`,
    `Volume Formula: V = B × h = ${B} × ${h} = ${volume} cubic units`,
    `Lateral Surface Area (LSA): P × h = ${P} × ${h} = ${lsa} square units`,
    `Total Surface Area (TSA): 2B + P × h = 2(${B}) + ${lsa} = ${tsa} square units`
  ];

  return { shape: 'General Prism (3D)', volume, lsa, tsa, steps };
}

export function calculateGeneralPyramid(baseAreaInput, basePerimeterInput, heightInput, slantHeightInput) {
  const B = parseFloat(baseAreaInput);
  const P = parseFloat(basePerimeterInput);
  const h = parseFloat(heightInput);
  const l = slantHeightInput ? parseFloat(slantHeightInput) : null;

  if (isNaN(B) || isNaN(h) || B <= 0 || h <= 0) {
    throw new Error('Pyramid base area (B) and height (h) must be positive numbers.');
  }

  const volume = cleanFloat((1 / 3) * B * h);
  const steps = [
    `General Pyramid: Base Area (B) = ${B}, Height (h) = ${h}`,
    `Volume Formula: V = ⅓ × B × h = ⅓ × ${B} × ${h} = ${volume} cubic units`
  ];

  let lsa = null;
  let tsa = null;
  if (P && l && !isNaN(P) && !isNaN(l) && P > 0 && l > 0) {
    lsa = cleanFloat(0.5 * P * l);
    tsa = cleanFloat(B + lsa);
    steps.push(`Base Perimeter (P) = ${P}, Slant Height (l) = ${l}`);
    steps.push(`Lateral Surface Area (LSA): ½ × P × l = ½ × ${P} × ${l} = ${lsa} square units`);
    steps.push(`Total Surface Area (TSA): B + LSA = ${B} + ${lsa} = ${tsa} square units`);
  }

  return { shape: 'General Pyramid (3D)', volume, lsa, tsa, steps };
}

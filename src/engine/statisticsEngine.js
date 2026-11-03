// Statistics Engine: Mean, Median, Mode, Range, Variance, Standard Deviation

import { cleanFloat } from './evaluator.js';

export function parseDataset(inputStr) {
  if (!inputStr || typeof inputStr !== 'string') return [];
  const parts = inputStr.split(/[\s,;]+/);
  const nums = [];
  for (const part of parts) {
    if (part.trim() !== '') {
      const val = parseFloat(part);
      if (isNaN(val)) {
        throw new Error(`Invalid number '${part}' in dataset`);
      }
      nums.push(val);
    }
  }
  return nums;
}

export function calculateStatistics(inputStr) {
  const nums = parseDataset(inputStr);

  if (nums.length === 0) {
    throw new Error('Please enter a dataset of numbers separated by commas or spaces.');
  }

  const n = nums.length;
  const sorted = [...nums].sort((a, b) => a - b);
  const steps = [];

  steps.push(`Dataset size (n) = ${n}`);
  steps.push(`Sorted Dataset: ${sorted.join(', ')}`);

  // 1. Mean
  const sum = cleanFloat(nums.reduce((acc, val) => acc + val, 0));
  const mean = cleanFloat(sum / n);
  const meanStep = `Sum = (${nums.join(' + ')}) = ${sum}\nMean (x̄) = Sum / n = ${sum} / ${n} = ${mean}`;
  steps.push(`--- Mean Calculation ---\n${meanStep}`);

  // 2. Median
  let median;
  let medianStep;
  if (n % 2 === 1) {
    const midIdx = Math.floor(n / 2);
    median = sorted[midIdx];
    medianStep = `Since n = ${n} is odd, Median is the middle value at position ${midIdx + 1}: ${median}`;
  } else {
    const mid1 = sorted[n / 2 - 1];
    const mid2 = sorted[n / 2];
    median = cleanFloat((mid1 + mid2) / 2);
    medianStep = `Since n = ${n} is even, Median is average of 2 middle values (${mid1} and ${mid2}): (${mid1} + ${mid2}) / 2 = ${median}`;
  }
  steps.push(`--- Median Calculation ---\n${medianStep}`);

  // 3. Mode
  const counts = {};
  let maxCount = 0;
  nums.forEach(num => {
    counts[num] = (counts[num] || 0) + 1;
    if (counts[num] > maxCount) maxCount = counts[num];
  });

  let modeResult, modeStep;
  if (maxCount === 1) {
    modeResult = 'No unique mode';
    modeStep = `All values occur with equal frequency (1 time). Therefore, there is no unique mode.`;
  } else {
    const modes = Object.keys(counts).filter(k => counts[k] === maxCount).map(Number);
    if (modes.length === Object.keys(counts).length) {
      modeResult = 'No unique mode';
      modeStep = `All unique numbers occur with the same frequency (${maxCount} times). Therefore, no single mode exists.`;
    } else if (modes.length === 1) {
      modeResult = modes[0];
      modeStep = `Mode = ${modes[0]} (occurs most frequently: ${maxCount} times).`;
    } else {
      modeResult = modes.join(', ');
      modeStep = `Multimodal dataset. Modes = ${modes.join(', ')} (each occurs ${maxCount} times).`;
    }
  }
  steps.push(`--- Mode Calculation ---\n${modeStep}`);

  // 4. Range
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = cleanFloat(max - min);
  steps.push(`--- Range Calculation ---\nRange = Maximum − Minimum = ${max} − ${min} = ${range}`);

  // 5. Population Variance and Standard Deviation
  const deviations = nums.map(x => `${x} - ${mean} = ${cleanFloat(x - mean)}`);
  const squaredDiffs = nums.map(x => cleanFloat(Math.pow(x - mean, 2)));
  const squaredDiffTerms = nums.map((x, i) => `(${x} - ${mean})² = (${cleanFloat(x - mean)})² = ${squaredDiffs[i]}`);
  const sumSquaredDiffs = cleanFloat(squaredDiffs.reduce((a, b) => a + b, 0));

  const popVariance = n > 0 ? cleanFloat(sumSquaredDiffs / n) : 0;
  const popStdDev = cleanFloat(Math.sqrt(popVariance));
  const sampleVariance = n > 1 ? cleanFloat(sumSquaredDiffs / (n - 1)) : 0;
  const sampleStdDev = cleanFloat(Math.sqrt(sampleVariance));

  let varStep = '';
  if (n > 1) {
    varStep = `1. Deviations from Mean (x - μ):\n   ${deviations.join('\n   ')}\n\n` +
      `2. Squared Deviations (x - μ)²:\n   ${squaredDiffTerms.join('\n   ')}\n\n` +
      `3. Sum of Squared Deviations Σ(x - μ)²:\n   ${squaredDiffs.join(' + ')} = ${sumSquaredDiffs}\n\n` +
      `4. Population Variance (σ²):\n   σ² = Σ(x - μ)² / N = ${sumSquaredDiffs} / ${n} = ${popVariance}\n\n` +
      `5. Population Standard Deviation (σ):\n   σ = √σ² = √${popVariance} ≈ ${popStdDev}`;
  } else {
    varStep = `Single-value dataset (N = 1):\nDeviations from mean = 0.\nPopulation Variance (σ²) = 0\nPopulation Standard Deviation (σ) = 0`;
  }

  steps.push(`--- Population Variance & Standard Deviation ---\n${varStep}`);

  return {
    count: n,
    min,
    max,
    sum,
    mean,
    median,
    mode: modeResult,
    range,
    sampleVariance,
    sampleStdDev,
    popVariance,
    popStdDev,
    steps,
  };
}

/**
 * Calculates statistics for Frequency Distribution Table (X, f)
 * X = observation / value
 * f = frequency of that X value
 * Total Frequency N = Σf
 * Mean = Σfx / Σf
 * Median = observation at position (N+1)/2 (odd N) or average of N/2 and (N/2+1) (even N) using Cumulative Frequency
 * Mode = X value(s) with highest frequency f
 * Range = Max X - Min X (for active f > 0)
 * Variance = Σ[f(x - μ)²] / N
 */
export function calculateFrequencyStatistics(tableRows) {
  if (!Array.isArray(tableRows) || tableRows.length === 0) {
    throw new Error('Please enter a valid frequency distribution table.');
  }

  const validPairs = [];

  for (let idx = 0; idx < tableRows.length; idx++) {
    const row = tableRows[idx];
    const xStr = row.x !== undefined && row.x !== null ? String(row.x).trim() : '';
    const fStr = row.f !== undefined && row.f !== null ? String(row.f).trim() : (row.y !== undefined && row.y !== null ? String(row.y).trim() : '');

    // Ignore completely empty rows
    if (xStr === '' && fStr === '') continue;

    if (xStr === '' || fStr === '') {
      throw new Error(`Row ${idx + 1} has incomplete data. Please enter both X value and frequency f.`);
    }

    const xVal = parseFloat(xStr);
    const fVal = parseFloat(fStr);

    if (isNaN(xVal)) {
      throw new Error(`Invalid X value '${xStr}' in row ${idx + 1}.`);
    }
    if (isNaN(fVal)) {
      throw new Error(`Invalid frequency f '${fStr}' in row ${idx + 1}.`);
    }
    if (fVal < 0) {
      throw new Error(`Frequency f cannot be negative (found '${fVal}' in row ${idx + 1}).`);
    }

    validPairs.push({ x: xVal, f: fVal, origIdx: idx + 1 });
  }

  if (validPairs.length === 0) {
    throw new Error('Please enter valid X values and non-negative frequencies (f) in the table.');
  }

  // 1. Sort by X ascending for mathematical operations
  const sortedPairs = [...validPairs].sort((a, b) => a.x - b.x);

  // 2. Total Frequency N = Σf
  const n = cleanFloat(sortedPairs.reduce((acc, p) => acc + p.f, 0));
  if (n <= 0) {
    throw new Error('Total frequency N (Σf) must be greater than 0.');
  }

  // 3. Mean (μ) = Σfx / N
  const sumFx = cleanFloat(sortedPairs.reduce((acc, p) => acc + (p.x * p.f), 0));
  const mean = cleanFloat(sumFx / n);

  // 4. Median using Cumulative Frequencies (CF)
  let currentCF = 0;
  const cfList = sortedPairs.map(p => {
    currentCF = cleanFloat(currentCF + p.f);
    return { x: p.x, f: p.f, cf: currentCF };
  });

  let median;
  let medianStep;
  if (n % 2 === 1) {
    const targetPos = (n + 1) / 2;
    const item = cfList.find(item => item.cf >= targetPos);
    median = item.x;
    medianStep = `Total frequency N = ${n} is odd.\nMedian position = (N + 1) / 2 = (${n} + 1) / 2 = ${targetPos}th observation.\nThe observation at position ${targetPos} corresponds to X = ${median}.`;
  } else {
    const pos1 = n / 2;
    const pos2 = (n / 2) + 1;
    const item1 = cfList.find(item => item.cf >= pos1);
    const item2 = cfList.find(item => item.cf >= pos2);
    const x1 = item1.x;
    const x2 = item2.x;
    median = cleanFloat((x1 + x2) / 2);
    medianStep = `Total frequency N = ${n} is even.\nMedian positions = N / 2 = ${pos1}th and (N / 2 + 1) = ${pos2}th observations.\nObservation at ${pos1}th position = ${x1}, observation at ${pos2}th position = ${x2}.\nMedian = (${x1} + ${x2}) / 2 = ${median}.`;
  }

  // 5. Mode = X value(s) with highest frequency f
  let maxF = 0;
  sortedPairs.forEach(p => {
    if (p.f > maxF) maxF = p.f;
  });

  let modeResult, modeStep;
  if (maxF === 0) {
    modeResult = 'No unique mode';
    modeStep = 'All frequencies are 0.';
  } else {
    const modalPairs = sortedPairs.filter(p => p.f === maxF);
    if (modalPairs.length === sortedPairs.length && sortedPairs.length > 1) {
      modeResult = 'No unique mode';
      modeStep = `All X values have the same frequency (f = ${maxF}). Therefore, no unique mode exists.`;
    } else if (modalPairs.length === 1) {
      modeResult = modalPairs[0].x;
      modeStep = `Mode = ${modalPairs[0].x} (highest frequency f = ${maxF}).`;
    } else {
      const modeXVals = modalPairs.map(p => p.x);
      modeResult = modeXVals.join(', ');
      modeStep = `Multimodal distribution. Modes = ${modeXVals.join(', ')} (each with highest frequency f = ${maxF}).`;
    }
  }

  // 6. Range = Max X - Min X (for rows with f > 0)
  const activePairs = sortedPairs.filter(p => p.f > 0);
  const minX = activePairs.length > 0 ? activePairs[0].x : sortedPairs[0].x;
  const maxX = activePairs.length > 0 ? activePairs[activePairs.length - 1].x : sortedPairs[sortedPairs.length - 1].x;
  const range = cleanFloat(maxX - minX);

  // 7. Frequency-Weighted Variance & Standard Deviation
  const fDeviationsSq = sortedPairs.map(p => {
    const diff = cleanFloat(p.x - mean);
    const diffSq = cleanFloat(diff * diff);
    const term = cleanFloat(p.f * diffSq);
    return { x: p.x, f: p.f, diff, diffSq, term };
  });

  const sumFDeviationsSq = cleanFloat(fDeviationsSq.reduce((acc, item) => acc + item.term, 0));
  const popVariance = cleanFloat(sumFDeviationsSq / n);
  const popStdDev = cleanFloat(Math.sqrt(popVariance));
  const sampleVariance = n > 1 ? cleanFloat(sumFDeviationsSq / (n - 1)) : 0;
  const sampleStdDev = cleanFloat(Math.sqrt(sampleVariance));

  // Build Step-by-Step Explanations
  const steps = [];
  steps.push(`Frequency Distribution (sorted by X):\n  ${sortedPairs.map(p => `X = ${p.x}, f = ${p.f}`).join('\n  ')}`);
  steps.push(`Total Frequency N (Σf) = ${sortedPairs.map(p => p.f).join(' + ')} = ${n}`);
  steps.push(`Sum of Weighted Observations Σfx = (${sortedPairs.map(p => `${p.x}×${p.f}`).join(' + ')}) = ${sumFx}`);
  steps.push(`--- Mean Calculation ---\nMean (μ) = Σfx / N = ${sumFx} / ${n} = ${mean}`);

  const cfTableStr = cfList.map(item => `X = ${item.x}, f = ${item.f} ──► Cumulative Frequency = ${item.cf}`).join('\n  ');
  steps.push(`--- Median Calculation ---\nCumulative Frequencies:\n  ${cfTableStr}\n\n${medianStep}`);

  steps.push(`--- Mode Calculation ---\n${modeStep}`);
  steps.push(`--- Range Calculation ---\nRange = Maximum X − Minimum X = ${maxX} − ${minX} = ${range}`);

  const devDetails = fDeviationsSq.map(item =>
    `X = ${item.x} (f = ${item.f}): f × (x − μ)² = ${item.f} × (${item.x} − ${mean})² = ${item.f} × ${item.diffSq} = ${item.term}`
  ).join('\n  ');

  steps.push(`--- Variance & Standard Deviation ---\n` +
    `1. Frequency-weighted squared deviations f(x − μ)²:\n  ${devDetails}\n\n` +
    `2. Sum of Weighted Squared Deviations Σ[f(x − μ)²] = ${sumFDeviationsSq}\n\n` +
    `3. Population Variance (σ²) = Σ[f(x − μ)²] / N = ${sumFDeviationsSq} / ${n} = ${popVariance}\n` +
    `4. Population Standard Deviation (σ) = √σ² = √${popVariance} ≈ ${popStdDev}\n` +
    (n > 1
      ? `5. Sample Variance (s²) = Σ[f(x − μ)²] / (N − 1) = ${sumFDeviationsSq} / ${n - 1} = ${sampleVariance}\n` +
        `6. Sample Standard Deviation (s) = √s² = √${sampleVariance} ≈ ${sampleStdDev}`
      : `Single observation / N = 1 (Sample Variance = 0)`)
  );

  return {
    count: n,
    sumFx,
    min: minX,
    max: maxX,
    mean,
    median,
    mode: modeResult,
    range,
    popVariance,
    popStdDev,
    sampleVariance,
    sampleStdDev,
    steps
  };
}


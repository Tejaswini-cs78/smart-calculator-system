// Multi-category Unit Conversion Engine

import { cleanFloat } from './evaluator.js';

export const CONVERSION_CATEGORIES = {
  length: {
    name: 'Length',
    base: 'm',
    units: {
      mm: { name: 'Millimeter (mm)', factor: 0.001 },
      cm: { name: 'Centimeter (cm)', factor: 0.01 },
      m: { name: 'Meter (m)', factor: 1 },
      km: { name: 'Kilometer (km)', factor: 1000 },
      in: { name: 'Inch (in)', factor: 0.0254 },
      ft: { name: 'Foot (ft)', factor: 0.3048 },
      yd: { name: 'Yard (yd)', factor: 0.9144 },
      mi: { name: 'Mile (mi)', factor: 1609.344 }
    }
  },
  mass: {
    name: 'Weight / Mass',
    base: 'kg',
    units: {
      mg: { name: 'Milligram (mg)', factor: 0.000001 },
      g: { name: 'Gram (g)', factor: 0.001 },
      kg: { name: 'Kilogram (kg)', factor: 1 },
      oz: { name: 'Ounce (oz)', factor: 0.028349523125 },
      lb: { name: 'Pound (lb)', factor: 0.45359237 },
      ton: { name: 'Metric Ton (t)', factor: 1000 }
    }
  },
  temperature: {
    name: 'Temperature',
    units: {
      C: { name: 'Celsius (°C)' },
      F: { name: 'Fahrenheit (°F)' },
      K: { name: 'Kelvin (K)' }
    }
  },
  time: {
    name: 'Time',
    base: 's',
    units: {
      ms: { name: 'Millisecond (ms)', factor: 0.001 },
      s: { name: 'Second (s)', factor: 1 },
      min: { name: 'Minute (min)', factor: 60 },
      hr: { name: 'Hour (hr)', factor: 3600 },
      day: { name: 'Day (d)', factor: 86400 },
      week: { name: 'Week (wk)', factor: 604800 },
      year: { name: 'Year (yr)', factor: 31536000 }
    }
  },
  area: {
    name: 'Area',
    base: 'sq_m',
    units: {
      sq_cm: { name: 'Square Centimeter (cm²)', factor: 0.0001 },
      sq_m: { name: 'Square Meter (m²)', factor: 1 },
      sq_km: { name: 'Square Kilometer (km²)', factor: 1000000 },
      sq_ft: { name: 'Square Foot (ft²)', factor: 0.09290304 },
      acre: { name: 'Acre', factor: 4046.8564224 },
      hectare: { name: 'Hectare (ha)', factor: 10000 }
    }
  },
  digital: {
    name: 'Digital Storage',
    base: 'B',
    units: {
      B: { name: 'Byte (B)', factor: 1 },
      KB: { name: 'Kilobyte (KB)', factor: 1024 },
      MB: { name: 'Megabyte (MB)', factor: 1048576 },
      GB: { name: 'Gigabyte (GB)', factor: 1073741824 },
      TB: { name: 'Terabyte (TB)', factor: 1099511627776 }
    }
  },
  currency: {
    name: 'Currency',
    base: 'USD',
    units: {
      INR: { name: 'Indian Rupee (₹)', symbol: '₹', factor: 83.5 },
      USD: { name: 'US Dollar ($)', symbol: '$', factor: 1 },
      EUR: { name: 'Euro (€)', symbol: '€', factor: 0.92 },
      GBP: { name: 'British Pound (£)', symbol: '£', factor: 0.79 },
      JPY: { name: 'Japanese Yen (¥)', symbol: '¥', factor: 155.0 },
      AUD: { name: 'Australian Dollar (A$)', symbol: 'A$', factor: 1.50 },
      CAD: { name: 'Canadian Dollar (C$)', symbol: 'C$', factor: 1.36 },
      CHF: { name: 'Swiss Franc (CHF)', symbol: 'CHF', factor: 0.90 },
      CNY: { name: 'Chinese Yuan (¥)', symbol: '¥', factor: 7.23 },
      SGD: { name: 'Singapore Dollar (S$)', symbol: 'S$', factor: 1.35 },
      AED: { name: 'UAE Dirham (د.إ)', symbol: 'د.إ', factor: 3.67 },
      SAR: { name: 'Saudi Riyal (﷼)', symbol: '﷼', factor: 3.75 },
      NZD: { name: 'New Zealand Dollar (NZ$)', symbol: 'NZ$', factor: 1.63 },
      KRW: { name: 'South Korean Won (₩)', symbol: '₩', factor: 1370.0 }
    }
  }
};

export const SUPPORTED_CURRENCIES = Object.keys(CONVERSION_CATEGORIES.currency.units);

export function convertCurrency(amount, from, to) {
  return convertUnits('currency', from, to, amount);
}


export async function fetchLiveExchangeRates() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) return false;
    const data = await res.json();
    if (data && data.rates && CONVERSION_CATEGORIES.currency) {
      Object.keys(CONVERSION_CATEGORIES.currency.units).forEach(code => {
        if (data.rates[code]) {
          CONVERSION_CATEGORIES.currency.units[code].factor = data.rates[code];
        }
      });
      return true;
    }
  } catch {
    // Fallback to reference rate factors
  }
  return false;
}

export function convertUnits(categoryKey, fromUnit, toUnit, valueInput) {
  const value = parseFloat(valueInput);
  if (isNaN(value)) throw new Error('Please enter a valid numeric value to convert.');

  const category = CONVERSION_CATEGORIES[categoryKey];
  if (!category) throw new Error(`Unknown conversion category '${categoryKey}'.`);

  const steps = [];

  // Special handling for Currency
  if (categoryKey === 'currency') {
    const uFrom = category.units[fromUnit];
    const uTo = category.units[toUnit];
    if (!uFrom || !uTo) throw new Error(`Unsupported currency code selection.`);

    const baseInUSD = value / uFrom.factor;
    const resultVal = baseInUSD * uTo.factor;
    const cleanedResult = cleanFloat(resultVal);

    steps.push(`Converting ${value} ${uFrom.name} [${fromUnit}] to ${uTo.name} [${toUnit}]`);
    steps.push(`Step 1: Convert input to base currency (USD): ${value} / ${uFrom.factor} = ${cleanFloat(baseInUSD)} USD`);
    steps.push(`Step 2: Convert USD to target currency (${toUnit}): ${cleanFloat(baseInUSD)} × ${uTo.factor} = ${cleanedResult} ${uTo.symbol}`);
    steps.push(`Result: ${uFrom.symbol}${value} (${fromUnit}) = ${uTo.symbol}${cleanedResult} (${toUnit})`);

    return {
      category: category.name,
      fromValue: value,
      fromUnit,
      toUnit,
      fromSymbol: uFrom.symbol,
      toSymbol: uTo.symbol,
      result: `${uTo.symbol}${cleanedResult}`,
      rawResult: cleanedResult,
      steps
    };
  }

  // Special handling for Temperature formulas
  if (categoryKey === 'temperature') {
    let resultVal;
    if (fromUnit === toUnit) {
      resultVal = value;
      steps.push(`${value} ${fromUnit} = ${value} ${toUnit}`);
    } else if (fromUnit === 'C' && toUnit === 'F') {
      resultVal = (value * 9 / 5) + 32;
      steps.push(`Formula: °F = (°C × 9/5) + 32`);
      steps.push(`Calculation: (${value} × 9/5) + 32 = ${value * 1.8} + 32 = ${resultVal}`);
    } else if (fromUnit === 'F' && toUnit === 'C') {
      resultVal = (value - 32) * 5 / 9;
      steps.push(`Formula: °C = (°F − 32) × 5/9`);
      steps.push(`Calculation: (${value} − 32) × 5/9 = ${value - 32} × 5/9 = ${resultVal}`);
    } else if (fromUnit === 'C' && toUnit === 'K') {
      resultVal = value + 273.15;
      steps.push(`Formula: K = °C + 273.15`);
      steps.push(`Calculation: ${value} + 273.15 = ${resultVal}`);
    } else if (fromUnit === 'K' && toUnit === 'C') {
      resultVal = value - 273.15;
      steps.push(`Formula: °C = K − 273.15`);
      steps.push(`Calculation: ${value} − 273.15 = ${resultVal}`);
    } else if (fromUnit === 'F' && toUnit === 'K') {
      const cVal = (value - 32) * 5 / 9;
      resultVal = cVal + 273.15;
      steps.push(`Step 1: Convert °F to °C: (${value} − 32) × 5/9 = ${cVal} °C`);
      steps.push(`Step 2: Convert °C to K: ${cVal} + 273.15 = ${resultVal} K`);
    } else if (fromUnit === 'K' && toUnit === 'F') {
      const cVal = value - 273.15;
      resultVal = (cVal * 9 / 5) + 32;
      steps.push(`Step 1: Convert K to °C: ${value} − 273.15 = ${cVal} °C`);
      steps.push(`Step 2: Convert °C to °F: (${cVal} × 9/5) + 32 = ${resultVal} °F`);
    }

    const cleanedResult = cleanFloat(resultVal);
    return {
      category: category.name,
      fromValue: value,
      fromUnit,
      toUnit,
      result: cleanedResult,
      steps
    };
  }

  // Ratio-based conversion for other categories
  const uFrom = category.units[fromUnit];
  const uTo = category.units[toUnit];

  if (!uFrom || !uTo) {
    throw new Error(`Invalid unit pair selected for ${category.name}`);
  }

  const baseValue = value * uFrom.factor;
  const resultVal = baseValue / uTo.factor;
  const cleanedResult = cleanFloat(resultVal);

  steps.push(`Converting ${value} ${uFrom.name} to ${uTo.name}`);
  steps.push(`Step 1: Convert to base unit (${category.base}): ${value} × ${uFrom.factor} = ${baseValue} ${category.base}`);
  steps.push(`Step 2: Convert base unit to target unit: ${baseValue} / ${uTo.factor} = ${cleanedResult}`);
  steps.push(`Result: ${value} ${fromUnit} = ${cleanedResult} ${toUnit}`);

  return {
    category: category.name,
    fromValue: value,
    fromUnit,
    toUnit,
    result: cleanedResult,
    steps
  };
}

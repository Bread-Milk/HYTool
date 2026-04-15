import { useState } from 'react';
import { Calculator, ArrowRightLeft, RefreshCcw } from 'lucide-react';

const units = {
  length: {
    name: '长度',
    base: 'm', // 基准单位：米
    conversions: {
      m: { name: '米 (m)', rate: 1 },
      km: { name: '千米 (km)', rate: 1000 },
      cm: { name: '厘米 (cm)', rate: 0.01 },
      mm: { name: '毫米 (mm)', rate: 0.001 },
      inch: { name: '英寸 (in)', rate: 0.0254 },
      foot: { name: '英尺 (ft)', rate: 0.3048 },
      yard: { name: '码 (yd)', rate: 0.9144 },
      mile: { name: '英里 (mi)', rate: 1609.344 },
    }
  },
  weight: {
    name: '重量',
    base: 'kg', // 基准单位：千克
    conversions: {
      kg: { name: '千克 (kg)', rate: 1 },
      g: { name: '克 (g)', rate: 0.001 },
      mg: { name: '毫克 (mg)', rate: 0.000001 },
      t: { name: '吨 (t)', rate: 1000 },
      lb: { name: '磅 (lb)', rate: 0.45359237 },
      oz: { name: '盎司 (oz)', rate: 0.0283495231 },
      jin: { name: '市斤', rate: 0.5 },
    }
  },
  temperature: {
    name: '温度',
    base: 'c', // 温度需要特殊处理函数
    conversions: {
      c: { name: '摄氏度 (°C)', rate: 1 },
      f: { name: '华氏度 (°F)', rate: 1 },
      k: { name: '开尔文 (K)', rate: 1 },
    }
  }
};

export default function UnitConverter() {
  const [category, setCategory] = useState<keyof typeof units>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('cm');
  const [value, setValue] = useState<string>('1');

  const handleCategoryChange = (cat: keyof typeof units) => {
    setCategory(cat);
    const firstUnit = Object.keys(units[cat].conversions)[0];
    const secondUnit = Object.keys(units[cat].conversions)[1] || firstUnit;
    setFromUnit(firstUnit);
    setToUnit(secondUnit);
  };

  const calculateResult = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';

    // 特殊处理温度
    if (category === 'temperature') {
      let cValue = numValue; // 先全部转为摄氏度
      if (fromUnit === 'f') cValue = (numValue - 32) * 5 / 9;
      else if (fromUnit === 'k') cValue = numValue - 273.15;

      let result = cValue; // 从摄氏度转为目标
      if (toUnit === 'f') result = cValue * 9 / 5 + 32;
      else if (toUnit === 'k') result = cValue + 273.15;
      
      return parseFloat(result.toFixed(6)).toString();
    }

    const conversions = units[category].conversions as Record<string, { rate: number }>;
    const fromRate = conversions[fromUnit]?.rate;
    const toRate = conversions[toUnit]?.rate;
    if (fromRate == null || toRate == null) return '';
    
    const result = (numValue * fromRate) / toRate;
    return parseFloat(result.toFixed(6)).toString();
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto h-full">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          <Calculator className="w-8 h-8 text-amber-500" />
          单位换算
        </h1>
        <p className="text-zinc-500 mt-2">支持长度、重量、温度等常用物理单位的精确换算。</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-10 shadow-sm">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          {(Object.keys(units) as Array<keyof typeof units>).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                category === cat 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {units[cat].name}
            </button>
          ))}
        </div>

        {/* Converter Area */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* From */}
          <div className="flex-1 w-full space-y-4">
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl px-4 py-4 text-base font-medium focus:ring-2 focus:ring-amber-500 outline-none text-zinc-900 dark:text-zinc-100"
            >
              {Object.entries(units[category].conversions).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
              ))}
            </select>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="输入数值..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-8 text-4xl font-black focus:ring-2 focus:ring-amber-500 outline-none text-zinc-900 dark:text-zinc-100 transition-shadow"
            />
          </div>

          {/* Swap Button */}
          <div className="flex-shrink-0">
            <button
              onClick={swapUnits}
              className="p-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-zinc-500 hover:text-amber-500 rounded-full transition-all md:rotate-0 rotate-90"
              title="互换单位"
            >
              <ArrowRightLeft className="w-6 h-6" />
            </button>
          </div>

          {/* To */}
          <div className="flex-1 w-full space-y-4">
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl px-4 py-4 text-base font-medium focus:ring-2 focus:ring-amber-500 outline-none text-zinc-900 dark:text-zinc-100"
            >
              {Object.entries(units[category].conversions).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
              ))}
            </select>
            <div className="w-full bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl px-6 py-8 text-4xl font-black text-amber-600 dark:text-amber-500 overflow-x-auto whitespace-nowrap">
              {calculateResult() || '0'}
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
           <button
            onClick={() => setValue('1')}
            className="flex items-center gap-2 px-6 py-2.5 text-zinc-500 hover:text-amber-500 bg-zinc-50 dark:bg-zinc-800/50 rounded-full text-sm font-medium transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            重置数值为 1
          </button>
        </div>
      </div>
    </div>
  );
}

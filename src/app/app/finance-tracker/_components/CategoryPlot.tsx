import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from 'recharts';
import { useFinanceTrackerContext } from '../_contexts/financeTrackerContext';
import { getColorByWord, splitInThousand } from '@/utils/miscelaneous';

const PlotTypes = {
  // LINE: 'Line',
  BAR: 'Bar',
  PIE: 'Pie',
  // AREA: 'Area',
  POLAR: 'Polar'
};

interface ICategoryTotals {
  categoryTotals: {
    debit: Record<string, number>;
    credit: Record<string, number>;
  }
}

const CategoryPlot: React.FC<ICategoryTotals> = ({ categoryTotals }) => {
  // const { categoryTotals } = useFinanceTrackerContext();
  const [plotType, setPlotType] = useState<string>(PlotTypes.BAR);

  const formatData = (totals: Record<string, number>) => {
    return Object.entries(totals).map(([category, total]) => ({ category, total }));
  };

  const debitData = formatData(categoryTotals.debit);
  const creditData = formatData(categoryTotals.credit);

  const renderLegend = (props: any) => {
    const { payload } = props;
    const totalSum = payload.reduce((sum: number, entry: any) => sum + entry.payload.total, 0);

    return (
      <ul className='flex flex-row items-center flex-wrap gap-2'>
        {payload.map((entry: any, index: number) => {
          const { category, total } = entry.payload;
          const { color } = getColorByWord(category);
          const percentage = (total / totalSum) * 100;
          return (
            <li key={`item-${index}`} style={{ color }} className='line-in !gap-1 text-sm font-medium'>
              <div style={{ backgroundColor: color }} className='h-4 w-4 rounded' />
              {`${category}: ${splitInThousand(total?.toFixed(2))} (${percentage?.toFixed(2)}%)`}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderPlot = (data: any[], title: string) => {
    switch (plotType) {
      // case PlotTypes.LINE:
      //   return (
      //     <LineChart data={data}>
      //       <CartesianGrid strokeDasharray="3 3" />
      //       <XAxis dataKey="category" />
      //       <YAxis />
      //       <Tooltip />
      //       <Legend />
      //       <Line type="monotone" dataKey="total" stroke="#8884d8" />
      //     </LineChart>
      //   );
      case PlotTypes.BAR:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" className='[&_*]:!text-xs' />
            <YAxis className='[&_*]:!text-sm [&_*]:max-md:!text-xs' />
            <Tooltip />
            <Legend  />
            <Bar dataKey="total">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorByWord(entry.category).color} />
              ))}
            </Bar>
          </BarChart>
        );
      case PlotTypes.PIE:
        return (
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorByWord(entry.category).color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend content={renderLegend} />
          </PieChart>
        );
      // case PlotTypes.AREA:
      //   return (
      //     <AreaChart data={data}>
      //       <CartesianGrid strokeDasharray="3 3" />
      //       <XAxis dataKey="category" />
      //       <YAxis />
      //       <Tooltip />
      //       <Legend />
      //       <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
      //     </AreaChart>
      //   );
        case PlotTypes.POLAR:
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis />
            <Tooltip />
            <Radar name={title} dataKey="total" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          </RadarChart>
        );
      default:
        return null;
    }
  };

  return (
    <details>
      <summary className='noExport cursor-pointer'>Analytics</summary>
      <div className='mt-4'>
      <h2>Debit Categories</h2>
      <ResponsiveContainer width="100%" height={400}>
        {renderPlot(debitData, 'Debit Categories') as any}
      </ResponsiveContainer>

      <h2>Credit Categories</h2>
      <ResponsiveContainer width="100%" height={400}>
        {renderPlot(creditData, 'Credit Categories') as any}
      </ResponsiveContainer>

      <div>
        <label>Plot Type: </label>
        <select value={plotType} onChange={(e) => setPlotType(e.target.value)}>
          {Object.values(PlotTypes).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    </div>
    </details>
  );
};

export default CategoryPlot;
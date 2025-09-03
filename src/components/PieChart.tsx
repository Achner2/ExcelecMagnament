import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ResponseDistribution } from './types';

interface PieChartProps {
  data: ResponseDistribution;
}

const COLORS = {
  http200: '#22c55e',
  http4xx: '#fbbf24', 
  http5xx: '#ef4444',
  timeout: '#6b7280',
};

const LABELS = {
  http200: 'HTTP 200',
  http4xx: 'HTTP 4xx',
  http5xx: 'HTTP 5xx', 
  timeout: 'Timeout',
};

export function PieChart({ data }: PieChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: LABELS[key as keyof typeof LABELS],
    value: value,
    color: COLORS[key as keyof typeof COLORS],
  }));

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  return (
    <div className="flex items-center space-x-4">
      <div className="w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const percentage = ((data.value / total) * 100).toFixed(1);
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-medium">{data.name}</p>
                      <p>{`Cantidad: ${data.value.toLocaleString()}`}</p>
                      <p>{`Porcentaje: ${percentage}%`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-2">
        {chartData.map((entry) => {
          const percentage = ((entry.value / total) * 100).toFixed(1);
          return (
            <div key={entry.name} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{entry.name}</span>
                  <span className="text-sm text-muted-foreground">{percentage}%</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {entry.value.toLocaleString()} requests
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total</span>
            <span className="font-medium">{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
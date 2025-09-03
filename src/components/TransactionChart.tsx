import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { TransactionData } from './types';

interface TransactionChartProps {
  data: TransactionData[];
}

export function TransactionChart({ data }: TransactionChartProps) {
  const chartData = data.map(item => ({
    ...item,
    time: new Date(item.timestamp).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    total: item.successful + item.failed,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSuccessful" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-medium">{`Hora: ${label}`}</p>
                    <p className="text-green-600">
                      {`Exitosas: ${payload[0]?.value?.toLocaleString()}`}
                    </p>
                    <p className="text-red-600">
                      {`Fallidas: ${payload[1]?.value?.toLocaleString()}`}
                    </p>
                    <p className="font-medium">
                      {`Total: ${((payload[0]?.value || 0) + (payload[1]?.value || 0)).toLocaleString()}`}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="successful"
            stackId="1"
            stroke="#22c55e"
            fill="url(#colorSuccessful)"
            name="Exitosas"
          />
          <Area
            type="monotone"
            dataKey="failed"
            stackId="1"
            stroke="#ef4444"
            fill="url(#colorFailed)"
            name="Fallidas"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export function ChartRevenue({ data }: { data: RevenueDataPoint[] }) {
  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm cursor-pointer transition-shadow duration-300 hover:shadow-lg">
      <h3 className="mb-4 text-lg font-semibold">Revenue (Last 30 Days)</h3>
      {data.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">No revenue data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: string) => {
                const d = new Date(val);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: number) => `$${val}`}
            />
            <Tooltip
              formatter={(value: number) => [`$${(value || 0).toFixed(2)}`, 'Revenue']}
              labelFormatter={(label: string) => new Date(label).toLocaleDateString()}
            />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

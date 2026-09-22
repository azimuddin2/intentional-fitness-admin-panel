'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetUserOverviewChartQuery } from '@/src/redux/features/dashboard/dashboardApi';
import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const UserOverviewChart = () => {
  const currentYear = new Date().getFullYear();
  const numberOfYears = 5;
  const yearOptions = Array.from(
    { length: numberOfYears },
    (_, i) => currentYear - i,
  );

  const [year, setYear] = useState(String(currentYear));

  // Fetch data from API
  const {
    data: chartData,
    isLoading,
    isError,
  } = useGetUserOverviewChartQuery({ year: Number(year) });

  // Transform API data into chart-friendly format
  const formattedData =
    chartData?.data?.data?.map((item: any) => ({
      name: item.month,
      uv: item.users,
    })) || [];

  const maxY = Math.max(...formattedData.map((d: any) => d.uv), 10);

  return (
    <Card className="w-full border-none shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-xl font-medium text-[#333333]">
          User Overview
        </CardTitle>
        <Select
          value={year}
          onValueChange={(value) => {
            if (value) setYear(value);
          }}
        >
          <SelectTrigger className="py-5">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <div style={{ width: '100%', height: 400 }}>
        {isLoading ? (
          <p className="text-center mt-20 text-gray-500">Loading chart...</p>
        ) : isError ? (
          <p className="text-center mt-20 text-red-500">Error loading data</p>
        ) : formattedData.length === 0 ? (
          <p className="text-center mt-20 text-gray-500">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0E3B47" stopOpacity={1} />
                  <stop offset="100%" stopColor="#0E3B47" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#0E3B47' }}
              />
              <YAxis
                domain={[0, maxY]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#0E3B47' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #0E3B47',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="uv"
                stroke="#0E3B47"
                strokeWidth={2}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default UserOverviewChart;

'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetTrainerOverviewChartQuery } from '@/src/redux/features/dashboard/dashboardApi';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const TrainerOverviewChart = () => {
  const currentYear = new Date().getFullYear();
  const numberOfYears = 5;
  const yearOptions = Array.from(
    { length: numberOfYears },
    (_, i) => currentYear - i,
  );

  const [year, setYear] = useState(String(currentYear));

  const {
    data: apiData,
    isLoading,
    isError,
  } = useGetTrainerOverviewChartQuery({ year: Number(year) });

  // Backend field naam "users" — eta actually trainer count
  const chartData =
    apiData?.data?.data?.map((item: any) => ({
      month: item.month,
      value: item.users,
    })) || [];

  return (
    <Card className="w-full border-none shadow">
      <CardHeader className="lg:flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-xl font-medium text-ns-title text-[#333333]">
          Trainer Overview
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

      <div style={{ height: 400, width: '100%' }}>
        {isLoading ? (
          <p className="text-center mt-20 text-gray-500">Loading chart...</p>
        ) : isError ? (
          <p className="text-center mt-20 text-red-500">
            Error loading chart data
          </p>
        ) : chartData.length === 0 ? (
          <p className="text-center mt-20 text-gray-500">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0E3B47" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0E3B47" stopOpacity={1} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                domain={[0, Math.max(...chartData.map((d: any) => d.value), 5)]}
              />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar
                dataKey="value"
                fill="url(#barGradient)"
                radius={[100, 100, 0, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default TrainerOverviewChart;

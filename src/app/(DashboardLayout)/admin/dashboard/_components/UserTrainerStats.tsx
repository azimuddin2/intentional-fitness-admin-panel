'use client';

import { useState } from 'react';
import CountUp from 'react-countup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useGetTotalTrainersQuery,
  useGetTotalUsersQuery,
} from '@/src/redux/features/dashboard/dashboardApi';
import { Dumbbell, LucideIcon, Users } from 'lucide-react';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const formatCount = (value: number) => {
  const n = Math.round(value);
  return n < 10 ? String(n).padStart(2, '0') : n.toLocaleString('en-US');
};

type MonthSelectProps = {
  value: number;
  onChange: (month: number) => void;
};

const MonthSelect = ({ value, onChange }: MonthSelectProps) => (
  <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
    <SelectTrigger
      aria-label="Select month"
      className="h-8 w-auto gap-2 rounded-full border-none bg-[#0E3B47] py-0 pl-3 pr-1 text-xs font-normal text-white shadow-none focus:ring-0 [&>svg]:size-6 [&>svg]:rounded-full [&>svg]:bg-white [&>svg]:p-1 [&>svg]:text-[#0E3B47] [&>svg]:opacity-100"
    >
      <SelectValue>{MONTHS[value - 1]}</SelectValue>
    </SelectTrigger>
    <SelectContent align="end">
      {MONTHS.map((name, index) => (
        <SelectItem key={name} value={String(index + 1)}>
          {name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

type CountCardProps = {
  title: string;
  icon: LucideIcon;
  count: number;
  month: number;
  onMonthChange: (month: number) => void;
  isLoading?: boolean;
  isError?: boolean;
};

const CountCard = ({
  title,
  icon: Icon,
  count,
  month,
  onMonthChange,
  isLoading,
  isError,
}: CountCardProps) => (
  <Card className="border-none shadow">
    <CardHeader>
      <CardTitle className="flex items-center justify-between text-lg font-medium text-ns-neutral-dark">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-[#0E3B47]" />
          {title}
        </div>
        <MonthSelect value={month} onChange={onMonthChange} />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <h2 className="text-3xl font-semibold text-ns-title">
        {isLoading ? (
          <span className="text-[#7F7F7F]">...</span>
        ) : isError ? (
          <span className="text-base font-medium text-[#5F1011]">
            Failed to load
          </span>
        ) : (
          <CountUp end={count} duration={1.5} formattingFn={formatCount} />
        )}
      </h2>
    </CardContent>
  </Card>
);

// ---------- Main component ----------
const UserTrainerStats = () => {
  const currentMonth = new Date().getMonth() + 1;

  const [userMonth, setUserMonth] = useState(currentMonth);
  const [trainerMonth, setTrainerMonth] = useState(currentMonth);

  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useGetTotalUsersQuery({ month: userMonth });

  const {
    data: trainersData,
    isLoading: isTrainersLoading,
    isError: isTrainersError,
  } = useGetTotalTrainersQuery({ month: trainerMonth });

  const totalUsers = usersData?.data?.totalUsers ?? 0;
  const totalTrainers = trainersData?.data?.totalTrainers ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 font-sora md:grid-cols-2">
      <CountCard
        title="Total User"
        icon={Users}
        count={totalUsers}
        month={userMonth}
        onMonthChange={setUserMonth}
        isLoading={isUsersLoading}
        isError={isUsersError}
      />

      <CountCard
        title="Total Trainer"
        icon={Dumbbell}
        count={totalTrainers}
        month={trainerMonth}
        onMonthChange={setTrainerMonth}
        isLoading={isTrainersLoading}
        isError={isTrainersError}
      />
    </div>
  );
};

export default UserTrainerStats;

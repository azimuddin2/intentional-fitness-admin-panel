import TrainerOverviewChart from './TrainerOverviewChart';
import UserOverviewChart from './UserOverviewChart';
import UserTrainerStats from './UserTrainerStats';

const Dashboard = () => {
  return (
    <div>
      <UserTrainerStats />
      <div className="my-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <UserOverviewChart />
        <TrainerOverviewChart />
      </div>
    </div>
  );
};

export default Dashboard;

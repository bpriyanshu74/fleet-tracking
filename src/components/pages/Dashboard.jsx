import { useState } from "react";
import { useRealTimeDataContext } from "../../context/RealTimeDataContext";
import TripList from "../dashboard/TripList";

import MetricsOverview from "../dashboard/MetricsOverview";
import Topbar from "../common/Topbar";

const Dashboard = () => {
  const { tripsByStatus } = useRealTimeDataContext();

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gray-50">
        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Metrics Overview */}
            <MetricsOverview />

            {/* Trip Lists */}
            <div className="mt-8">
              <TripList tripsByStatus={tripsByStatus} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;

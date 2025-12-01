// TripList.jsx
import { useState } from "react";
import { useRealTimeDataContext } from "../../context/RealTimeDataContext";

// Child components
import TripSection from "./TripListComponents/TripSection";

const TripList = () => {
  const { tripsByStatus } = useRealTimeDataContext();

  const [selectedTrip, setSelectedTrip] = useState(null);

  // status visual config
  const statusConfig = {
    inprogress: {
      label: "In Progress",
      badge: "bg-blue-100 text-blue-700",
      border: "border-blue-300",
    },
    upcoming: {
      label: "Upcoming",
      badge: "bg-yellow-100 text-yellow-700",
      border: "border-yellow-300",
    },
    completed: {
      label: "Completed",
      badge: "bg-green-100 text-green-700",
      border: "border-green-300",
    },
    cancelled: {
      label: "Cancelled",
      badge: "bg-red-100 text-red-700",
      border: "border-red-300",
    },
  };

  return (
    <div className="max-w-auto mx-auto space-y-8">
      {/* ---- ACTIVE TRIPS ---- */}
      <TripSection
        title="Active Trips"
        trips={tripsByStatus.inprogress || []}
        statusKey="inprogress"
        statusConfig={statusConfig}
      />

      {/* ---- UPCOMING TRIPS ---- */}
      <TripSection
        title="Upcoming Trips"
        trips={tripsByStatus.upcoming || []}
        statusKey="upcoming"
        statusConfig={statusConfig}
      />

      {/* ---- COMPLETED ---- */}
      <TripSection
        title="Completed Trips"
        trips={tripsByStatus.completed || []}
        statusKey="completed"
        statusConfig={statusConfig}
      />

      {/* ---- CANCELLED ---- */}
      <TripSection
        title="Cancelled Trips"
        trips={tripsByStatus.cancelled || []}
        statusKey="cancelled"
        statusConfig={statusConfig}
      />
    </div>
  );
};

export default TripList;

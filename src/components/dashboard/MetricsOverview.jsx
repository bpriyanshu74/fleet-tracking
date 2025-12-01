import { useRealTimeDataContext } from "../../context/RealTimeDataContext";

const MetricIcon = ({ type }) => {
  if (type === "trips")
    return (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 6h18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M5 6v10a2 2 0 002 2h10a2 2 0 002-2V6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  if (type === "active")
    return (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 12h4l3 8 4-16 3 8h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 7h18v10H3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const MetricsOverview = () => {
  const { trips } = useRealTimeDataContext();

  const fleetMetrics = {
    totalTrips: trips.length,
    activeTrips: trips.filter((t) => t.status === "inprogress").length,
    totalDistance: trips.reduce(
      (sum, t) => sum + (t.metrics?.distanceTravelled || 0),
      0
    ),
  };

  const metrics = [
    {
      id: "total",
      label: "Total Trips",
      value: fleetMetrics.totalTrips,
      accent: "bg-blue-500",
      iconType: "trips",
    },
    {
      id: "active",
      label: "Active Trips",
      value: fleetMetrics.activeTrips,
      accent: "bg-green-500",
      iconType: "active",
    },
    {
      id: "distance",
      label: "Total Distance (km)",
      value: fleetMetrics.totalDistance.toFixed(1),
      accent: "bg-orange-500",
      iconType: "distance",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4">
      {metrics.map((m) => (
        <div
          key={m.id}
          className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm"
        >
          {/* Accent square with icon */}
          <div
            className={`flex items-center justify-center w-16 h-14 rounded-lg ${m.accent} bg-opacity-90`}
          >
            <div className="text-white">
              <MetricIcon type={m.iconType} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-semibold text-gray-900 truncate">
                {m.value}
              </div>
              {/* optional small label on corner */}
              <div className="text-xs text-gray-400">
                {/* place for delta/mini stat */}
              </div>
            </div>

            <div className="text-sm text-gray-500 truncate">{m.label}</div>

            {/* subtle footer / extra info */}
            {/* <div className="mt-2 text-xs text-gray-400">
              {m.id === "active" && (
                <span>{fleetMetrics.activeTrips} currently running</span>
              )}
              {m.id === "score" && <span>Overall fleet score</span>}
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsOverview;

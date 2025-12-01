import { useParams, Link } from "react-router-dom";
import { useRealTimeDataContext } from "../../context/RealTimeDataContext";
import { formatDuration, formatHours } from "../../utils/formatDuration";
import { formatUTC } from "../../utils/formatUTC";

const TripDetails = () => {
  const { tripId } = useParams();
  const { getTripById, currentSimulationTime } = useRealTimeDataContext();
  const trip = getTripById(tripId);

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Trip Not Found
          </h1>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const statusColors = {
    inprogress: "bg-blue-100 text-blue-700",
    upcoming: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  // Fix “Trip starts in”
  const startInSeconds =
    trip.startTime && currentSimulationTime
      ? Math.max(0, Math.floor((trip.startTime - currentSimulationTime) / 1000))
      : 0;

  // In-progress duration
  const elapsedSeconds =
    trip.status === "inprogress" && currentSimulationTime
      ? Math.max(0, Math.floor((currentSimulationTime - trip.startTime) / 1000))
      : 0;

  // Completed trip duration
  const completedDuration =
    trip.metrics?.totalDuration ??
    (trip.metrics?.elapsedTimeMinutes
      ? trip.metrics.elapsedTimeMinutes / 60
      : null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link
            to="/dashboard"
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
          >
            ← Back
          </Link>

          <h1 className="text-xl font-semibold text-gray-900">Trip Details</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Vehicle {trip.vehicleId}
              </h2>
              <p className="text-gray-500 text-sm">Trip ID: {trip.id}</p>
            </div>

            <span
              className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${
                statusColors[trip.status]
              }`}
            >
              {trip.status}
            </span>
          </div>

          {/* MAIN METRIC GRID (CLEAN, NO SCORE) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard label="Distance Travelled">
              {trip.metrics.distanceTravelled.toFixed(1)} km
            </MetricCard>

            <MetricCard label="Overspeed Events">
              {trip.metrics.overspeedCount}
            </MetricCard>

            <MetricCard label="Fuel Consumed">
              {trip.metrics.fuelConsumed?.toFixed(1) ?? 0}%
            </MetricCard>

            <MetricCard label="Current Speed">
              {trip.status === "inprogress"
                ? `${trip.metrics.currentSpeed?.toFixed(1) ?? 0} km/h`
                : "—"}
            </MetricCard>

            <MetricCard label="Current Location" full>
              {trip.currentLocation
                ? `${trip.currentLocation.lat.toFixed(
                    4
                  )}, ${trip.currentLocation.lng.toFixed(4)}`
                : "Not started yet"}
            </MetricCard>
          </div>

          {/* Extra Info */}
          <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 shadow-sm space-y-1">
            {trip.status === "upcoming" && (
              <DetailInfo label="Trip starts in">
                {formatDuration(startInSeconds)}
              </DetailInfo>
            )}

            {trip.status === "inprogress" && (
              <>
                <DetailInfo label="Time driven">
                  {formatDuration(elapsedSeconds)}
                </DetailInfo>
                <DetailInfo label="Last updated">
                  {formatUTC(trip.lastUpdated)}
                </DetailInfo>
              </>
            )}
            {/* `${completedDuration.toFixed(2)} hours` */}
            {trip.status === "completed" && (
              <>
                <DetailInfo label="Trip Duration">
                  {completedDuration
                    ? formatHours(completedDuration.toFixed(2))
                    : "—"}
                </DetailInfo>
                <DetailInfo label="Completed at">
                  {formatUTC(trip.lastUpdated)}
                </DetailInfo>
              </>
            )}

            {trip.status === "cancelled" && (
              <>
                <DetailInfo label="Trip Duration">
                  {completedDuration
                    ? formatHours(completedDuration.toFixed(2))
                    : "—"}
                </DetailInfo>

                <DetailInfo label="Cancelled at">
                  {formatUTC(trip.lastUpdated)}
                </DetailInfo>

                <DetailInfo label="Cancellation Reason">
                  {trip.metrics.cancellationReason
                    .toUpperCase()
                    .replace("_", " ")}
                </DetailInfo>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

/* Reusable Components */
const MetricCard = ({ label, children, full = false }) => (
  <div
    className={`p-4 rounded-xl bg-gray-50 border border-gray-200 shadow-sm ${
      full ? "sm:col-span-2" : ""
    }`}
  >
    <p className="text-sm text-gray-500">{label}</p>
    <h3 className="text-xl font-bold text-gray-900 mt-1">{children}</h3>
  </div>
);

const DetailInfo = ({ label, children }) => (
  <div className="text-sm text-gray-700">
    <span className="font-medium">{label}: </span>
    {children}
  </div>
);

export default TripDetails;

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { formatUTC } from "../../../utils/formatUTC";
import {
  formatDuration,
  formatHours,
  formatMinutes,
} from "../../../utils/formatDuration";

const TripCard = ({ trip, statusConfig }) => {
  const statusAccent = {
    inprogress: "bg-blue-500",
    upcoming: "bg-yellow-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
  };

  return (
    <Link
      to={`/trip/${trip.id}`}
      className="
        relative                        /* FIXED */
        bg-white rounded-xl shadow-sm border border-gray-100
        p-4 flex flex-col gap-4
        transition-all duration-300 ease-out
        hover:shadow-lg hover:-translate-y-1 hover:border-gray-300
      "
      style={{ minHeight: "160px" }}
    >
      {/* Status color bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1.5 rounded-l-xl z-10  /* FIXED */
          ${statusAccent[trip.status]}`}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg truncate">
            {trip.vehicleId}
          </h3>
          <p className="text-xs text-gray-500 truncate">Trip ID: {trip.id}</p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusConfig.badge}`}
        >
          {trip.status}
        </span>
      </div>

      {/* Metrics */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="truncate">
          <div className="text-xl font-semibold text-gray-900">
            {trip.metrics.distanceTravelled.toFixed(1)} km
          </div>
          <span className="font-medium text-gray-800">Distance</span>
        </div>

        <div className="min-w-20 text-right">
          <div className="text-xl font-semibold text-gray-900">
            {trip.status === "inprogress"
              ? `${trip.metrics.currentSpeed?.toFixed(1) ?? 0} km/h`
              : ""}
          </div>

          {trip.status === "inprogress" && (
            <div className="text-xs text-gray-800">Current speed</div>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-1">
        {/* In-progress: elapsed time */}
        {trip.status === "inprogress" && (
          <>Updated: {formatUTC(trip.lastUpdated)}</>
        )}

        {/* Upcoming: countdown */}
        {trip.status === "upcoming" && (
          <>Trip starts in: {formatDuration(trip.startInSeconds)}</>
        )}

        {/* Completed trips */}
        {trip.status === "completed" && (
          <>
            Trip duration: {formatHours(trip.metrics.totalDuration ?? 0)}
            <br />
            Updated: {formatUTC(trip.lastUpdated)}
          </>
        )}

        {/* Cancelled trips */}
        {trip.status === "cancelled" && (
          <>
            Trip duration: {formatMinutes(trip.metrics.elapsedTimeMinutes ?? 0)}
            <br />
            Updated: {formatUTC(trip.lastUpdated)}
            {trip.status === "cancelled" && trip.metrics.cancellationReason && (
              <div className="text-xs text-red-600 mt-1 font-medium">
                Reason:{" "}
                {trip.metrics.cancellationReason
                  .toUpperCase()
                  .replace("_", " ")}
              </div>
            )}
          </>
        )}
      </div>
    </Link>
  );
};

export default TripCard;

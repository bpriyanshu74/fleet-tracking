// TripCardHeader.jsx
import { Link } from "react-router-dom";

const TripCardHeader = ({ trip, statusConfig, compactMode, onOpenCompact }) => {
  return (
    <div className="flex items-start justify-between mb-2 gap-3">
      {/* Left — title */}
      <div className="min-w-0">
        <h4 className="font-semibold text-gray-900 text-base truncate">
          {trip.vehicleId}
        </h4>

        {!compactMode && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            Trip ID: {trip.id}
          </p>
        )}
      </div>

      {/* Right — badges + button */}
      <div className="flex items-start gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.badge}`}
        >
          {trip.status}
        </span>

        {/* Open button → regular view */}
        {!compactMode && (
          <Link
            to={`/trip/${trip.id}`}
            className="px-2 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors whitespace-nowrap"
          >
            Open
          </Link>
        )}

        {/* View button → compact mode modal */}
        {compactMode && (
          <button
            onClick={() => onOpenCompact(trip)}
            className="px-2 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors whitespace-nowrap"
          >
            View
          </button>
        )}
      </div>
    </div>
  );
};

export default TripCardHeader;

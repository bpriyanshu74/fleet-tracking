import TripCard from "./TripCard";

const TripSection = ({
  title,
  trips,
  statusKey,
  statusConfig,
  onOpenModal,
  currentSimulationTime,
}) => {
  return (
    <section className="space-y-4">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900">
        {title} <span className="text-gray-500 text-sm">({trips.length})</span>
      </h2>

      {/* Empty state */}
      {trips.length === 0 && (
        <p className="text-gray-400 text-sm">No trips in this category</p>
      )}

      {/* Trip list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            statusConfig={statusConfig[statusKey]}
          />
        ))}
      </div>
    </section>
  );
};

export default TripSection;

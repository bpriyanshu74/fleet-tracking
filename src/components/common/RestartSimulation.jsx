import { useRealTimeDataContext } from "../../context/RealTimeDataContext";

const Restart = () => {
  const { restartSimulation } = useRealTimeDataContext();

  return (
    <div className="relative w-full h-full">
      <button
        onClick={restartSimulation}
        className="relative-full bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-500 transition cursor-pointer"
      >
        Restart Simulation
      </button>
    </div>
  );
};

export default Restart;

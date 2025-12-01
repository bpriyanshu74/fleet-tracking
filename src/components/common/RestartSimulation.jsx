// import { useRealTimeDataContext } from "../../context/RealTimeDataContext";

// const Restart = () => {
//   const { restartSimulation } = useRealTimeDataContext();

//   return (
//     <div className="relative w-full h-full">
//       <button
//         onClick={restartSimulation}
//         className="relative-full bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-500 transition cursor-pointer"
//       >
//         Restart Simulation
//       </button>
//     </div>
//   );
// };

// export default Restart;

import { useRealTimeDataContext } from "../../context/RealTimeDataContext";

const Restart = () => {
  const { restartSimulation } = useRealTimeDataContext();

  return (
    <button
      onClick={restartSimulation}
      className="
        bg-red-600 text-white
        px-3 py-1.5 sm:px-4 sm:py-2
        rounded-lg shadow-md
        hover:bg-red-500 transition
        text-xs sm:text-sm
        whitespace-nowrap
      "
    >
      Restart
    </button>
  );
};

export default Restart;

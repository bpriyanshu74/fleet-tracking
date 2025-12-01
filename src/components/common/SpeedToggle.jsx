import { useState, useEffect } from "react";
import { useRealTimeDataContext } from "../../context/RealTimeDataContext";

const SpeedToggle = () => {
  const { setSimulationSpeed } = useRealTimeDataContext();

  // 50× selected by default
  const [active, setActive] = useState(50);

  useEffect(() => {
    // sync initial selection with simulator
    setSimulationSpeed(50);
  }, [setSimulationSpeed]);

  const baseBtn =
    "px-3 py-1 text-sm rounded-md border transition cursor-pointer font-medium";

  const activeBtn = "bg-gray-300 text-gray-900 border-gray-400 shadow-sm";
  const inactiveBtn =
    "bg-white text-gray-600 border-gray-300 hover:bg-gray-100";

  const handleSpeedClick = (speed) => {
    setActive(speed);
    setSimulationSpeed(speed);
    console.log(speed);
  };

  return (
    <div className="flex items-center gap-2 bg-white/70 backdrop-blur px-2 py-1 rounded-xl shadow">
      <button
        onClick={() => handleSpeedClick(1)}
        className={`${baseBtn} ${active === 1 ? activeBtn : inactiveBtn}`}
      >
        1×
      </button>

      <button
        onClick={() => handleSpeedClick(10)}
        className={`${baseBtn} ${active === 10 ? activeBtn : inactiveBtn}`}
      >
        10×
      </button>

      <button
        onClick={() => handleSpeedClick(50)}
        className={`${baseBtn} ${active === 50 ? activeBtn : inactiveBtn}`}
      >
        50×
      </button>
    </div>
  );
};

export default SpeedToggle;

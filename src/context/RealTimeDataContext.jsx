import { createContext, useContext } from "react";
import { useRealTimeData } from "../hooks/useRealTimeData";

const RealTimeDataContext = createContext();

export const useRealTimeDataContext = () => {
  const context = useContext(RealTimeDataContext);
  if (!context) {
    throw new Error(
      "useRealTimeDataContext must be used within RealTimeDataProvider"
    );
  }
  return context;
};

export const RealTimeDataProvider = ({ children }) => {
  const realTimeData = useRealTimeData();

  return (
    <RealTimeDataContext.Provider value={realTimeData}>
      {children}
    </RealTimeDataContext.Provider>
  );
};

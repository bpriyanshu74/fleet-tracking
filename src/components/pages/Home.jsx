import FleetMap from "../maps/FleetMap";
import ErrorBoundary from "../common/ErrorBoundary";
import Topbar from "../common/Topbar";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col h-screen">
      <div>
        <Topbar />
      </div>

      <div className="w-full h-[calc(100vh-64px)]">
        <ErrorBoundary>
          <FleetMap />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Home;

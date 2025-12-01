import { useNavigate } from "react-router-dom";
import Topbar from "../common/Topbar";

export default function FleetNotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Top Bar */}
      <Topbar />

      {/* Body */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200 max-w-md w-full text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-9"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3m0 4h.01M5.07 19h13.86a2 2 0 001.74-2.98l-6.93-12a2 2 0 00-3.48 0l-6.93 12A2 2 0 005.07 19z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Fleet Not Found
          </h1>

          <p className="text-gray-600 mb-8">
            The fleet you searched for doesn’t exist. Please check the fleet
            name again.
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-sky-600 text-white font-medium rounded-xl shadow hover:bg-sky-700 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

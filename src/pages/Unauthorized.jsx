import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-6">
      <h1 className="text-4xl font-bold text-red-500">⛔ Access Denied</h1>
      <p className="text-gray-400 mt-4">You do not have permission to view this page.</p>
      <Link to="/" className="mt-6 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded text-white">
        🔙 Go Back to Dashboard
      </Link>
    </div>
  );
}

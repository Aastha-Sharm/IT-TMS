import React from "react";

interface TicketDetailsProps {
  id: number;
  title: string;
  description: string;
  created_by: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  response?: string;
  onClose: () => void;
  onDelete: () => void;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({
  id,
  title,
  description,
  created_by,
  category,
  priority,
  status,
  created_at,
  response,
  onClose,
  onDelete,
}) => {
  // 🎨 Helper for priority colors
  const getPriorityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  // 🎨 Helper for status colors
  const getStatusColor = (state: string) => {
    switch (state.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-700";
      case "in progress":
        return "bg-yellow-100 text-yellow-700";
      case "closed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white to-red-100 p-6">
      {/* Header */}
      <h2 className="text-3xl font-bold border-b pb-6 mb-6">
        Ticket Details
      </h2>

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-sm">
        <div>
          <p className="text-gray-500 font-medium">Ticket ID</p>
          <p className="text-black ">{id}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Title</p>
          <p className="text-black ">{title}</p>
        </div>

        <div>
          <p className="text-gray-500 font-medium">Created By</p>
          <p className="text-black">{created_by}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Category</p>
          <p className="text-black">{category}</p>
        </div>

        <div>
          <p className="text-gray-500 font-medium">Priority</p>
          <span
            className={`inline-block px-3 py-1 text-xs rounded-full ${getPriorityColor(
              priority
            )}`}
          >
            {priority}
          </span>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Status</p>
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>
        </div>

        <div>
          <p className="text-gray-500 font-medium">Created At</p>
          <p className="text-black">{created_at}</p>
        </div>

        {/* Full-width fields */}
        <div className="sm:col-span-2">
          <p className="text-gray-500 font-medium">Description</p>
          <div className="mt-1 p-3 bg-gray-50 border rounded-lg text-gray-800 leading-relaxed">
            {description}
          </div>
        </div>

        <div className="sm:col-span-2">
          <p className="text-gray-500 font-medium">Response</p>
          <div className="mt-1 p-3 bg-gray-50 border rounded-lg text-gray-800 leading-relaxed">
            {response || "—"}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-10 pt-6">
        <button
          onClick={onClose}
          className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
        >
           Close Ticket
        </button>
        <button
          onClick={onDelete}
          className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 transition"
        >
           Delete Ticket
        </button>
      </div>
    </div>
  );
};

export default TicketDetails;

import React, { useState } from "react";

interface TicketDetailsProps {
  id: number;
  title: string;
  description: string;
  created_by: string;
  type: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  user_id?: number;
  response?: string;
  onUpdate: (updatedTicket: {
    status: string;
    response: string;
  }) => void; // ✅ callback to send updates
}

const TicketDetails: React.FC<TicketDetailsProps> = ({
  id,
  title,
  description,
  created_by,
  type,
  category,
  priority,
  status,
  created_at,
  user_id,
  response,
  onUpdate,
}) => {
  // Local state for editable fields
  const [ticketStatus, setTicketStatus] = useState("");
  const [ticketResponse, setTicketResponse] = useState(response || "");

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

  return (
    <div className="bg-white p-6">
      {/* Header */}
      <h2 className="text-3xl font-bold border-b pb-6 mb-6">
        Service Ticket Details
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-sm">
        <div>
          <p className="text-gray-500 font-medium">Ticket ID</p>
          <p className="text-black">{id}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Title</p>
          <p className="text-black">{title}</p>
        </div>

        <div>
          <p className="text-gray-500 font-medium">Created By</p>
          <p className="text-black">{created_by}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Type</p>
          <p className="text-black">{type}</p>
        </div>

        <div>
          <p className="text-gray-500 font-medium">Category</p>
          <p className="text-black">{category}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">User ID</p>
          <p className="text-black">{user_id || "—"}</p>
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

        {/* Status dropdown */}
       <div>
        <p className="text-gray-500 font-medium">Status</p>
        <select
            value={ticketStatus}
            onChange={(e) => setTicketStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        >
            {/* Placeholder */}
            <option value="" disabled>
            Select Status
            </option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="unresolved">Unresolved</option>
        </select>
        </div>


        {/* Description (read only) */}
        <div className="sm:col-span-2">
          <p className="text-gray-500 font-medium">Description</p>
          <div className="mt-1 p-3 bg-gray-50 border rounded-lg text-gray-800 leading-relaxed">
            {description}
          </div>
        </div>

        {/* Response textarea */}
        <div className="sm:col-span-2">
          <p className="text-gray-500 font-medium">Response</p>
          <textarea
            value={ticketResponse}
            onChange={(e) => setTicketResponse(e.target.value)}
            rows={4}
            className="mt-1 w-full p-3 bg-gray-50 border rounded-lg text-gray-800 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your response here..."
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end mt-10 pt-6">
        <button
          onClick={() => onUpdate({ status: ticketStatus, response: ticketResponse })}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
        >
          Update Ticket
        </button>
      </div>
    </div>
  );
};

export default TicketDetails;

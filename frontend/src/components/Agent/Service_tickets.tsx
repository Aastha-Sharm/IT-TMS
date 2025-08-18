import React, { useState } from "react";

// Dummy ticket data
const initialTickets = [
  {
    id: 1,
    type: "Incident",
    title: "Email not working",
    description: "Unable to send or receive emails",
    priority: "High",
    status: "In Progress",
    agentResponse: "Investigating the issue",
  },
  {
    id: 2,
    type: "Request",
    title: "Install software",
    description: "Need MS Office installed",
    priority: "Medium",
    status: "Not Resolved",
    agentResponse: "Pending approval",
  },
  {
    id: 3,
    type: "Incident",
    title: "Laptop Overheating",
    description: "Fan noise and overheating issue",
    priority: "Low",
    status: "Resolved",
    agentResponse: "Cleaned and fixed cooling system",
  },
];

// Priority order mapping
const priorityOrder: Record<string, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

// Status order mapping
const statusOrder: Record<string, number> = {
  "Not Resolved": 1,
  "In Progress": 2,
  Resolved: 3,
  Closed: 4,
};

const ServiceTickets: React.FC = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [sortField, setSortField] = useState<"priority" | "status" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

  const [entriesToShow] = useState(10); // limit to 10 for now
  const filteredTickets = tickets;

  // Sorting logic
  const handleSort = (field: "priority" | "status") => {
    let direction: "asc" | "desc" = "asc";
    if (sortField === field && sortDirection === "asc") {
      direction = "desc";
    }
    setSortField(field);
    setSortDirection(direction);

    const sortedTickets = [...tickets].sort((a, b) => {
      const orderMap = field === "priority" ? priorityOrder : statusOrder;
      const aValue = orderMap[a[field]] || 0;
      const bValue = orderMap[b[field]] || 0;

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setTickets(sortedTickets);
  };

  // Render sort arrow
  const renderSortIcon = (field: "priority" | "status") => {
    if (sortField !== field) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Service Tickets</h1>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div
          className={`overflow-y-auto ${
            filteredTickets.length > 5 ? "max-h-96" : ""
          }`}
        >
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-blue-200 text-gray-800 text-xs uppercase sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Description</th>

                {/* Status column */}
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <span className="inline-flex items-center gap-1">
                    Status {renderSortIcon("status")}
                  </span>
                </th>

                {/* Priority column */}
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("priority")}
                >
                  <span className="inline-flex items-center gap-1">
                    Priority {renderSortIcon("priority")}
                  </span>
                </th>

                <th className="px-6 py-3">Agent Response</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.slice(0, entriesToShow).map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{ticket.id}</td>
                  <td className="px-6 py-4">{ticket.type}</td>
                  <td className="px-6 py-4 font-medium">{ticket.title}</td>
                  <td className="px-6 py-4">{ticket.description}</td>

                  {/* Status cell */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        ticket.status === "Resolved" || ticket.status === "Closed"
                          ? "bg-green-100 text-green-700"
                          : ticket.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : ticket.status === "Not Resolved"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  {/* Priority cell */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        ticket.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : ticket.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td className="px-6 py-4">{ticket.agentResponse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceTickets;

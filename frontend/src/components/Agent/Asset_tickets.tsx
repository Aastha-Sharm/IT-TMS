import React, { useState } from "react";

interface AssetTicket {
  id: number;
  assetName: string;
  assignedTo: string;
  condition: string;
  status: string;
  agentResponse: string;
  priority: string;
}

const AssetTickets: React.FC = () => {
  const [sortField, setSortField] = useState<keyof AssetTicket | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [entriesToShow] = useState(10);

  // Dummy Data
  const [assetTickets, setAssetTickets] = useState<AssetTicket[]>([
    {
      id: 1,
      assetName: "Laptop - Dell XPS",
      assignedTo: "John Doe",
      condition: "Good",
      status: "In Use",
      agentResponse: "Verified assignment",
      priority: "High",
    },
    {
      id: 2,
      assetName: "Monitor - LG",
      assignedTo: "Jane Smith",
      condition: "Needs Repair",
      status: "Under Maintenance",
      agentResponse: "Sent for servicing",
      priority: "Medium",
    },
    {
      id: 3,
      assetName: "Keyboard - Logitech",
      assignedTo: "Alice",
      condition: "Excellent",
      status: "In Stock",
      agentResponse: "Ready for allocation",
      priority: "Low",
    },
  ]);

  // Priority weights for sorting
  const priorityOrder: Record<string, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  // Status weights for sorting
  const statusOrder: Record<string, number> = {
    "Under Maintenance": 3,
    "In Use": 2,
    "In Stock": 1,
  };

  // Sorting handler
  const handleSort = (field: keyof AssetTicket) => {
    if (field !== "priority" && field !== "status") return;

    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...assetTickets].sort((a, b) => {
      let aVal: number, bVal: number;

      if (field === "priority") {
        aVal = priorityOrder[a.priority] || 0;
        bVal = priorityOrder[b.priority] || 0;
      } else {
        aVal = statusOrder[a.status] || 0;
        bVal = statusOrder[b.status] || 0;
      }

      if (order === "asc") {
        return aVal - bVal; // Low → High
      } else {
        return bVal - aVal; // High → Low
      }
    });

    setAssetTickets(sorted);
  };

  // Show arrows (↕ always, ↑ or ↓ when active)
  const renderSortIcon = (field: keyof AssetTicket) => {
    if (field !== "priority" && field !== "status") return null;
    if (sortField !== field) return "↕";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  // Priority colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold";
      case "Low":
        return "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold";
      default:
        return "bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold";
    }
  };

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Use":
        return "bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold";
      case "Under Maintenance":
        return "bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold";
      case "In Stock":
        return "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold";
      default:
        return "bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold";
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Asset Tickets</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div
          className={`overflow-y-auto ${
            assetTickets.length > 5 ? "max-h-96" : ""
          }`}
        >
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-blue-200 text-gray-800 text-xs uppercase sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Asset Name</th>
                <th className="px-6 py-3">Assigned To</th>
                <th className="px-6 py-3">Condition</th>
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <span className="inline-flex items-center gap-1">
                    Status {renderSortIcon("status")}
                  </span>
                </th>
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
              {assetTickets.slice(0, entriesToShow).map((ticket) => (
                <tr key={ticket.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{ticket.id}</td>
                  <td className="px-6 py-4 font-medium">{ticket.assetName}</td>
                  <td className="px-6 py-4">{ticket.assignedTo}</td>
                  <td className="px-6 py-4">{ticket.condition}</td>
                  <td className="px-6 py-4">
                    <span className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getPriorityColor(ticket.priority)}>
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

export default AssetTickets;

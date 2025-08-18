import React, { useState } from "react";

interface Ticket {
  id: number;
  type: "Service" | "Asset";
  title: string;
  description: string;
  status:
    | "Created"
    | "Assigned"
    | "Reopened"
    | "In Progress"
    | "Resolved"
    | "Closed"
    | "Not Resolved";
  priority: "Low" | "Medium" | "High";
  agentResponse: string;
}

const Dashboard: React.FC = () => {
  const ticketsData: Ticket[] = [
    { id: 1, type: "Service", title: "Login issue", description: "User unable to log in.", status: "Created", priority: "High", agentResponse: "Checking logs." },
    { id: 2, type: "Service", title: "Page slow", description: "Dashboard slow loading.", status: "In Progress", priority: "Medium", agentResponse: "Optimizing queries." },
    { id: 3, type: "Asset", title: "Email not sent", description: "SMTP server failing.", status: "Resolved", priority: "High", agentResponse: "SMTP restarted." },
    { id: 4, type: "Service", title: "UI misalignment", description: "Alignment issue.", status: "Not Resolved", priority: "Low", agentResponse: "Next UI patch." },
    { id: 5, type: "Asset", title: "Export bug", description: "CSV empty file.", status: "Assigned", priority: "High", agentResponse: "Working on fix." },
  ];

  // State for which category is selected
  const [selectedType, setSelectedType] = useState<"Service" | "Asset" | null>(null);

  const totalTickets = ticketsData.length;
  const openStatuses = ["Created", "Assigned", "Reopened"];
  const resolvedStatuses = ["Resolved", "Closed"];
  const unresolvedStatuses = ["Not Resolved"];

  const countOpen = ticketsData.filter(t => openStatuses.includes(t.status)).length;
  const countInProgress = ticketsData.filter(t => t.status === "In Progress").length;
  const countResolved = ticketsData.filter(t => resolvedStatuses.includes(t.status)).length;
  const countUnresolved = ticketsData.filter(t => unresolvedStatuses.includes(t.status)).length;

  return (
    <div className="bg-white min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">Agent Dashboard</h1>

      {/* Value Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-blue-100 shadow rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Open</h2>
          <p className="text-3xl font-bold text-blue-700">{countOpen}</p>
          <p className="text-sm text-gray-500">of {totalTickets}</p>
        </div>
        <div className="bg-yellow-100 shadow rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">In Progress</h2>
          <p className="text-3xl font-bold text-yellow-700">{countInProgress}</p>
          <p className="text-sm text-gray-500">of {totalTickets}</p>
        </div>
        <div className="bg-green-100 shadow rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Resolved</h2>
          <p className="text-3xl font-bold text-green-700">{countResolved}</p>
          <p className="text-sm text-gray-500">of {totalTickets}</p>
        </div>
        <div className="bg-red-100 shadow rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Unresolved</h2>
          <p className="text-3xl font-bold text-red-700">{countUnresolved}</p>
          <p className="text-sm text-gray-500">of {totalTickets}</p>
        </div>
      </div>

      {/* Two Category Cards */}
      <div className="flex justify-center gap-6 mb-8">
        <div
          onClick={() => setSelectedType("Service")}
          className={`w-1/2 cursor-pointer bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition ${
            selectedType === "Service" ? "border-2 border-blue-500" : ""
          }`}
        >
          <h2 className="text-xl font-semibold mb-2 text-blue-700">Service Tickets</h2>
          <p className="text-gray-600">{ticketsData.filter(t => t.type === "Service").length} Tickets</p>
        </div>

        <div
          onClick={() => setSelectedType("Asset")}
          className={`w-1/2 cursor-pointer bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition ${
            selectedType === "Asset" ? "border-2 border-green-500" : ""
          }`}
        >
          <h2 className="text-xl font-semibold mb-2 text-green-700">Asset Tickets</h2>
          <p className="text-gray-600">{ticketsData.filter(t => t.type === "Asset").length} Tickets</p>
        </div>
      </div>

      {/* Show tickets when a category is clicked */}
      {selectedType && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{selectedType} Tickets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ticketsData
              .filter(ticket => ticket.type === selectedType)
              .map(ticket => (
                <div
                  key={ticket.id}
                  className="bg-gray-100 p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-semibold mb-2">{ticket.title}</h3>
                  <p className="text-gray-600 mb-2">{ticket.description}</p>
                  <p className="text-sm">
                    <span className="font-semibold">Priority:</span> {ticket.priority}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Status:</span> {ticket.status}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Response:</span> {ticket.agentResponse}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

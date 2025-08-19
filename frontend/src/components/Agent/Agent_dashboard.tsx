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
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
         Agent Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-blue-50 hover:bg-blue-100 shadow-md p-6 text-center transition">
          <h2 className="text-lg font-semibold text-gray-700">Open</h2>
          <p className="text-4xl font-bold text-blue-700">{countOpen}</p>
          <p className="text-sm text-gray-500">of {totalTickets} Tickets</p>
        </div>
        <div className="bg-yellow-50 hover:bg-yellow-100 shadow-md p-6 text-center transition">
          <h2 className="text-lg font-semibold text-gray-700">In Progress</h2>
          <p className="text-4xl font-bold text-yellow-600">{countInProgress}</p>
          <p className="text-sm text-gray-500">of {totalTickets} Tickets</p>
        </div>
        <div className="bg-green-50 hover:bg-green-100 shadow-md p-6 text-center transition">
          <h2 className="text-lg font-semibold text-gray-700">Resolved</h2>
          <p className="text-4xl font-bold text-green-600">{countResolved}</p>
          <p className="text-sm text-gray-500">of {totalTickets} Tickets</p>
        </div>
        <div className="bg-red-50 hover:bg-red-100 shadow-md p-6 text-center transition">
          <h2 className="text-lg font-semibold text-gray-700">Unresolved</h2>
          <p className="text-4xl font-bold text-red-600">{countUnresolved}</p>
          <p className="text-sm text-gray-500">of {totalTickets} Tickets</p>
        </div>
      </div>

      {/* Category Selector */}
      <div className="flex flex-col sm:flex-row justify-center gap-8">
        {/* Service Tickets Card */}
        <div
          onClick={() => setSelectedType("Service")}
          className={`flex-1 cursor-pointer bg-white border shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1 ${
            selectedType === "Service" ? "border-blue-500" : "border-gray-200"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-2 text-center text-blue-600">
            Service Tickets
          </h2>
          <p className="text-gray-600 text-center mb-4">
            {ticketsData.filter((t) => t.type === "Service").length} Tickets
          </p>

          <div className="text-sm text-gray-700 space-y-2">
            <p><span className="font-semibold">Open:</span> {ticketsData.filter((t) => t.type === "Service" && openStatuses.includes(t.status)).length}</p>
            <p><span className="font-semibold">In Progress:</span> {ticketsData.filter((t) => t.type === "Service" && t.status === "In Progress").length}</p>
            <p><span className="font-semibold">Resolved:</span> {ticketsData.filter((t) => t.type === "Service" && resolvedStatuses.includes(t.status)).length}</p>
            <p><span className="font-semibold">Unresolved:</span> {ticketsData.filter((t) => t.type === "Service" && unresolvedStatuses.includes(t.status)).length}</p>
          </div>
        </div>

        {/* Asset Tickets Card */}
        <div
          onClick={() => setSelectedType("Asset")}
          className={`flex-1 cursor-pointer bg-white border shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1 ${
            selectedType === "Asset" ? "border-green-500" : "border-gray-200"
          }`}
        >
          <h2 className="text-2xl font-semibold text-center mb-2 text-green-600">
            Asset Tickets
          </h2>
          <p className="text-gray-600 text-center mb-4">
            {ticketsData.filter((t) => t.type === "Asset").length} Tickets
          </p>

          <div className="text-sm text-gray-700 space-y-2">
            <p><span className="font-semibold">Open:</span> {ticketsData.filter((t) => t.type === "Asset" && openStatuses.includes(t.status)).length}</p>
            <p><span className="font-semibold">In Progress:</span> {ticketsData.filter((t) => t.type === "Asset" && t.status === "In Progress").length}</p>
            <p><span className="font-semibold">Resolved:</span> {ticketsData.filter((t) => t.type === "Asset" && resolvedStatuses.includes(t.status)).length}</p>
            <p><span className="font-semibold">Unresolved:</span> {ticketsData.filter((t) => t.type === "Asset" && unresolvedStatuses.includes(t.status)).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

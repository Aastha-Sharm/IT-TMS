import React, { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid";

interface ProgressCircleProps {
  label: string;
  current: number;
  total: number;
  color: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ label, current, total, color }) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    const timeout = setTimeout(() => {
      setProgress(percentage);
    }, 100);
    return () => clearTimeout(timeout);
  }, [current, total]);

  return (
    <div className="flex flex-col items-center bg-white shadow-md rounded-xl p-5 w-40">
      <div
        className="flex items-center justify-center rounded-full shadow-inner"
        style={{
          width: "6rem",
          height: "6rem",
          background: `radial-gradient(closest-side, #fff 79%, transparent 80% 100%), 
                       conic-gradient(${color} ${progress}%, #e5e7eb 0)`,
          transition: "background 1s ease-in-out"
        }}
      >
        <span className="text-lg font-semibold">{current}/{total}</span>
      </div>
      <p className="mt-3 text-sm font-medium text-gray-700 uppercase tracking-wide">{label}</p>
    </div>
  );
};

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
    { id: 6, type: "Service", title: "Downtime", description: "Server downtime.", status: "Reopened", priority: "High", agentResponse: "Investigating logs." },
    { id: 7, type: "Asset", title: "Security patch", description: "Update applied.", status: "Closed", priority: "Medium", agentResponse: "Patch verified." }
  ];

  const [tickets, setTickets] = useState<Ticket[]>(ticketsData);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Ticket; direction: "asc" | "desc" | null }>({ key: "type", direction: null });
  const [entriesToShow, setEntriesToShow] = useState<number>(5);

 const handleSort = (key: keyof Ticket) => {
  let direction: "asc" | "desc" | null = "asc";
  if (sortConfig.key === key && sortConfig.direction === "asc") {
    direction = "desc";
  } else if (sortConfig.key === key && sortConfig.direction === "desc") {
    direction = null; // reset
  }
  setSortConfig({ key, direction });

  if (direction) {
    const sorted = [...tickets].sort((a, b) => {
      if (key === "priority") {
        // Custom priority ranking
        const priorityOrder: Record<string, number> = {
          Low: 1,
          Medium: 2,
          High: 3,
        };

        return direction === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        // Default string/number sorting
        return a[key] > b[key]
          ? direction === "asc" ? 1 : -1
          : a[key] < b[key]
          ? direction === "asc" ? -1 : 1
          : 0;
        }
      });
      setTickets(sorted);
    } else {
      setTickets(ticketsData); // reset to original
    }
    };

  const totalTickets = ticketsData.length;
  const openStatuses = ["Created", "Assigned", "Reopened"];
  const resolvedStatuses = ["Resolved", "Closed"];
  const unresolvedStatuses = ["Not Resolved"];

  const countOpen = ticketsData.filter(t => openStatuses.includes(t.status)).length;
  const countInProgress = ticketsData.filter(t => t.status === "In Progress").length;
  const countResolved = ticketsData.filter(t => resolvedStatuses.includes(t.status)).length;
  const countUnresolved = ticketsData.filter(t => unresolvedStatuses.includes(t.status)).length;

  const renderSortIcon = (column: keyof Ticket) => {
    if (sortConfig.key !== column || sortConfig.direction === null) {
      return <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />;
    }
    if (sortConfig.direction === "asc") {
      return <ChevronUpIcon className="w-4 h-4 text-blue-500" />;
    }
    return <ChevronDownIcon className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="bg-gradient-to-tr from-sky-200 to-sky-100 min-h-screen p-8">
      <h1 className="text-3xl bg-gradient-to-r from-sky-400 to-emerald-300 h-12 font-bold text-gray-800 mb-8 px-1 py-1">Ticket Dashboard</h1>

      {/* Charts */}
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        <ProgressCircle label="Open" current={countOpen} total={totalTickets} color="#FF5089" />
        <ProgressCircle label="In Progress" current={countInProgress} total={totalTickets} color="#FF1659" />
        <ProgressCircle label="Resolved" current={countResolved} total={totalTickets} color="#16A34A" />
        <ProgressCircle label="Unresolved" current={countUnresolved} total={totalTickets} color="#EAB308" />
      </div>

      {/* Show entries */}
      <div className="mb-3 inline-flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm">
        <label htmlFor="entries" className="text-sm text-gray-700">Show</label>
        <select
          id="entries"
          value={entriesToShow}
          onChange={(e) => setEntriesToShow(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={totalTickets}>All</option>
        </select>
        <span className="text-sm text-gray-700">entries</span>
      </div>


      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-blue-300 text-gray-800 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">ID</th>

              {/* Sortable Type */}
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("type")}
              >
                <span className="inline-flex items-center gap-1">
                  Type {renderSortIcon("type")}
                </span>
              </th>

              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Description</th>

              {/* Sortable Priority */}
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("priority")}
              >
                <span className="inline-flex items-center gap-1">
                  Priority {renderSortIcon("priority")}
                </span>
              </th>

              {/* Sortable Status */}
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <span className="inline-flex items-center gap-1">
                  Status {renderSortIcon("status")}
                </span>
              </th>

              <th className="px-6 py-3">Agent Response</th>
            </tr>
          </thead>
          <tbody>
            {tickets.slice(0, entriesToShow).map(ticket => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{ticket.id}</td>
                <td className="px-6 py-4">{ticket.type}</td>
                <td className="px-6 py-4 font-medium">{ticket.title}</td>
                <td className="px-6 py-4">{ticket.description}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    ticket.priority === "High" ? "bg-red-100 text-red-700" :
                    ticket.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    ticket.status === "Resolved" || ticket.status === "Closed" ? "bg-green-100 text-green-700" :
                    ticket.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                    ticket.status === "Not Resolved" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">{ticket.agentResponse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

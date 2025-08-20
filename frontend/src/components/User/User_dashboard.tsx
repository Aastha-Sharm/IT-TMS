import React, { useEffect, useState, useMemo } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/solid";
import { getTickets, type Ticket } from "../../api";
import ProgressCircle from "../progressCircle";

const Dashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Ticket;
    direction: "asc" | "desc" | null;
  }>({ key: "type", direction: null });
  const [entriesToShow, setEntriesToShow] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ✅ Fetch tickets
  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const data = await getTickets(token);
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  // ✅ Sorting helper
  const handleSort = (key: keyof Ticket) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    else if (sortConfig.key === key && sortConfig.direction === "desc") direction = null;
    setSortConfig({ key, direction });
  };

 // ✅ Memoized filtered + sorted tickets
const filteredTickets = useMemo(() => {
  let result = tickets.filter((t) =>
    t.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  if (sortConfig.direction) {
    result = [...result].sort((a, b) => {
      const { key, direction } = sortConfig;

      
      if (key === "priority") {
        const priorityOrder: Record<string, number> = { Low: 1, Medium: 2, High: 3 };
        return direction === "asc"
          ? (priorityOrder[a.priority] ?? 0) - (priorityOrder[b.priority] ?? 0)
          : (priorityOrder[b.priority] ?? 0) - (priorityOrder[a.priority] ?? 0);
      }

      const aVal = a[key] ?? "";
      const bVal = b[key] ?? "";

      if (aVal > bVal) {
        return direction === "asc" ? 1 : -1;
      }
      if (aVal < bVal) {
        return direction === "asc" ? -1 : 1;
      }
      return 0;
    });
  }

  return result;
}, [tickets, searchTerm, sortConfig]);


  // ✅ Precompute ticket counts in ONE loop
  const { countOpen, countInProgress, countResolved, countUnresolved } = useMemo(() => {
    let open = 0, inProgress = 0, resolved = 0, unresolved = 0;
    tickets.forEach((t) => {
      if (["Created", "Assigned", "Reopened"].includes(t.status)) open++;
      else if (t.status === "In Progress") inProgress++;
      else if (["Resolved", "Closed"].includes(t.status)) resolved++;
      else if (t.status === "Not Resolved") unresolved++;
    });
    return { countOpen: open, countInProgress: inProgress, countResolved: resolved, countUnresolved: unresolved };
  }, [tickets]);

  // ✅ Sort icon renderer
  const renderSortIcon = (column: keyof Ticket) => {
    if (sortConfig.key !== column || sortConfig.direction === null)
      return <ArrowsUpDownIcon className="w-4 h-4 text-black" />;
    return sortConfig.direction === "asc"
      ? <ChevronUpIcon className="w-4 h-4 text-blue-500" />
      : <ChevronDownIcon className="w-4 h-4 text-blue-500" />;
  };

  const totalTickets = tickets.length;

  return (
    <div className="bg-white min-h-screen p-8">
      <h1 className="text-4xl font-bold text-black drop-shadow mb-10">Ticket Dashboard</h1>

      {/* Charts */}
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        <ProgressCircle label="Open" current={countOpen} total={totalTickets} color="#3617a7ff" />
        <ProgressCircle label="In Progress" current={countInProgress} total={totalTickets} color="#3617a7ff" />
        <ProgressCircle label="Resolved" current={countResolved} total={totalTickets} color="#3617a7ff" />
        <ProgressCircle label="Unresolved" current={countUnresolved} total={totalTickets} color="#3617a7ff" />
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-3">
        {/* Show Entries */}
        <div className="inline-flex items-center gap-2 border rounded-md px-3 py-2 bg-white shadow-sm">
          <label htmlFor="entries" className="text-sm">Show</label>
          <select
            id="entries"
            value={entriesToShow}
            onChange={(e) => setEntriesToShow(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={totalTickets}>All</option>
          </select>
          <span className="text-sm">entries</span>
        </div>

        {/* Search */}
        <div className="inline-flex items-center border rounded-md px-3 py-2 shadow-sm">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-1 text-sm focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className={`overflow-y-auto ${filteredTickets.length > 5 ? "max-h-96" : ""}`}>
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-200 text-xs uppercase sticky top-0">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("type")}>
                  <span className="inline-flex items-center gap-1">Type {renderSortIcon("type")}</span>
                </th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("priority")}>
                  <span className="inline-flex items-center gap-1">Priority {renderSortIcon("priority")}</span>
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("status")}>
                  <span className="inline-flex items-center gap-1">Status {renderSortIcon("status")}</span>
                </th>
                <th className="px-6 py-3">Agent Response</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.slice(0, entriesToShow).map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{t.id}</td>
                  <td className="px-6 py-4">{t.type}</td>
                  <td className="px-6 py-4 font-medium">{t.title}</td>
                  <td className="px-6 py-4">{t.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      t.priority === "High" ? "bg-red-100 text-red-700"
                      : t.priority === "Medium" ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                    }`}>{t.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      ["Resolved", "Closed"].includes(t.status) ? "bg-green-100 text-green-700"
                      : t.status === "In Progress" ? "bg-blue-100 text-blue-700"
                      : t.status === "Not Resolved" ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                    }`}>{t.status}</span>
                  </td>
                  <td className="px-6 py-4">{t.agentResponse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

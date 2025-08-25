import React, { useEffect, useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import {
  getTickets,
  type Ticket,
  updateTicket,
  deleteTicket,
} from "../../api";
import ProgressCircle from "../progressCircle";
import { useNavigate } from "react-router-dom";
import type { ApexOptions } from "apexcharts";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Ticket;
    direction: "asc" | "desc" | null;
  }>({ key: "id", direction: null }); // 🔹 set default key to "id"
  const [entriesToShow, setEntriesToShow] = useState<number | "All">(5);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

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

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ Sorting helper
  const handleSort = (key: keyof Ticket) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    else if (sortConfig.key === key && sortConfig.direction === "desc") direction = null;
    setSortConfig({ key, direction });
  };

  // ✅ Delete ticket
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await deleteTicket(id, token);
      setTickets((prev) => prev.filter((t) => t.id !== id));
      setOpenMenuId(null);
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  // ✅ Edit ticket (open modal)
  const handleEdit = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleUpdate = async () => {
    if (!selectedTicket) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const updated = await updateTicket(selectedTicket.id, selectedTicket, token);
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  // ✅ Memoized filtered + sorted tickets
  const filteredTickets = useMemo(() => {
    let result = tickets.filter((t) =>
      t.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 🔹 Always sort by ID ascending first
    result = [...result].sort((a, b) => a.id - b.id);

    // 🔹 Apply user-selected sorting (if active)
    if (sortConfig.direction && sortConfig.key !== "id") {
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

        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        return 0;
      });
    }

    return result;
  }, [tickets, searchTerm, sortConfig]);

  // ✅ Precompute ticket counts
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

  const renderSortIcon = (column: keyof Ticket) => {
    if (sortConfig.key !== column || sortConfig.direction === null)
      return <ArrowsUpDownIcon className="w-4 h-4 text-black" />;
    return sortConfig.direction === "asc"
      ? <ChevronUpIcon className="w-4 h-4 text-gray-500" />
      : <ChevronDownIcon className="w-4 h-4 text-gray-500" />;
  };

  const totalTickets = tickets.length;

  // ✅ ApexCharts Config
  const chartOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 250,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: [4],
      colors: ["#ffffff"],
    },
    grid: {
      borderColor: "#7a7d81ff",
      strokeDashArray: 0,
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Open", "In Progress", "Resolved", "Unresolved"],
      labels: { style: { colors: "#ebedf1ff", fontSize: "13px" } },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: {
        style: { colors: "#e6e9efff", fontSize: "12px" },
        formatter: (value: number): string => value.toString(),
      },
    },
    legend: { show: false },
  };

  const chartSeries = [
    {
      name: "Tickets",
      data: [countOpen, countInProgress, countResolved, countUnresolved],
    },
  ];

  // ✅ Compute displayed tickets (with "All")
  const displayedTickets =
    entriesToShow === "All"
      ? filteredTickets
      : filteredTickets.slice(0, entriesToShow);

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-black drop-shadow">Ticket Dashboard</h1>
        <button
          onClick={() => navigate("/raise-ticket")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-lg transition"
        >
          <span className="text-xl">＋</span> Create Ticket
        </button>
      </div>

      {/* ✅ Donut + Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="grid grid-cols-2 gap-6">
          <ProgressCircle label="Open" current={countOpen} total={totalTickets} color="#3617a7ff" />
          <ProgressCircle label="In Progress" current={countInProgress} total={totalTickets} color="#3617a7ff" />
          <ProgressCircle label="Resolved" current={countResolved} total={totalTickets} color="#3617a7ff" />
          <ProgressCircle label="Unresolved" current={countUnresolved} total={totalTickets} color="#3617a7ff" />
        </div>
        <div className="lg:col-span-2 bg-gradient-to-r from-indigo-950 to-teal-600 rounded-lg shadow-md p-4">
          <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={300} />
        </div>
      </div>

      {/* ✅ Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 ">
          <label className="text-sm text-gray-600">Show</label>
          <select
            value={entriesToShow}
            onChange={(e) =>
              setEntriesToShow(e.target.value === "All" ? "All" : Number(e.target.value))
            }
            className="border rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value="All">All</option>
          </select>
          <span className="text-sm text-gray-600">entries</span>
        </div>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title..."
            className="border rounded px-3 py-1"
          />
        </div>
      </div>

      {/* ✅ Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className={`overflow-y-auto ${displayedTickets.length > 5 ? "max-h-96" : ""}`}>
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
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

                      <tbody>
            {displayedTickets.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{t.id}</td>
                <td className="px-6 py-4">{t.type}</td>
                <td className="px-6 py-4 font-medium">{t.title}</td>
                <td className="px-6 py-4">{t.description}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      t.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : t.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {t.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      ["Resolved", "Closed"].includes(t.status)
                        ? "bg-green-100 text-green-700"
                        : t.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : t.status === "Not Resolved"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4">{t.agentResponse}</td>
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === t.id ? null : t.id);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  {openMenuId === t.id && (
                    <div
                      className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleEdit(t)}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <PencilIcon className="h-4 w-4 text-gray-600" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-500"
                      >
                        <TrashIcon className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

          </table>
        </div>
      </div>

      {/* ✅ Edit Modal */}
      {isEditModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Ticket</h2>
            <input
              type="text"
              value={selectedTicket.title}
              onChange={(e) =>
                setSelectedTicket({ ...selectedTicket, title: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded"
              placeholder="Title"
            />
            <textarea
              value={selectedTicket.description}
              onChange={(e) =>
                setSelectedTicket({ ...selectedTicket, description: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded"
              placeholder="Description"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

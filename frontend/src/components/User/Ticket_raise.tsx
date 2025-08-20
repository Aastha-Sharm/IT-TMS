import React, { useState, useRef } from "react";

const TicketForm: React.FC = () => {
  const [type, setType] = useState<string>("Service");
  const [category, setCategory] = useState<string>("");
  const [priority, setPriority] = useState<string>("Low");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const serviceCategories: string[] = [
    "Network Issue",
    "Software Installation",
    "Email Support",
  ];
  const assetCategories: string[] = ["Laptop", "Printer", "Mobile Device"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://127.0.0.1:8000/tickets/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          category,
          priority,
          title,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }

      const data = await response.json();
      console.log("Ticket created:", data);
      alert("Ticket submitted successfully!");

      // reset form
      setType("Service");
      setCategory("");
      setPriority("Low");
      setTitle("");
      setDescription("");
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      alert("Error creating ticket");
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (newFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const inputClasses =
    "w-full border bg-blue-50 border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200";
  const labelClasses = "block text-gray-700 font-semibold mb-1 ";
  const optionClasses = "bg-gray-50"

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-4xl h-12 font-bold text-center text-black-500 mb-8  bg-clip-text drop-shadow-xl tracking-wide">   
        Create New Ticket
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Type */}
        <div>
          <label className={labelClasses}>Type *</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setCategory("");
            }}
            className={inputClasses}
          >
            <option className={optionClasses} value="Service">Service</option>
            <option className={optionClasses} value="Asset">Asset</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className={labelClasses}>Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClasses}
          >
            
            {(type === "Service" ? serviceCategories : assetCategories).map(
              (cat) => (
                <option className={optionClasses} key={cat} value={cat}>
                  {cat}
                </option>
              )
            )}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className={labelClasses}>Priority *</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={inputClasses}
          >
            <option className={optionClasses} value="Low">Low</option>
            <option className={optionClasses} value="Medium">Medium</option>
            <option className={optionClasses} value="High">High</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className={labelClasses}>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter ticket title"
            className={inputClasses}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className={labelClasses}>Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue or request in detail..."
            rows={4}
            className={`${inputClasses} rounded-lg`}
          />
        </div>

        {/* Attachments (ignored in backend for now) */}
        <div className="md:col-span-2">
          <label className={labelClasses}>Attachments</label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) =>
              setFiles((prev) =>
                e.target.files
                  ? [...prev, ...Array.from(e.target.files)]
                  : prev
              )
            }
            className={`${inputClasses} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-50`}
          />

          {/* Display selected files */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((f, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm"
                >
                  <span className="text-sm text-gray-700 truncate max-w-xs">
                    {f.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 text-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-full shadow-md font-medium transition duration-200"
          >
            Submit Ticket
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;

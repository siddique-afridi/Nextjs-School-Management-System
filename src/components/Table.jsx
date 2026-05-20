import React, { useState } from "react";

function Table({ data=[], columns, onDelete, rowsPerPage = 5, onView }) {

   if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-gray-500 text-center mt-4">No results found</p>;
  }

  const [currentPage, setCurrentPage] = useState(1);

  // Total pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Paginated data
  const startIndex = (currentPage - 1) * rowsPerPage;
  // math.min accepts 2 or more arguments and returns smallest>> here it is used to prevent going beyond total pages length
  const endIndex = Math.min(startIndex + rowsPerPage, data.length);
  const paginatedData = data.slice(startIndex, endIndex);

  // Page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // for generating page numbers
  function PageNumbers({ totalPages, currentPage, handlePageChange }) {
    const pageButtons = [];

    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 border rounded ${
            currentPage === i ? "bg-blue-600 text-white" : "hover:bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    return <div className="flex gap-2">{pageButtons}</div>;
  }

  return (
    <div className="w-full">
      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="py-3 px-4 text-left font-medium">
                  {col.label}
                </th>
              ))}
              <th className="py-3 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={item._id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-4">
                      {Array.isArray(item[col.key])
                        ? item[col.key].map((course) => course.name).join(", ")
                        : typeof item[col.key] === "object" &&
                          item[col.key] !== null
                        ? item[col.key].name || "N/A"
                        : item[col.key]}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onView(item)}
                      className="mr-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="px-3 py-1 border border-gray-300 text-gray-600 rounded-md hover:border-red-500 hover:text-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-6 text-center text-gray-500 italic"
                >
                  No records available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages >= 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
          {/* Row info */}
          <span className="text-sm text-gray-600">
            Showing <b>{startIndex + 1}</b>–<b>{endIndex}</b> of{" "}
            <b>{data.length}</b> records
          </span>

          {/* Page info + controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-200 cursor-pointer"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1  ${
                  currentPage === i + 1
                    ? " bg-blue-600 cursor-pointer text-white border rounded-xl"
                    : "hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-200 cursor-pointer"
            >
              Next
            </button>

            {/* Page info */}
            <span className="text-sm text-gray-600 ml-2">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;

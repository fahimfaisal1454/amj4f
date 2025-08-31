import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
 import AxiosInstance from "../AxiosInstance/AxiosInstance";

const NoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  // Import AxiosInstance at the top of your file
  // import AxiosInstance from "../AxiosInstance/AxiosInstance";

  useEffect(() => {
    fetchNotices();
  }, [currentPage, searchTerm]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get("notices/", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm
        }
      });
      
      // Debug line - check your API response structure
      console.log("API Response:", res.data);
      
      // Handle different API response structures
      let results = [];
      let totalCount = 0;
      
      if (Array.isArray(res.data)) {
        // If API returns direct array
        results = res.data;
        totalCount = res.data.length;
      } else if (res.data?.results && Array.isArray(res.data.results)) {
        // If API returns paginated response with results array
        results = res.data.results;
        totalCount = res.data.count || res.data.total || res.data.results.length;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        // If API returns response with data array
        results = res.data.data;
        totalCount = res.data.count || res.data.total || res.data.data.length;
      } else {
        console.warn("Unexpected API response structure:", res.data);
        results = [];
        totalCount = 0;
      }
      
      setNotices(results);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
      
    } catch (err) {
      console.error("Error fetching notices:", err);
      setNotices([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className=" max-w-7xl mx-auto min-h-screen py-8">
      <div className="">
        <h2 className="text-3xl text-center font-bold my-2 text-gray-800 mb-4">নোটিশ</h2>

        {/* Search Box */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Title..."
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 p-2 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">SI</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Title</th>
                  <th className="px-4 py-3 text-center font-semibold">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500 mr-2"></div>
                        Loading...
                      </div>
                    </td>
                  </tr>
                ) : notices.length > 0 ? (
                  notices.map((notice, index) => (
                    <tr key={notice.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {notice.date
                          ? new Date(notice.date).toLocaleDateString('en-GB')
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="line-clamp-2">
                          {notice.title || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {notice.pdf_file ? (
                          <a
                            href={notice.pdf_file}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-red-500 hover:text-red-700 transition-colors"
                            title="Download PDF"
                          >
                            <FaFilePdf size={20} />
                          </a>
                        ) : (
                          <span className="text-gray-400">No File</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-6xl text-gray-300 mb-4">📋</div>
                        <div className="text-lg font-medium">No notices found</div>
                        <div className="text-sm">Try adjusting your search terms</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === pageNumber
                      ? "bg-amber-500 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticePage;
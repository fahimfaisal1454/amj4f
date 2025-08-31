import { useEffect, useState } from "react";
import AxiosInstance from "../AxiosInstance/AxiosInstance";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await AxiosInstance.get("notices/");
        setNotices(response.data || []);
      } catch (error) {
        console.error("Error fetching notices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Sort by date and get latest 5
  const latestNotices = [...notices]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm mt-3 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Top header with image & heading */}
        <div className="flex items-center  mb-4 border-b border-gray-200 pb-2">
          <img
            src="/notice.png"
            alt="Notice"
            className="w-30 h-16 "
          />
          <h2 className="text-lg  font-semibold text-black">
            সাম্প্রতিক নোটিশ
          </h2>
        </div>

        {/* Notices list */}
        {notices.length === 0 ? (
          <div className="text-center py-4 text-black">
            কোন নোটিশ পাওয়া যায়নি
          </div>
        ) : (
          <>
            <ul>
              {latestNotices.map((notice) => (
                <li
                  key={notice.id}
                  className="hover:bg-amber-50 rounded transition-colors border-b-2 border-gray-100 cursor-pointer p-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {/* Amber triangle bullet */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-amber-500 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 4l8 6-8 6V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="text-gray-700 text-md">
                        {notice.title || "নোটিশ"}
                      </div>
                    </div>

                
                  </div>
                </li>
              ))}
            </ul>

            {/* "সকল" button if more than 5 notices */}
            {notices.length > 5 && (
              <div className="flex justify-start mt-3">
                <button
                  onClick={() => navigate("/notices")}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1 rounded text-sm transition-colors"
                >
                  সকল
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notices;

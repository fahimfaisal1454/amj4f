import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import AxiosInstance from "../AxiosInstance/AxiosInstance";

const LatestNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const latestNotices = [...notices]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  // Format date to display as DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-2">
      <div className="max-w-7xl mx-auto">
        <div className="rounded">
          <div className="flex items-center">
            <span className="font-semibold text-amber-500 text-md px-4 whitespace-nowrap">
              Latest Notices
            </span>
            <Marquee speed={50} pauseOnHover gradient={false}>
              {latestNotices.map((notice) => (
                <div 
                  key={notice.id} 
                  className="flex items-center mx-6 px-3 rounded"
                >
                  <span className="text-amber-500 font-medium mr-2">
                    {formatDate(notice.date)}
                  </span>
                  <span className="text-black font-medium">
                    {notice.title || "Notice"}
                  </span>
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestNotices;
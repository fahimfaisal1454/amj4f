import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { MdSettings, MdExpandMore, MdExpandLess } from "react-icons/md";
import { PiBuildingsDuotone } from "react-icons/pi";
import { FiPhone } from "react-icons/fi";
import { FaImages, FaUserTie, FaUserGraduate } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { BsClipboardData } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUniversity } from "react-icons/fa";
import AxiosInstance from "../AxiosInstance/AxiosInstance";
import { useUser } from "../../Providers/UserProvider";
import { RiLockPasswordFill } from "react-icons/ri";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [siteMenuOpen, setSiteMenuOpen] = useState(false);
  const [defaultMenuOpen, setDefaultMenuOpen] = useState(false);
  const [institutionInfo, setInstitutionInfo] = useState(null);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const { signOut } = useUser();

  const handleLogout = () => {
    signOut();
    window.location.href = "/login";
  };

  const fetchInstitutionInfo = async () => {
    try {
      const res = await AxiosInstance.get("institutions/");
      if (res.data.length > 0) {
        setInstitutionInfo(res.data[0]);
      }
      console.log("Institution info fetched:", res.data);
    } catch (error) {
      console.error("Error fetching institution info:", error);
    }
  };

  useEffect(() => {
    fetchInstitutionInfo();
  }, []);

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
      isActive ? "bg-amber-700" : "hover:bg-amber-600"
    } text-white ${collapsed ? "justify-center text-base px-1" : ""}`;

  return (
    <aside
      className={`min-h-screen bg-amber-500 text-white flex flex-col ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
    >
      {/* 🟦 Top Section */}
      <div className="relative">
        <div className="flex items-center px-4 py-4">
          <Link to="/">
            <img
              src={institutionInfo?.logo || "/image.png"}
              className={`object-cover rounded-full transition-all duration-300 ${
                collapsed ? "w-10 h-10" : "w-12 h-12"
              }`}
            />
          </Link>
        </div>
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white text-amber-600 rounded-full shadow-md border border-amber-200 hover:bg-amber-100 w-6 h-6 flex items-center justify-center"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* 🟦 Middle Section */}
      <div className="flex-grow px-2 overflow-auto space-y-1">
        {/* 🔹 Site Config Menu */}
        <div>
          <button
            onClick={() => setSiteMenuOpen(!siteMenuOpen)}
            className="flex gap-3  w-full px-3 py-2 text-white rounded-md hover:bg-amber-600"
            title="সাইট কনফিগারেশন"
          >
            <MdSettings className="text-xl" />
            {!collapsed && <span className="">সাইট কনফিগারেশন</span>}
            {!collapsed && (
              <span className="ml-auto">
                {siteMenuOpen ? <MdExpandLess /> : <MdExpandMore />}
              </span>
            )}
          </button>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              siteMenuOpen ? "max-h-[500px]" : "max-h-0"
            } ${collapsed ? "pl-0" : "pl-4"}`}
          >
            <NavLink to="/dashboard/college-info" className={navLinkStyle}>
              <PiBuildingsDuotone className="text-lg" />
              {!collapsed && "কলেজ তথ্য"}
            </NavLink>
            <NavLink to="/dashboard/contacts" className={navLinkStyle}>
              <FiPhone className="text-lg" />
              {!collapsed && "যোগাযোগ"}
            </NavLink>
            <NavLink to="/dashboard/principal-info" className={navLinkStyle}>
              <FaUserTie className="text-lg" />
              {!collapsed && "অধ্যক্ষ/উপাধ্যক্ষ"}
            </NavLink>

            <NavLink to="/dashboard/committee-member" className={navLinkStyle}>
              <FaUserTie className="text-lg" />
              {!collapsed && "কমিটি সদস্য"}
            </NavLink>

            <NavLink to="/dashboard/gallery-upload" className={navLinkStyle}>
              <FaImages className="text-lg" />
              {!collapsed && "গ্যালারি ছবি"}
            </NavLink>

            <NavLink to="/dashboard/add-class" className={navLinkStyle}>
              <FaImages className="text-lg" />
              {!collapsed && "শ্রেণি যোগ করুন"}
            </NavLink>

            <NavLink to="/dashboard/add-subject" className={navLinkStyle}>
              <FaImages className="text-lg" />
              {!collapsed && "বিষয় যোগ করুন"}
            </NavLink>
          </div>
        </div>

        {/* 🔹 Notice Link */}
        <NavLink to="/dashboard/notice-upload" className={navLinkStyle}>
          <BsClipboardData className="text-lg" />
          {!collapsed && "নোটিশ"}
        </NavLink>

        {/* 🔹 Default Menu */}
        <div>
          <button
            onClick={() => setDefaultMenuOpen(!defaultMenuOpen)}
            className="flex gap-3 w-full px-3 py-2 text-white rounded-md hover:bg-amber-600"
            title="ডিফল্ট"
          >
            <MdSettings className="text-xl" />
            {!collapsed && <span className="">ডিফল্ট</span>}
            {!collapsed && (
              <span className="ml-auto">
                {defaultMenuOpen ? <MdExpandLess /> : <MdExpandMore />}
              </span>
            )}
          </button>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              defaultMenuOpen ? "max-h-[500px]" : "max-h-0"
            } ${collapsed ? "pl-0" : "pl-4"}`}
          >
            <NavLink to="/dashboard/student-info-form" className={navLinkStyle}>
              <FaUserGraduate className="text-lg" />
              {!collapsed && "শিক্ষার্থীর তথ্য "}
            </NavLink>
            <NavLink to="/dashboard/teacher-info-form" className={navLinkStyle}>
              <FaChalkboardTeacher className="text-lg" />
              {!collapsed && "শিক্ষকের তথ্য"}
            </NavLink>
            <NavLink to="/dashboard/staff-info-form" className={navLinkStyle}>
              <RiTeamFill className="text-lg" />
              {!collapsed && "কর্মচারীর তথ্য"}
            </NavLink>
          </div>
        </div>

        <div>
          <button
            onClick={() => setDefaultMenuOpen(!defaultMenuOpen)}
            className="flex gap-3 w-full px-3 py-2 text-white rounded-md hover:bg-amber-600"
            title="একাডেমিক"
          >
            <FaUniversity className="text-xl" />
            {!collapsed && <span className="">একাডেমিক</span>}
            {!collapsed && (
              <span className="ml-auto">
                {defaultMenuOpen ? <MdExpandLess /> : <MdExpandMore />}
              </span>
            )}
          </button>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              defaultMenuOpen ? "max-h-[500px]" : "max-h-0"
            } ${collapsed ? "pl-0" : "pl-4"}`}
          >
            <NavLink
              to="/dashboard/upload-class-routine"
              className={navLinkStyle}
            >
              <FaRegCalendarAlt className="text-lg" />
              {!collapsed && "ক্লাস রুটিন "}
            </NavLink>
          </div>
        </div>
      </div>

      {/* 🟦 Bottom Section */}
      <div className="px-2 py-4 border-t border-amber-700">
        <NavLink to="/" className={navLinkStyle}>
          <AiFillHome className="text-lg" />
          {!collapsed && "হোম"}
        </NavLink>

        {/* Change Password Link */}
        <NavLink
          to="/dashboard/change-password"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 w-full rounded-md hover:bg-amber-600 transition-all duration-200 ${
              collapsed ? "justify-center" : ""
            } ${isActive ? "bg-amber-700" : ""}`
          }
          title="পাসওয়ার্ড পরিবর্তন"
        >
          <RiLockPasswordFill className="text-lg" />
          {!collapsed && <span>পাসওয়ার্ড পরিবর্তন</span>}
        </NavLink>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 px-3 py-2 w-full rounded-md hover:bg-amber-600 transition-all duration-200 ${
            collapsed ? "justify-center" : ""
          }`}
          title="লগআউট"
        >
          <IoIosLogOut className="text-lg" />
          {!collapsed && <span>লগআউট</span>}
        </button>
      </div>
    </aside>
  );
}

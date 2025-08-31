import React from "react";

const Links = () => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1  gap-6 ">
      {/* Our Services */}
      <div>
        <h2 className="bg-amber-500 text-white px-3 py-2 font-semibold">
          Our Services
        </h2>
        <ul className="mt-2 space-y-1 text-gray-700 ">
          {[
            "Internal Exam Result",
            "XI Admission",
            "XI Admission Form",
            "Online Payment",
          ].map((item, idx) => (
            <li
              key={idx}
              className="border-b-2 py-1 border-b-gray-200 flex items-center space-x-2"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Important Links */}
      <div>
        <h2 className="bg-amber-500 text-white px-3 py-2 font-semibold">
          Important Links
        </h2>
        <ul className="mt-2 space-y-1 text-gray-700">
          {[
            { name: "Education Ministry", link: "http://www.moedu.gov.bd/" },
            {
              name: "Directorate of Secondary and Higher Education",
              link: "https://dshe.gov.bd/",
            },
            {
              name: "National Curriculum and Textbook Board",
              link: "https://nctb.gov.bd/",
            },
            { name: "Jashore Board", link: "https://www.jessoreboard.gov.bd/" },
            {
              name: "Education Board Results",
              link: "http://www.educationboardresults.gov.bd/",
            },
            { name: "National University", link: "http://www.nu.edu.bd/" },
            {
              name: "National University Results",
              link: "http://www.nu.edu.bd/results",
            },
            {
              name: "National Web Portal",
              link: "http://bangladesh.portal.gov.bd/",
            },
            {
              name: "Online News Papers",
              link: "https://www.onlinenewspapers.com/bangladesh.shtml",
            },
            { name: "Bangla Library", link: "https://www.ebanglalibrary.com/" },
          ].map((item, idx) => (
            <li
              key={idx}
              className="border-b-2 py-1 border-b-gray-200 flex items-center space-x-2"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold">
                ✓
              </span>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-amber-500 transition-colors"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Social Media */}
      <div>
        <h2 className="bg-amber-500 text-white px-3 py-2 font-semibold">
          Find Us in Social Media
        </h2>
        <ul className="mt-2 space-y-1">
          {[
            {
              name: "Facebook Id",
              link: "https://www.facebook.com/Jashore.Government.CityCollege/",
            },
            {
              name: "Facebook Page",
              link: "https://www.facebook.com/Jashore.Government.CityCollege/",
            },
            {
              name: "Facebook Group",
              link: "https://www.facebook.com/Jashore.Government.CityCollege/",
            },
          ].map((item, idx) => (
            <li
              key={idx}
              className="border-b-2 py-1 border-b-gray-200 flex items-center space-x-2"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold">
                ✓
              </span>
              <a
                href={item.link}
                className="text-gray-700 hover:text-amber-500 transition-colors"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Links;

import React, { useEffect, useState } from "react";
import AxiosInstance from "../Components/AxiosInstance/AxiosInstance";

const About = () => {
  const [institution, setInstitution] = useState(null);

  useEffect(() => {
    const fetchInstitutionData = async () => {
      try {
        const response = await AxiosInstance.get("institutions/");
        if (response.data.length > 0) {
          setInstitution(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching institution data:", error);
      }
    };

    fetchInstitutionData();
  }, []);

  // Default institution data with shorter history
  const defaultInstitution = {
    name: "",
    government_approval_number: "",
    government_approval_date: "",
    history: ``,
    address: "",
    address_code: "",
    contact_email: "",
    contact_phone: "",

    institution_image: "",
  };

  const currentInstitution = institution || defaultInstitution;

  return (
    <div className="max-w-7xl mx-auto py-8  rounded-lg">
      {/* School Header */}
      <div className="text-center ">
        <h1 className="text-2xl font-bold text-black mb-4">
          {currentInstitution.name}
        </h1>
      </div>

      {/* School Info with Side Image */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* School Image - Side */}
        <div className="w-full md:w-1/3">
          <div className="bg-amber-200 rounded-lg flex items-center justify-center h-full">
            <img
              className="p-4 max-h-80 object-contain"
              src={currentInstitution.institution_image}
              alt="কলেজের ছবি"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/college.jpeg";
              }}
            />
          </div>
        </div>

        {/* School Details */}
        <div className="flex-1">
          {/* Key Information */}
          <div className="bg-amber-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-amber-700 mb-3">
              প্রধান তথ্যাবলী
            </h2>
            <ul className="space-y-2">
              <li className="flex">
                <span className="font-medium w-32">প্রতিষ্ঠার সাল:</span>
                <span>
                  {new Date(
                    currentInstitution.government_approval_date
                  ).getFullYear()}
                </span>
              </li>
              <li className="flex">
                <span className="font-medium w-32">অনুমোদন নম্বর:</span>
                <span>{currentInstitution.government_approval_number}</span>
              </li>
              <li className="flex">
                <span className="font-medium w-32">EIIN নম্বর:</span>
                <span>{currentInstitution.address_code}</span>
              </li>
              <li className="flex">
                <span className="font-medium w-32">ইমেইল:</span>
                <span>{currentInstitution.contact_email}</span>
              </li>
              <li className="flex">
                <span className="font-medium w-32">মোবাইল:</span>
                <span>{currentInstitution.contact_phone}</span>
              </li>
              <li className="flex">
                <span className="font-medium w-32">ঠিকানা:</span>
                <span>{currentInstitution.address}</span>
              </li>
            </ul>
          </div>

          {/* Contact Buttons */}
          <div className="flex flex-wrap gap-4 mb-4">
            <a
              href={`tel:${currentInstitution.contact_phone
                .split(",")[0]
                .trim()}`}
              className="flex items-center bg-amber-100 px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors"
            >
              <span className="mr-2">📞</span>
              <span>কল করুন</span>
            </a>
            <a
              href={`mailto:${currentInstitution.contact_email}`}
              className="flex items-center bg-amber-100 px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors"
            >
              <span className="mr-2">✉️</span>
              <span>ইমেইল করুন</span>
            </a>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-black mb-4 border-b pb-2">
          প্রতিষ্ঠানের ইতিহাস
        </h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {currentInstitution.history}
        </p>
      </div>

    
    </div>
  );
};

export default About;

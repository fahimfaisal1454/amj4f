import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../AxiosInstance/AxiosInstance";

const PrincipalSection = () => {
  const navigate = useNavigate();
  const [principal, setPrincipal] = useState(null);
  const [vicePrincipal, setVicePrincipal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("principal-vice-principal/");
        const data = response.data;

        const principalData = data.find(
          (person) => person.designation === "principal"
        );
        const vicePrincipalData = data.find(
          (person) => person.designation === "vice_principal"
        );

        setPrincipal(principalData || null);
        setVicePrincipal(vicePrincipalData || null);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDetailsClick = (person, type) => {
    if (person) {
      navigate(`/${type}`, { state: { person } });
    }
  };

  const renderCard = (person, type) => (
    <div className="max-w-7xl mx-auto   border-amber-400">
      {/* Card Content */}
      <div className="border border-gray-200 border-t-4 border-t-amber-400 rounded-lg shadow-sm p-4 bg-white flex flex-col items-center">
        {/* Photo */}
        <div className="w-32 h-40 rounded-full overflow-hidden shadow-md mb-3">
          {person?.photo ? (
            <img
              src={person.photo}
              alt={person.full_name || type}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-black">
              ছবি নেই
            </div>
          )}
        </div>

        {/* Designation */}
        <p className="text-sm font-semibold text-gray-600 mb-1">
          {type === "principal" ? "Principal" : "Vice Principal"}
        </p>

        {/* Name */}
        <h3 className="text-base text-gray-800 font-medium">
          {person?.full_name || "শূন্য পদ"}
          {person && (
            <span
              className="text-amber-600 underline cursor-pointer ml-1"
              onClick={() => handleDetailsClick(person, type)}
            >
           
            </span>
          )}
        </h3>
      </div>
    </div>
  );

  return (
    <section className="my-3 bg-white py-2 space-y-6">
      {renderCard(principal, "principal")}
      {renderCard(vicePrincipal, "vice_principal")}
    </section>
  );
};

export default PrincipalSection;

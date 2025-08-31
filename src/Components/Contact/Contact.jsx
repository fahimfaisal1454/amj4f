import React, { useState, useEffect } from "react";
import AxiosInstance from "../AxiosInstance/AxiosInstance";
import { MdEmail, MdPhone } from "react-icons/md";

const Contact = () => {
  const [contactData, setContactData] = useState(null);
  const [isLoadingContact, setIsLoadingContact] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const res = await AxiosInstance.get("institutions/");
        if (res.status === 200 && res.data && res.data.length > 0) {
          setContactData(res.data[0]);
        } else {
          setContactData(null);
        }
      } catch (err) {
        console.error("Failed to fetch contact data:", err);
        setContactData(null);
      } finally {
        setIsLoadingContact(false);
      }
    };
    fetchContactData();
  }, []);

  useEffect(() => {
    let timer;
    if (submitStatus === "success") {
      timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [submitStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await AxiosInstance.post("contacts/", formData);

      if (response.status === 200 || response.status === 201) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Default fallback data if no API data
  const fallbackData = {
    address: "Jashore, Bangladesh",
    contact_email: "monir@gmail.com",
    contact_phone: "01790790798",
  };

  const dataToShow = contactData || fallbackData;

  return (
    <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side contact info */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
          <h2 className="text-2xl font-semibold mb-6 text-black flex items-center gap-2">
            যোগাযোগের তথ্য
          </h2>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-3 text-lg">
              <MdEmail className="text-amber-500" />
              <span>
                <strong>ইমেইল:</strong> {dataToShow.contact_email || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-3 text-lg">
              <MdPhone className="text-amber-500" />
              <span>
                <strong>ফোন:</strong> {dataToShow.contact_phone || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-3 text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z"
                />
              </svg>
              <span>
                <strong>ঠিকানা:</strong> {dataToShow.address || "N/A"}
              </span>
            </div>
          </div>

          <div className="mt-6 rounded overflow-hidden shadow-lg">
            {/* Google Maps iframe with Jashore Govt City College */}

            <iframe
              title="Jessore Govt City College and Monihar Bus Stand Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.338731466288!2d89.16134851503182!3d23.168544796731096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f9bf0fbb7e8ff5%3A0x5388104aa1a1475f!2sJessore%20Govt%20City%20College!5e0!3m2!1sen!2sbd!4v1691565400000!5m2!1sen!2sbd"
              width="100%"
              height="250"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0"
            />
          </div>
        </div>

        {/* Right side form */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Header */}
          <h2 className="text-2xl font-semibold mb-6 text-center text-black">
            আপনার মতামত লিখুন
          </h2>

          {submitStatus === "success" && (
            <div className="mb-4 px-3 py-2 bg-green-100 text-green-800 rounded-md text-center">
              আপনার বার্তা সফলভাবে পাঠানো হয়েছে!
            </div>
          )}
          {submitStatus === "error" && (
            <div className="mb-4 px-3 py-2 bg-red-100 text-red-800 rounded-md text-center">
              বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Each input row: label + input side by side */}
            <div className="flex items-center gap-4">
              <label
                htmlFor="name"
                className="w-1/3 text-sm font-medium text-gray-700"
              >
                আপনার নাম
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              <label
                htmlFor="email"
                className="w-1/3 text-sm font-medium text-gray-700"
              >
                আপনার ইমেইল
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              <label
                htmlFor="phone"
                className="w-1/3 text-sm font-medium text-gray-700"
              >
                ফোন নম্বর
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              <label
                htmlFor="address"
                className="w-1/3 text-sm font-medium text-gray-700"
              >
                ঠিকানা
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="flex items-start gap-4">
              <label
                htmlFor="message"
                className="w-1/3 text-sm font-medium text-gray-700 pt-2"
              >
                আপনার মতামত
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-y"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md text-white ${
                  isSubmitting
                    ? "bg-amber-300 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600"
                } transition-colors`}
              >
                {isSubmitting ? "পাঠানো হচ্ছে..." : "পাঠান"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

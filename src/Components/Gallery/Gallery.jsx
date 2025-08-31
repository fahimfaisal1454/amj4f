import React, { useEffect, useState } from "react";
import AxiosInstance from "../AxiosInstance/AxiosInstance";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [visibleCount, setVisibleCount] = useState(2)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await AxiosInstance.get("gallery/");
        setPhotos(res.data);
      } catch (error) {
        console.error("Error loading gallery:", error);
      }
    };
    fetchGallery();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  const handleShowLess = () => {
    setVisibleCount(4);
  };

  return (
    <div className="bg-white py-4">
      <div className="max-w-6xl mx-auto">
        {/* Gallery Grid */}
        {photos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              {photos.slice(0, visibleCount).map((photo, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border border-gray-300 h-64 flex items-center justify-center bg-gray-100 cursor-pointer"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setSelectedImage(photo)}
                >
                  <img
                    src={photo.image}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    className={`absolute inset-0 bg-black/30 flex items-end p-4 transition-opacity duration-300 ${
                      hoveredCard === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <p className="text-white font-medium text-sm">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-3 mt-4">
              {visibleCount < photos.length && (
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
                >
                  Load More
                </button>
              )}
              {visibleCount > 4 && (
                <button
                  onClick={handleShowLess}
                  className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
                >
                  Show Less
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-black">No photos available in the gallery</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-amber-400"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="max-h-[70vh] overflow-hidden rounded-lg">
              <img
                src={selectedImage.image}
                alt={selectedImage.caption}
                className="w-full object-contain"
                style={{ maxHeight: "70vh" }}
              />
            </div>
            <div className="mt-2 text-center text-white">
              <p className="text-sm">{selectedImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

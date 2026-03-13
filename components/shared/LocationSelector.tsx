"use client";

import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown, Search, ArrowLeft } from "lucide-react";
import { getUniversities } from "@/services/universityService";
import { UniversityResponse } from "@/types/admin";

interface LocationSelectorProps {
  selectedSchool: string;
  setSelectedSchool: (value: string) => void;
  selectedCampus: string;
  setSelectedCampus: (value: string) => void;
  variant: "hero" | "sticky";
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  selectedSchool, 
  setSelectedSchool, 
  selectedCampus, 
  setSelectedCampus,
  variant 
}) => {
  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationView, setLocationView] = useState<"main" | "school" | "campus">("main");
  const [locationSearch, setLocationSearch] = useState("");

  // Fetch universities from API
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await getUniversities();
        setUniversities(data);
      } catch (error) {
        console.error("Failed to fetch universities:", error);
      }
    };
    fetchUniversities();
  }, []);

  const isHero = variant === "hero";

  return (
    <div className="relative h-full shrink-0">
      {/* Trigger Button */}
      <button 
        onClick={() => {
          setIsLocationOpen(!isLocationOpen);
          setLocationView("main");
          setLocationSearch("");
        }}
        className={isHero 
          ? "hidden sm:flex items-center gap-1 px-4 h-12 text-gray-600 hover:text-emerald-600 font-heading font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer"
          : "hidden sm:flex items-center gap-1 px-3 h-full border-r border-gray-100 hover:bg-gray-50 rounded-l-lg transition-colors group shrink-0 cursor-pointer"
        }
      >
        <MapPin size={isHero ? 16 : 16} className={!isHero ? "text-emerald-600 group-hover:scale-110 transition-transform" : ""} />
        <span className={isHero ? "max-w-37.5 truncate" : "text-sm font-heading font-bold text-gray-700 whitespace-nowrap max-w-30 truncate"}>
          {selectedCampus || selectedSchool}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isLocationOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Content */}
      {isLocationOpen && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsLocationOpen(false)}
          ></div>
          
          <div className={isHero
            ? "absolute top-full right-0 w-80 bg-white shadow-2xl rounded-xl mt-2 overflow-hidden border border-gray-100 z-40 animate-in fade-in zoom-in-95 duration-200"
            : "absolute top-[calc(100%+8px)] left-0 w-75 bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 z-40 animate-in fade-in zoom-in-95 duration-200"
          }>
            
            {/* VIEW: MAIN (Hai ô chọn) */}
            {locationView === "main" && (
              <div className={isHero ? "p-5 space-y-5" : "p-4 space-y-4"}>
                <h3 className={`text-center font-bold text-gray-800 ${isHero ? "text-lg" : "text-base"}`}>Khu vực</h3>
                
                <div className={isHero ? "space-y-4" : "space-y-3"}>
                  {/* Field Trường */}
                  <div className="space-y-1">
                    <label className={isHero 
                      ? "text-xs font-heading font-bold text-gray-400 ml-1 uppercase tracking-wider"
                      : "text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider ml-1"
                    }>
                      Chọn trường <span className="text-red-500">*</span>
                    </label>
                    <button 
                      onClick={() => setLocationView("school")}
                      className={`w-full flex items-center justify-between bg-gray-50 border border-gray-100 transition-all text-left group cursor-pointer ${
                        isHero ? "h-12 px-4 rounded-xl hover:border-emerald-500" : "h-10 px-3 rounded-lg hover:border-emerald-500"
                      }`}
                    >
                      <span className={`font-bold text-gray-700 truncate ${isHero ? "text-sm" : "text-xs"}`}>{selectedSchool}</span>
                      <ChevronDown size={isHero ? 16 : 14} className="text-gray-400 group-hover:text-emerald-500" />
                    </button>
                  </div>

                  {/* Field Cơ sở */}
                  <div className="space-y-1">
                    <label className={isHero 
                      ? "text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider"
                      : "text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1"
                    }>
                      Chọn cơ sở
                    </label>
                    <button 
                      onClick={() => setLocationView("campus")}
                      className={`w-full flex items-center justify-between bg-gray-50 border border-gray-100 transition-all text-left group cursor-pointer ${
                        isHero ? "h-12 px-4 rounded-xl hover:border-emerald-500" : "h-10 px-3 rounded-lg hover:border-emerald-500"
                      }`}
                    >
                      <span className={`font-bold truncate ${isHero ? "text-sm" : "text-xs"} ${selectedCampus ? "text-gray-700" : "text-gray-400"}`}>
                        {selectedCampus || (isHero ? "Chọn cơ sở (không bắt buộc)" : "Tất cả cơ sở")}
                      </span>
                      <ChevronDown size={isHero ? 16 : 14} className="text-gray-400 group-hover:text-emerald-500" />
                    </button>
                  </div>

                  <button 
                    onClick={() => setIsLocationOpen(false)}
                    className={`w-full bg-[#FFBA00] hover:bg-[#ffc82a] text-black transition-all cursor-pointer ${
                      isHero ? "h-12 font-black rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95" : "h-10 font-bold text-sm rounded-lg"
                    }`}
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: LIST (Khi đang chọn trường hoặc cơ sở) */}
            {locationView !== "main" && (
              <>
                <div className={`flex items-center justify-between border-b border-gray-100 ${isHero ? "p-4" : "p-3"}`}>
                  <button 
                    onClick={() => setLocationView("main")}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-600 cursor-pointer"
                  >
                    <ArrowLeft size={isHero ? 18 : 16} />
                  </button>
                  <h3 className={`flex-1 text-center font-bold text-gray-800 ${isHero ? "" : "text-sm"}`}>
                    {locationView === "school" ? "Chọn trường" : "Chọn cơ sở"}
                  </h3>
                  <div className={isHero ? "w-8" : "w-8"}></div>
                </div>

                <div className={isHero ? "p-3" : "p-2.5"}>
                  <div className="relative">
                    <Search size={isHero ? 16 : 14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text"
                      autoFocus
                      placeholder={locationView === "school" ? "Tìm trường..." : "Tìm cơ sở..."}
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className={`w-full bg-gray-50 text-gray-700 border-none rounded-full outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
                        isHero ? "h-10 pl-9 pr-3 text-sm" : "h-8 pl-8 pr-3 text-xs"
                      }`}
                    />
                  </div>
                </div>

                <div className={`overflow-y-auto px-2 pb-2 ${isHero ? "max-h-87.5" : "max-h-64"}`}>
                  {locationView === "school" ? (
                    universities
                      .filter(s => (s.shortName || s.universityName).toLowerCase().includes(locationSearch.toLowerCase()))
                      .map(school => {
                        const displayName = school.shortName || school.universityName;
                        return (
                          <button
                            key={school.universityId}
                            onClick={() => {
                              setSelectedSchool(displayName);
                              setSelectedCampus("");
                              setLocationView("main");
                              setLocationSearch("");
                            }}
                            className={`w-full flex items-center justify-between hover:bg-[#b8f3d7]/20 rounded-lg transition-colors group cursor-pointer ${isHero ? "p-3" : "p-2.5"}`}
                          >
                            <span className={`font-semibold ${isHero ? "text-sm" : "text-xs"} ${selectedSchool === displayName ? "text-emerald-600" : "text-gray-700"}`}>
                              {displayName}
                            </span>
                            <div className={`rounded-full border-2 flex items-center justify-center transition-all ${
                              isHero ? "w-5 h-5" : "w-4 h-4"
                            } ${
                              selectedSchool === displayName ? "border-emerald-500 bg-emerald-500" : "border-gray-200"
                            }`}>
                              {selectedSchool === displayName && <div className={`bg-white rounded-full ${isHero ? "w-2 h-2" : "w-1.5 h-1.5"}`}></div>}
                            </div>
                          </button>
                        );
                      })
                  ) : (
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setSelectedCampus("");
                          setLocationView("main");
                        }}
                        className={`w-full flex items-center justify-between hover:bg-[#b8f3d7]/20 rounded-lg transition-colors group bg-emerald-50/30 cursor-pointer ${isHero ? "p-3" : "p-2"}`}
                      >
                        <span className={`font-bold ${isHero ? "text-sm" : "text-[11px]"} ${!selectedCampus ? "text-emerald-700" : "text-gray-500"}`}>
                          Tất cả cơ sở
                        </span>
                        {!selectedCampus && (
                          <div className={`rounded-full border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center ${isHero ? "w-5 h-5" : "w-4 h-4"}`}>
                            <div className={`bg-white rounded-full ${isHero ? "w-2 h-2" : "w-1.5 h-1.5"}`}></div>
                          </div>
                        )}
                      </button>
                      <div className="h-px bg-gray-100 my-2 mx-2"></div>
                      {universities
                        .find(s => (s.shortName || s.universityName) === selectedSchool)
                        ?.campuses
                        .filter(c => c.campusName.toLowerCase().includes(locationSearch.toLowerCase()))
                        .map(campus => (
                          <button
                            key={campus.campusId}
                            onClick={() => {
                              setSelectedCampus(campus.campusName);
                              setLocationView("main");
                              setLocationSearch("");
                            }}
                            className={`w-full flex items-center justify-between hover:bg-[#b8f3d7]/20 rounded-lg transition-colors group cursor-pointer ${isHero ? "p-3" : "p-2.5"}`}
                          >
                            <span className={`font-semibold ${isHero ? "text-sm" : "text-xs"} ${selectedCampus === campus.campusName ? "text-emerald-600" : "text-gray-700"}`}>
                              {campus.campusName}
                            </span>
                            <div className={`rounded-full border-2 flex items-center justify-center transition-all ${
                              isHero ? "w-5 h-5" : "w-4 h-4"
                            } ${
                              selectedCampus === campus.campusName ? "border-emerald-500 bg-emerald-500" : "border-gray-200"
                            }`}>
                              {selectedCampus === campus.campusName && <div className={`bg-white rounded-full ${isHero ? "w-2 h-2" : "w-1.5 h-1.5"}`}></div>}
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LocationSelector;

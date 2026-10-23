import React, { useState, useEffect, useContext, useRef } from "react";
import {
  DollarSign,
  Calendar,
  ArrowRight,
  Briefcase,
  Rocket,
  RefreshCw,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import axios from 'axios';
import server from '../environment.js';
import { useNavigate } from "react-router-dom";
import useInternships from '../stateManage/useInternships.js';
import { toast } from 'react-hot-toast';

const InternshipCard = ({ internship, isTopPick }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`relative p-4 rounded-lg border flex flex-col justify-between
        ${theme === "dark"
          ? "bg-orange-100 border-[#2A2A2A] shadow-sm"
          : "bg-orange-50 border-[#EAEAEA] shadow-md"
        }
        transition-all duration-300 ease-out 
        hover:border-[#FF6900]/70 hover:shadow-md hover:-translate-y-1
      `}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-10 h-10 rounded-md flex items-center justify-center border 
              ${theme === "dark"
                ? "border-[#ff6900] bg-white"
                : "border-orange-200 bg-white"
              }`}
          >
            <span className="text-[#FF6900] text-xl font-poppins font-bold">◆</span>
          </div>
          {isTopPick && (
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-md 
              bg-[#FF690010] text-[#FF6900] border border-[#FF690030]">
              Top Match
            </span>
          )}
        </div>

        {/* Job Info */}
        <h3
          className={`text-lg font-semibold mb-1 ${theme === "dark" ? "text-[#1A1A1A]" : "text-[#1A1A1A]"
            }`}
        >
          {internship.jobTitle}
        </h3>
        <p
          className={`text-sm mb-3 ${theme === "dark" ? "text-[#333333]" : "text-[#555555]"
            }`}
        >
          {internship.company}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {internship.jobTopic.split(",").map((topic, index) => (
            <span
              key={index}
              className={`px-2 py-0.5 rounded-md text-xs
                ${theme === "dark"
                  ? "text-[#1a1a1a] bg-white border border-[#e0e0e0]"
                  : "text-[#1a1a1a] bg-white border border-[#FF690050]"
                }`}
            >
              {topic.trim()}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div
          className={`flex flex-col space-y-2 text-xs mb-4 ${theme === "dark" ? "text-[#444444]" : "text-[#555555]"
            }`}
        >
          <div className="flex items-center">
            <Briefcase size={14} className="mr-2 text-[#FF6900]" />
            <span>
              {internship.jobType} • {internship.duration}
            </span>
          </div>
          <div className="flex items-center">
            <DollarSign size={14} className="mr-2 text-[#FF6900]" />
            <span>
              {internship.stipend === "0" ? "Unpaid" : internship.stipend}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-2 text-[#FF6900]" />
            <span>Apply by {internship.lastDate}</span>
          </div>
          {internship.locationName && (
            <div className="flex items-center">
              <MapPin size={14} className="mr-2 text-[#FF6900]" />
              <span>{internship.locationName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button (fixed bottom) */}
      <Link to={`/internship/${internship._id}`}>
        <button
          className={`w-full py-2.5 text-sm font-medium rounded-md transition-colors duration-300
            ${isTopPick
              ? "bg-[#FF6900] text-white hover:bg-[#e65f00]"
              : "bg-transparent text-[#FF6900] border border-[#FF6900]/50 hover:bg-[#FF6900]/10"
            }`}
        >
          {isTopPick ? "Apply Now" : "View & Apply"}
          <ArrowRight size={14} className="inline-block ml-2" />
        </button>
      </Link>
    </div>
  );
};

// Filter Component
const FilterSection = ({ title, children, isOpen, onToggle, icon: Icon }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`border-b ${theme === "dark" ? "border-[#2A2A2A]" : "border-[#EAEAEA]"}`}>
      <button
        className="w-full py-3 flex justify-between items-center font-medium"
        onClick={onToggle}
      >
        <span className="flex items-center">
          {Icon && <Icon size={16} className="mr-2" />}
          {title}
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && (
        <div className="pb-4">
          {children}
        </div>
      )}
    </div>
  );
};

const InternshipPage = () => {
  const [allInternships, setAllInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { internshipsData, setInternshipsData } = useInternships();
  const navigate = useNavigate();
  const locationDropdownRef = useRef(null);

  const [filters, setFilters] = useState({
    type: [],
    jobType: [],
    duration: [],
    stipend: [],
    location: []
  });

  const [expandedSections, setExpandedSections] = useState({
    type: true,
    jobType: true,
    duration: true,
    stipend: true,
    location: true
  });


  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);

  const filterOptions = {
    type: ["Short Term", "Long Term", "Converting", "Summer", "Semester", "Research"],
    jobType: ["Full Time", "Part Time", "Hybrid", "Onsite", "Remote"],
    duration: ["1 Month", "2 Months", "3 Months", "4 Months", "5 Months", "6 Months", "6+ Months"],
    stipend: ["Unpaid", "₹5K-10K", "₹10K-20K", "₹20K-30K", "₹30K-50K", "₹50K+"]
  };

  useEffect(() => {
    const internshipDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(
          `${server}/internships/get-recomended-internships`,
          { filters },
          { withCredentials: true }
        );

        if (!data.recommend_internships) {
          toast.error("Please complete your profile to access Internships!");
          return navigate("/profilePage");
        }

        const recommend_internships = data.recommend_internships;
        setAllInternships(recommend_internships);
        setFilteredInternships(recommend_internships);
        setInternshipsData(recommend_internships);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    internshipDetails();
  }, []);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const findLocations = async () => {
      try {
        const { data } = await axios.post(
          `${server}/internships/get-locations`,
          { location: locationSearch },
          { withCredentials: true }
        );

        setFilteredLocations(data.locations);
        setShowLocationDropdown(true);
      } catch (err) {
        console.log(err);
      }
    };

    if (locationSearch.length > 1) {
      findLocations();
    } else {
      setFilteredLocations([]);
      setShowLocationDropdown(false);
    }
  }, [locationSearch]);

  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter(item => item !== value);
      } else {
        newFilters[category] = [...newFilters[category], value];
      }
      return newFilters;
    });
  };

  const handleLocationSearch = (e) => {
    setLocationSearch(e.target.value);
  };

  const selectLocation = (location) => {
    setLocationSearch("");
    setShowLocationDropdown(false);

    if (!filters.location.includes(location)) {
      setFilters(prev => ({
        ...prev,
        location: [...prev.location, location]
      }));
    }
  };

  const clearAllFilters = () => {
    console.log(filters);
    setFilters({
      type: [],
      jobType: [],
      duration: [],
      stipend: [],
      location: []
    });
    console.log("All filters cleared");
  };

  const toggleFilterSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const topInternships = filteredInternships.slice(0, 3);
  const otherInternships = filteredInternships.slice(3);

  const handleResuggest = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/internships/get-recomended-internships`,
        { filters },
        { withCredentials: true }
      );

      if (!data.recommend_internships) {
        toast.error("Please complete your profile to access Internships!");
        return navigate("/profilePage");
      }

      const recommend_internships = data.recommend_internships;
      setAllInternships(recommend_internships);
      setFilteredInternships(recommend_internships);
      setInternshipsData(recommend_internships);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).reduce(
    (total, current) => total + current.length, 0
  );

  return (
    <div
      className={`min-h-screen w-full font-inter overflow-x-hidden transition-colors duration-500
        ${theme === "dark" ? "bg-[#0D0D0D] text-white" : "bg-[#FFFFFF] text-[#1A1A1A]"}`}
    >
      <main className="w-full px-6">
        {/* Header Section */}
        <section className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-poppins">
            Find Your <span className="text-[#FF6900]">Next Opportunity</span>
          </h1>
          <p
            className={`text-base md:text-lg max-w-xl mx-auto ${theme === "dark" ? "text-[#CCCCCC]" : "text-[#555555]"
              }`}
          >
            Our intelligent system curates the best internships, tailored to
            your unique skills and aspirations.
          </p>

          {/* Filter and Resuggest Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-2.5 rounded-md font-medium 
                bg-white text-[#1A1A1A] border border-[#EAEAEA] hover:bg-gray-50
                transition-colors duration-300 flex items-center justify-center relative"
            >
              <Filter size={16} className="mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF6900] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button
              onClick={handleResuggest}
              className="px-6 py-2.5 rounded-md font-medium 
                bg-[#FF6900] text-white hover:bg-[#e65f00] 
                transition-colors duration-300 flex items-center justify-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Resuggest Internships
            </button>
          </div>
        </section>

        {/* Main Content with Filters */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - shown on desktop always, mobile when toggled */}
          {(showFilters || window.innerWidth >= 1024) && (
            <div className={`lg:w-1/4 mb-8 lg:mb-0 rounded-lg p-5 
              ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-white border border-[#EAEAEA] shadow-sm"}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center">
                  <Filter size={18} className="mr-2" />
                  Filters
                </h3>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <span className="text-xs text-gray-500">
                      {activeFilterCount} active
                    </span>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-[#FF6900] hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              </div>

              {/* Type Filter */}
              <FilterSection
                title="Type"
                isOpen={expandedSections.type}
                onToggle={() => toggleFilterSection("type")}
              >
                {filterOptions.type.map(option => (
                  <div key={option} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`type-${option}`}
                      checked={filters.type.includes(option)}
                      onChange={() => handleFilterChange("type", option)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-[#FF6900] focus:ring-[#FF6900]"
                    />
                    <label htmlFor={`type-${option}`} className="text-sm">
                      {option}
                    </label>
                  </div>
                ))}
              </FilterSection>

              {/* Job Type Filter */}
              <FilterSection
                title="Job Type"
                isOpen={expandedSections.jobType}
                onToggle={() => toggleFilterSection("jobType")}
                icon={Briefcase}
              >
                {filterOptions.jobType.map(option => (
                  <div key={option} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`jobType-${option}`}
                      checked={filters.jobType.includes(option)}
                      onChange={() => handleFilterChange("jobType", option)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-[#FF6900] focus:ring-[#FF6900]"
                    />
                    <label htmlFor={`jobType-${option}`} className="text-sm">
                      {option}
                    </label>
                  </div>
                ))}
              </FilterSection>

              {/* Duration Filter */}
              <FilterSection
                title="Duration"
                isOpen={expandedSections.duration}
                onToggle={() => toggleFilterSection("duration")}
                icon={Clock}
              >
                {filterOptions.duration.map(option => (
                  <div key={option} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`duration-${option}`}
                      checked={filters.duration.includes(option)}
                      onChange={() => handleFilterChange("duration", option)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-[#FF6900] focus:ring-[#FF6900]"
                    />
                    <label htmlFor={`duration-${option}`} className="text-sm">
                      {option}
                    </label>
                  </div>
                ))}
              </FilterSection>

              {/* Stipend Filter */}
              <FilterSection
                title="Stipend"
                isOpen={expandedSections.stipend}
                onToggle={() => toggleFilterSection("stipend")}
                icon={DollarSign}
              >
                {filterOptions.stipend.map(option => (
                  <div key={option} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`stipend-${option}`}
                      checked={filters.stipend.includes(option)}
                      onChange={() => handleFilterChange("stipend", option)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-[#FF6900] focus:ring-[#FF6900]"
                    />
                    <label htmlFor={`stipend-${option}`} className="text-sm">
                      {option}
                    </label>
                  </div>
                ))}
              </FilterSection>

              {/* Location Filter */}
              <FilterSection
                title="Location"
                isOpen={expandedSections.location}
                onToggle={() => toggleFilterSection("location")}
                icon={MapPin}
              >
                <div className="relative mb-3" ref={locationDropdownRef}>
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={locationSearch}
                    onChange={handleLocationSearch}
                    className={`w-full px-3 py-2 text-sm rounded-md border 
                      ${theme === "dark"
                        ? "bg-[#2A2A2A] border-[#444444] text-white"
                        : "bg-white border-[#EAEAEA] text-[#1A1A1A]"
                      } focus:outline-none focus:ring-1 focus:ring-[#FF6900]`}
                  />

                  {showLocationDropdown && filteredLocations.length > 0 && (
                    <div className={`absolute z-10 w-full mt-1 rounded-md shadow-lg 
                      ${theme === "dark" ? "bg-[#2A2A2A] border border-[#444444]" : "bg-white border border-[#EAEAEA]"}
                      max-h-60 overflow-auto`}>
                      {filteredLocations.map((location, index) => (
                        <div
                          key={index}
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#FF690010] 
                            ${theme === "dark" ? "text-white" : "text-[#1A1A1A]"}`}
                          onClick={() => selectLocation(location)}
                        >
                          {location}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected locations */}
                {filters.location.map(location => (
                  <div key={location} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`location-${location}`}
                      checked={true}
                      onChange={() => handleFilterChange("location", location)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-[#FF6900] focus:ring-[#FF6900]"
                    />
                    <label htmlFor={`location-${location}`} className="text-sm">
                      {location}
                    </label>
                  </div>
                ))}
              </FilterSection>
            </div>
          )}

          {/* Internships List */}
          <div className="lg:w-3/4">
            {/* Loader */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6900]"></div>
              </div>
            ) : (
              <>
                {/* Results count and active filters */}
                <div className="mb-6 flex flex-col gap-3">
                  <p className={theme === "dark" ? "text-[#CCCCCC]" : "text-[#555555]"}>
                    {filteredInternships.length} internship{filteredInternships.length !== 1 ? 's' : ''} found
                  </p>

                  {/* Active filter chips */}
                  {activeFilterCount > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(filters).map(([category, values]) =>
                        values.map(value => (
                          <span
                            key={`${category}-${value}`}
                            className="px-3 py-1 bg-[#FF6900] text-white text-xs rounded-full flex items-center"
                          >
                            {value}
                            <button
                              onClick={() => handleFilterChange(category, value)}
                              className="ml-2 focus:outline-none"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Top Matches */}
                <section className="mb-16">
                  <h2 className="text-2xl font-semibold mb-8 font-poppins">
                    Top Matches for You
                  </h2>
                  {topInternships.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {topInternships.map((internship) => (
                        <InternshipCard
                          key={internship._id}
                          internship={internship}
                          isTopPick={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">No top matches found.</p>
                    </div>
                  )}
                </section>

                {!showAll && filteredInternships.length > 3 && (
                  <div className="text-center my-12">
                    <button
                      onClick={() => setShowAll(true)}
                      className="px-6 py-2.5 rounded-md font-medium 
                        bg-[#FF6900] text-white hover:bg-[#e65f00] 
                        transition-colors duration-300"
                    >
                      Load More Internships
                      <ArrowRight size={16} className="inline-block ml-2" />
                    </button>
                  </div>
                )}

                {showAll && (
                  <section className="mt-16">
                    <h2 className="text-2xl font-semibold mb-8 font-poppins">
                      More <span className="text-[#FF6900]">Opportunities</span>
                    </h2>
                    {otherInternships.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {otherInternships.map((internship) => (
                          <InternshipCard
                            key={internship._id}
                            internship={internship}
                            isTopPick={false}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No additional internships found.</p>
                      </div>
                    )}
                  </section>
                )}
              </>
            )}
          </div>
        </div>


      </main>
    </div>
  );
};

export default InternshipPage;
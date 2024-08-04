import { useState, useEffect, useMemo } from "react";
import { getListings, getApplications } from "../api";
import { useAuth } from "../context/AuthContext";
import convertToDate from "../utils/convertToDate";

const useMultiSelect = (initialSelected = []) => {
  const [selectedItems, setSelectedItems] = useState(initialSelected);

  const handleSelect = (value) => {
    if (value && !selectedItems.includes(value)) {
      setSelectedItems((prev) => [...prev, value]);
    }
  };

  const removeSelectedItem = (value) => {
    setSelectedItems((prev) => prev.filter((item) => item !== value));
  };

  const clearSelectedItems = () => {
    setSelectedItems([]);
  };

  return [selectedItems, handleSelect, removeSelectedItem, clearSelectedItems];
};

const useListingsData = (showApplied) => {
  const { token, appliedJobs, setAppliedJobs, setLoading } = useAuth();
  const [listings, setListings] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [minPay, setMinPay] = useState(0);

  const [
    selectedFilter,
    handleJobTypeSelect,
    removeSelectedJobType,
    clearSelectedJobTypes,
  ] = useMultiSelect([]);
  const [
    locationFilter,
    handleLocationSelect,
    removeSelectedLocation,
    clearSelectedLocations,
  ] = useMultiSelect([]);
  const [
    statusFilter,
    handleStatusSelect,
    removeSelectedStatus,
    clearSelectedStatuses,
  ] = useMultiSelect([]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const data = await getListings();
      const sortedListings = [...data].sort(
        (a, b) => convertToDate(b.date) - convertToDate(a.date)
      );
      setListings(sortedListings);
      setLoading(false);
    };

    const fetchApplications = async () => {
      try {
        const data = await getApplications(token);
        const applied = {};
        data.forEach((app) => {
          applied[app.ListingId] = {
            status: app.status,
            title: app.Listing.title,
          };
        });
        setAppliedJobs(applied);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchListings();
    if (token) {
      fetchApplications();
    }
  }, [token, setAppliedJobs, setLoading]);

  const filterOptions = useMemo(() => {
    const allTags = listings.flatMap((listing) => listing.tags || []);
    return Array.from(new Set(allTags));
  }, [listings]);

  const locationOptions = useMemo(() => {
    const allLocations = listings.flatMap((listing) =>
      Array.isArray(listing.location) ? listing.location : [listing.location]
    );
    return Array.from(new Set(allLocations));
  }, [listings]);

  const normalizeCompensation = (compensation) => {
    if (Array.isArray(compensation)) {
      if (compensation.length === 2) {
        return `$${compensation[0]} - $${compensation[1]}/hour`;
      } else if (compensation.length === 1) {
        return `$${compensation[0]}/hour`;
      }
    } else if (typeof compensation === "number") {
      return `$${compensation}/hour`;
    }
    return "";
  };

  const renderLocation = (location) => {
    if (Array.isArray(location)) {
      const firstLocation = location[0];
      return `${firstLocation} + ${location.length - 1} more`;
    }
    return location;
  };

  const containsText = (text, searchText) => {
    return text.toString().toLowerCase().includes(searchText.toLowerCase());
  };

  const filteredData = useMemo(() => {
    const globalFilterLower = globalFilter.toLowerCase();
    return listings
      .filter((listing) => {
        let pay = [0, 0];
        if (
          Array.isArray(listing.compensation) &&
          listing.compensation.length > 0
        ) {
          pay =
            listing.compensation.length === 1
              ? [listing.compensation[0], listing.compensation[0]]
              : listing.compensation;
        } else if (typeof listing.compensation === "number") {
          pay = [listing.compensation, listing.compensation];
        }

        const isAboveMinPay =
          minPay === "" || pay[0] >= Number(minPay) || pay[1] >= Number(minPay);

        if (
          selectedFilter.length > 0 &&
          !selectedFilter.some((filter) =>
            (listing.tags || []).some(
              (tag) =>
                typeof tag === "string" &&
                typeof filter === "string" &&
                tag.toLowerCase().includes(filter.toLowerCase())
            )
          )
        ) {
          return false;
        }

        const location = Array.isArray(listing.location)
          ? listing.location.join(", ").toLowerCase()
          : typeof listing.location === "string"
          ? listing.location.toLowerCase()
          : "";
        if (
          locationFilter.length > 0 &&
          !locationFilter.some(
            (filter) =>
              typeof filter === "string" &&
              location.includes(filter.toLowerCase())
          )
        ) {
          return false;
        }

        if (statusFilter.length > 0 && appliedJobs[listing.id]) {
          if (!statusFilter.includes(appliedJobs[listing.id].status)) {
            return false;
          }
        }

        if (showApplied && !appliedJobs[listing.id]) {
          return false;
        } else if (!showApplied && appliedJobs[listing.id]) {
          return false;
        }

        const searchableText = [
          listing.title,
          listing.company,
          renderLocation(listing.location),
          normalizeCompensation(listing.compensation),
          listing.date,
        ]
          .join(" ")
          .toLowerCase();

        return isAboveMinPay && containsText(searchableText, globalFilterLower);
      })
      .map((listing) => ({
        ...listing,
        compensation: normalizeCompensation(listing.compensation),
        location: renderLocation(listing.location),
      }));
  }, [
    listings,
    selectedFilter,
    locationFilter,
    statusFilter,
    showApplied,
    appliedJobs,
    minPay,
    globalFilter,
  ]);

  return {
    filteredData,
    filterOptions,
    locationOptions,
    globalFilter,
    setGlobalFilter,
    selectedFilter,
    setSelectedFilter: handleJobTypeSelect,
    locationFilter,
    setLocationFilter: handleLocationSelect,
    statusFilter,
    setStatusFilter: handleStatusSelect,
    removeSelectedJobType,
    removeSelectedLocation,
    removeSelectedStatus,
    minPay,
    setMinPay,
    clearFilters: () => {
      setGlobalFilter("");
      clearSelectedJobTypes();
      clearSelectedLocations();
      clearSelectedStatuses();
      setMinPay(0);
    },
    setListings, // Add setListings here
  };
};

export default useListingsData;

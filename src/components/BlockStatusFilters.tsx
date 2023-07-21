import { LogsFilterProps } from "@/types/block";
import React, { useState, useRef, useEffect } from "react";
import { FunnelFilled, FunnelOutline } from "../../assets";
import Image from "next/image";

const LogsFilter: React.FC<LogsFilterProps> = ({
  blockStatusFilters,
  handleBlockStatusFilter,
  handleBlockStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClickedOutside, setIsClickedOutside] = useState(false);
  const dropdownRef = useRef(null);
  const blockStatusOptions = ["ok", "info", "warn", "error"];

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const status = event.target.value;
    handleBlockStatusFilter(status);
    handleBlockStatusChange(status);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setIsClickedOutside(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isClickedOutside) {
      setIsOpen(false);
      setIsClickedOutside(false);
    }
  }, [isClickedOutside]);

  return (
    <div className="relative inline-block text-left">
      <div>
        <span className="rounded-md shadow-sm">
          <button
            type="button"
            className="inline-flex justify-center items-center gap-x-2 w-full rounded-md border border-gray-300 px-4 py-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            id="filter-menu"
            aria-haspopup="true"
            aria-expanded={isOpen}
            onClick={handleDropdownToggle}
          >
            Filter Status
            <Image
              src={blockStatusFilters?.length ? FunnelFilled : FunnelOutline}
              width={20}
              height={20}
              alt="filter-icon"
            />
          </button>
        </span>
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="filter-menu"
        >
          <div className="py-1" role="none">
            <div className="flex flex-col gap-y-2 ">
              {blockStatusOptions.map((status) => (
                <label
                  key={status}
                  className="font-medium text-gray-700 px-4 py-1 capitalize hover:bg-gray-200 hover:cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={status}
                    checked={blockStatusFilters.includes(status)}
                    onChange={handleCheckboxChange}
                    className="mr-2 leading-tight"
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogsFilter;

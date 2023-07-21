import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { LiveLogsTableProps, Log } from "@/types/block";
import { useInView } from "react-intersection-observer";
import { NoDataFound } from "../../assets";
import Image from "next/image";
import LogsFilter from "./BlockStatusFilters";

const LiveLogsTable: React.FC<LiveLogsTableProps> = ({
  data,
  resetLogs,
  handleFilter,
  setSearchKeyword,
  searchKeyword,
  handleSearch,
  setStartTime,
  startTime,
  endTime,
  setEndTime,
  triggerRest,
  blockStatusFilters,
  handleBlockStatusFilter,
  handleBlockStatusChange,
  totalRecords,
}) => {
  const lastRowRef = useRef<HTMLTableRowElement>(null);
  const [ref, inView] = useInView();

  const handleCleanAllFilters = () => {
    triggerRest();
  };

  useEffect(() => {
    if (inView && resetLogs) {
      resetLogs();
    }
  }, [inView]);

  return (
    <div className="container mx-auto">
      <div className="py-6 px-4">
        <h1 className="text-2xl font-bold mb-4">
          Live Logs ({totalRecords} Records)
        </h1>
        <div className="flex flex-col lg:flex-row md:justify-between gap-y-4  mb-4">
          <div className="flex  gap-x-4">
            <input
              type="text"
              className="px-4 py-2 w-full max-h-12 border"
              placeholder="Search Block Number"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button
              className="bg-blue-500 max-h-12 text-white px-4 py-2 rounded"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          <div className="flex flex-col xl:flex-row gap-y-2 gap-x-4">
            <LogsFilter
              blockStatusFilters={blockStatusFilters}
              handleBlockStatusFilter={handleBlockStatusFilter}
              handleBlockStatusChange={handleBlockStatusChange}
            />
            <div className="flex flex-col lg:flex-row gap-y-2 gap-x-4">
              <input
                type="datetime-local"
                className="px-4 py-2  w-full border"
                placeholder="Start Time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <input
                type="datetime-local"
                className="px-4 py-2  w-full border"
                placeholder="End Time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleFilter}
              >
                Filter
              </button>
            </div>

            <button
              className="bg-gray-500 text-white px-4 py-2 rounded whitespace-nowrap"
              onClick={handleCleanAllFilters}
            >
              Clean All Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {data.length === 0 ? (
            <div className="flex flex-col gap-2 items-center justify-center py-8">
              <Image alt="No Data" src={NoDataFound} width={300} height={250} />
              <p className="text-gray-500 text-center text-lg ml-4">
                No data found!
              </p>
              <button
                className="bg-blue-500 text-white px-4 py-2 my-4 ml-2 rounded"
                onClick={triggerRest}
              >
                Clear Filter/Search
              </button>
            </div>
          ) : (
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="py-2 px-4 border whitespace-nowrap">
                    Block Count
                  </th>
                  <th className="py-2 px-4 border whitespace-nowrap">
                    Block Date
                  </th>
                  <th className="py-2 px-4 border whitespace-nowrap">
                    Block Number
                  </th>
                  <th className="py-2 px-4 border whitespace-nowrap">
                    Block Hash
                  </th>
                  <th className="py-2 px-4 border whitespace-nowrap">
                    Block Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((log, index) => (
                  <tr
                    key={`${log.id}_${index}`}
                    ref={index === data.length - 1 ? lastRowRef : null}
                  >
                    <td className="py-2 px-4 border">{index + 1}</td>
                    <td className="py-2 px-4 border">
                      {moment(log.block_timestamp).format(
                        "MMM DD HH:mm:ss.SSS"
                      )}
                    </td>
                    <td className="py-2 px-4 border">{log.block_number}</td>
                    <td className="py-2 px-4 border">{log.block_hash}</td>
                    <td className="py-2 px-4 border capitalize">
                      <div className="flex items-center">
                        <div
                          className={`w-2.5 h-5 rounded mr-2 ${
                            log.block_status === "warn"
                              ? "bg-yellow-500"
                              : log.block_status === "error"
                              ? "bg-red-500"
                              : log.block_status === "info"
                              ? "bg-blue-500"
                              : log.block_status === "ok"
                              ? "bg-green-500"
                              : ""
                          }`}
                        ></div>
                        {log.block_status}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr ref={ref}></tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveLogsTable;

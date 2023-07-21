import { useState, useEffect } from "react";
import LiveLogsTable from "@/components/LivelogsTable";
import { Log } from "@/types/block";

interface LogsResponse {
  metadata: {
    totalRecords: number;
    pageIndex: number;
    pageSize: number;
  };
  logs: Log[];
}

const Index: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Log[]>([]);
  const [reset, setReset] = useState<boolean>(false);
  const [blockStatusFilters, setBlockStatusFilters] = useState<string[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleSearch = () => {
    if (searchKeyword.trim() === "") {
      setReset(!reset);
    } else {
      setPage(1);
      fetchData();
    }
  };

  const handleFilter = () => {
    setPage(1);
    fetchData();
  };

  const fetchData = async () => {
    const formattedKeyword = searchKeyword.replace(/\s/g, "");
    const formattedBlockStatusFilters = blockStatusFilters.join(",");
    const pageToFetch = 1;
    const url = `/api/get-data?page=${pageToFetch}&keyword=${formattedKeyword}&startTime=${startTime}&endTime=${endTime}&status=${formattedBlockStatusFilters}`;

    try {
      const response = await fetch(url);
      const responseData: LogsResponse = await response.json();

      setData(responseData.logs);
      setTotalRecords(responseData.metadata.totalRecords);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const loadMoreLogs = async () => {
    const nextPage = page + 1;
    const formattedKeyword = searchKeyword.replace(/\s/g, "");
    const formattedBlockStatusFilters = blockStatusFilters.join(",");
    const url = `/api/get-data?page=${nextPage}&keyword=${formattedKeyword}&startTime=${startTime}&endTime=${endTime}&status=${formattedBlockStatusFilters}`;

    try {
      const response = await fetch(url);
      const responseData: LogsResponse = await response.json();

      if (
        responseData.logs.length === 0 ||
        page * 30 >= responseData.metadata.totalRecords
      ) {
        // No more data to fetch
        return;
      }

      setData((prevData) => [...prevData, ...responseData.logs]);
      setPage(nextPage);
      setTotalRecords(responseData.metadata.totalRecords);
    } catch (error) {
      console.error("Error loading more logs:", error);
    }
  };

  const handleBlockStatusFilter = (status: string) => {
    const updatedFilters = [...blockStatusFilters];
    if (updatedFilters.includes(status)) {
      const index = updatedFilters.indexOf(status);
      updatedFilters.splice(index, 1);
    } else {
      updatedFilters.push(status);
    }
    setBlockStatusFilters(updatedFilters);
  };

  const handleBlockStatusChange = (status: string) => {
    setPage(1);
    handleBlockStatusFilter(status);
  };

  const triggerRest = () => {
    if (
      !(
        blockStatusFilters.length === 0 &&
        searchKeyword.trim() === "" &&
        startTime === "" &&
        endTime === ""
      )
    ) {
      setReset(!reset);
      setSearchKeyword("");
      setStartTime("");
      setEndTime("");
      setBlockStatusFilters([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reset, blockStatusFilters]);

  return (
    <>
      <LiveLogsTable
        data={data}
        resetLogs={loadMoreLogs}
        handleFilter={handleFilter}
        setSearchKeyword={setSearchKeyword}
        searchKeyword={searchKeyword}
        setStartTime={setStartTime}
        triggerRest={triggerRest}
        startTime={startTime}
        endTime={endTime}
        setEndTime={setEndTime}
        handleSearch={handleSearch}
        blockStatusFilters={blockStatusFilters}
        handleBlockStatusFilter={handleBlockStatusFilter}
        handleBlockStatusChange={handleBlockStatusChange}
        totalRecords={totalRecords}
      />
    </>
  );
};

export default Index;

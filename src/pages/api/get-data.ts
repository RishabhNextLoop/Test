import path from "path";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { Log } from "@/types/block";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { keyword, startTime, endTime, page, status } = req.query;
  const jsonDirectory = path.join(process.cwd(), "data");

  const fileContents = await fs.readFile(
    jsonDirectory + "/result.json",
    "utf8"
  );

  const jsonData = JSON.parse(fileContents);

  let filteredData = jsonData;

  if (keyword) {
    const lowercaseKeyword = String(keyword).toLowerCase();
    filteredData = filteredData.filter(
      (log: Log) =>
        log.block_number.toLowerCase().includes(lowercaseKeyword) ||
        log.block_hash.toLowerCase().includes(lowercaseKeyword)
    );
  }

  if (status) {
    const lowercaseStatusFilters = String(status).toLowerCase().split(",");
    filteredData = filteredData.filter(
      (log: Log) =>
        log.block_status &&
        lowercaseStatusFilters.includes(log.block_status.toLowerCase())
    );
  }

  if (startTime && endTime) {
    const start = new Date(startTime as string).getTime();
    const end = new Date(endTime as string).getTime();
    filteredData = filteredData.filter((log: Log) => {
      const logTime = new Date(log.block_timestamp).getTime();
      return logTime >= start && logTime <= end;
    });
  }

  // Pagination
  const pageSize = 30; // Number of logs per page
  const pageIndex = parseInt(page as string) || 1;
  const startIndex = (pageIndex - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const metadata = {
    totalRecords: filteredData.length,
    pageIndex,
    pageSize,
  };

  res.status(200).json({ metadata, logs: paginatedData });
}

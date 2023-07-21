export interface Log {
  block_hash: string;
  block_number: string;
  block_timestamp: string;
  from_address?: string;
  gas?: string;
  gas_price?: string;
  block_status: string;
  hash?: string;
  id: string;
  input?: string;
  nonce?: string;
  receipt_contract_address?: string | null;
  receipt_cumulative_gas_used?: string;
  receipt_gas_used?: string;
  receipt_root?: string | null;
  receipt_status?: string;
  to_address?: string;
  transfer_index?: [number, number];
  value?: string;
}

export interface LiveLogsTableProps {
  data: Log[];
  resetLogs: () => void;
  handleFilter: () => void;
  setSearchKeyword: (keyword: string) => void;
  searchKeyword: string;
  handleSearch: () => void;
  setStartTime: (time: string) => void;
  startTime: string;
  endTime: string;
  setEndTime: (time: string) => void;
  triggerRest: () => void;
  blockStatusFilters: string[];
  handleBlockStatusFilter: (status: string) => void;
  handleBlockStatusChange: (status: string) => void;
  totalRecords: number;
}

export type LogsFilterProps = {
  blockStatusFilters: string[];
  handleBlockStatusFilter: (status: string) => void;
  handleBlockStatusChange: (status: string) => void;
};

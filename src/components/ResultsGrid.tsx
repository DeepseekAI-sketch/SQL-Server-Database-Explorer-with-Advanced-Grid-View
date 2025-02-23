import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowUpDown, Search } from "lucide-react";

interface Column {
  key: string;
  label: string;
}

interface ResultsGridProps {
  data?: Array<Record<string, any>>;
  columns?: Column[];
  isLoading?: boolean;
}

const defaultData = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
];

const defaultColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
];

const ResultsGrid = ({
  data = defaultData,
  columns = defaultColumns,
  isLoading = false,
}: ResultsGridProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [filterText, setFilterText] = useState("");

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  const sortedAndFilteredData = React.useMemo(() => {
    let processedData = [...data];

    // Filter
    if (filterText) {
      processedData = processedData.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(filterText.toLowerCase()),
        ),
      );
    }

    // Sort
    if (sortConfig) {
      processedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return processedData;
  }, [data, sortConfig, filterText]);

  return (
    <div className="w-full h-full bg-background p-4 space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter results..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(column.key)}
                    className="hover:bg-transparent"
                  >
                    {column.label}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : sortedAndFilteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              sortedAndFilteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{row[column.key]}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ResultsGrid;

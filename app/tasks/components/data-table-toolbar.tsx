"use client";

import { X } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewTask } from "./btn-new-task";

import { statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { useEmployees } from "@/hooks/employees";
import { TaskColumn } from "./columns";
import { cn } from "@/lib/utils";

interface DataTableToolbarProps {
  table: Table<TaskColumn>;
  className?: string;
}

export function DataTableToolbar({ className, table }: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const employees = useEmployees();
  const employeeAsOptions =
    employees.data && employees.data.length > 0
      ? employees.data.map((employee) => ({
          label: employee.name,
          value: employee.name,
        }))
      : [];

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("employee") && !employees.isLoading && (
          <DataTableFacetedFilter
            column={table.getColumn("employee")}
            title="Employee"
            options={employeeAsOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3">
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <DataTableViewOptions table={table} />
        <NewTask />
      </div>
    </div>
  );
}

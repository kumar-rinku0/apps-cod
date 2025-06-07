"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

type MedicationProp = {
  _id: string;
  medication: {
    name: string;
  };
  quantity: string;
};

export type ContentProp = {
  createdAt: string;
  pharmacyId: {
    name: string;
    address: string;
  };
  medicationInfo: Array<MedicationProp>;
};

// export type Payment = {
//   id: string;
//   amount: number;
//   status: "pending" | "processing" | "success" | "failed";
//   email: string;
// };

export const columns: ColumnDef<ContentProp>[] = [
  {
    accessorKey: "customerInfo.fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "customerInfo.dob",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date of Birth
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "customerInfo.postalCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Postal Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => info.getValue(),
  },
  {
    id: "email",
    accessorKey: "customerInfo.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Transaction Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue() as Date;
      return (
        <span>
          {new Date(value).toLocaleString("en-IN", {
            day: "2-digit",
            year: "numeric",
            month: "short",
          })}
          <br />
          {new Date(value).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "pharmacyName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pharmacy
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => info.getValue() ?? "-",
  },
  {
    id: "medication",
    accessorKey: "medicationInfo",
    header: "Medication",
    cell: (info) => {
      const tags =
        info.getValue<{ medication: { name: string }; quantity: string }[]>();
      // const filterValue =  info.column.getFilterFn(tags);
      const filterValue = info.column.getFilterValue() as string | undefined;

      const filteredTags = filterValue
        ? tags.filter((tag) =>
            tag.medication.name
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          )
        : tags;

      return (
        <div className="grid grid-cols-2">
          {filteredTags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs m-1 font-medium px-2.5 py-0.5 rounded bg-white/20"
            >
              {tag.medication.name}
            </span>
          ))}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const medications = row.getValue(columnId) as {
        medication: { name: string };
        quantity: string;
      }[];

      return medications.some((item) =>
        item.medication.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    },
  },
];

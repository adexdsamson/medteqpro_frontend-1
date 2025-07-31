import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedData } from "@/features/services/bedManagementService";

export const bedColumns = (
  onAssignBed: (bedId: string) => void
): ColumnDef<BedData>[] => [
  {
    accessorKey: "bedId",
    header: "Bed ID",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("bedId")}</div>
    ),
  },
  {
    accessorKey: "roomNo",
    header: "Room No",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("roomNo")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "occupied" ? "destructive" : "default"}
          className={`
            ${status === "occupied" ? "bg-red-100 text-red-800" : ""}
            ${status === "available" ? "bg-green-100 text-green-800" : ""}
            ${status === "maintenance" ? "bg-yellow-100 text-yellow-800" : ""}
            ${status === "reserved" ? "bg-blue-100 text-blue-800" : ""}
          `}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "patientId",
    header: "Patient ID",
    cell: ({ row }) => {
      const patientId = row.getValue("patientId") as string;
      return (
        <div className="text-center">
          {patientId ? (
            <span className="font-medium">{patientId}</span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "patientName",
    header: "Patient Name",
    cell: ({ row }) => {
      const patientName = row.getValue("patientName") as string;
      return (
        <div>
          {patientName ? (
            <span className="font-medium">{patientName}</span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "allocationDateTime",
    header: "Allocation Date",
    cell: ({ row }) => {
      const allocationDate = row.getValue("allocationDateTime") as string;
      return (
        <div>
          {allocationDate ? (
            <span className="text-sm">{allocationDate}</span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const bed = row.original;
      
      return (
        <div className="flex items-center justify-end space-x-2">
          {bed.status === "available" ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => onAssignBed(bed.id)}
            >
              Assign Bed
            </Button>
          ) : bed.status === "occupied" ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="opacity-50 cursor-not-allowed"
            >
              Occupied
            </Button>
          ) : bed.status === "maintenance" ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="opacity-50 cursor-not-allowed"
            >
              Maintenance
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="opacity-50 cursor-not-allowed"
            >
              Reserved
            </Button>
          )}
        </div>
      );
    },
  },
];
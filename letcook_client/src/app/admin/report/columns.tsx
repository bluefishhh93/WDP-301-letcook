import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "@/lib/axios";
import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ReportResponseDialog from "./ReportResponseDialog"; // Add this import

type ReportData = {
  recipeId: string;
  title: string | null;
  reportCount: number;
};

export const createColumns = (): ColumnDef<ReportData>[] => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
  const [reportResponses, setReportResponses] = useState([]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedRecipeId, setSelectedRecipeId] = useState("");

  return [
    {
      accessorKey: "title",
      header: "Recipe Title",
      cell: ({ getValue }) => {
        const title = getValue() as string | null;
        return <span>{title || "Untitled Recipe"}</span>;
      },
    },
    {
      accessorKey: "reportCount",
      header: "Report Count",
      cell: ({ getValue }) => {
        const count = getValue() as number;
        return (
          <div className="flex items-center space-x-2">
            <AlertTriangle
              className={`h-5 w-5 ${
                count > 5
                  ? "text-red-500"
                  : count > 2
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            />
            <span className="font-semibold">{count}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const report = row.original;

        const handleViewRecipe = () => {
          router.push(`/recipe/${report.recipeId}`);
        };

        const handleViewReports = async () => {
          try {
            const response = await axios.get(
              `/api/recipe/${report.recipeId}/report`
            );
            const reportData = response.data;
            setReportResponses(reportData); // Assuming response.data is already an array of reports
            setSelectedRecipeId(report.recipeId);
            setIsResponseDialogOpen(true);

            console.log("Report response set:", reportData);
          } catch (error) {
            console.error("Error fetching report:", error);
            toast.error("Failed to fetch report");
          }
        };

        const handleBlockRecipe = async () => {
          try {
            await axios.post(`/api/recipe/${report.recipeId}/block`);
            toast.success("Recipe blocked successfully");
            router.refresh();
            window.location.reload();
          } catch (error) {
            console.error("Error blocking recipe:", error);
            toast.error("Failed to block recipe");
          }
        };

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleViewRecipe}>
                  View Recipe
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleViewReports}>
                  View Reports
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleBlockRecipe()}
                >
                  Block Recipe
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ReportResponseDialog
              isOpen={isResponseDialogOpen}
              onClose={() => setIsResponseDialogOpen(false)}
              reportResponses={reportResponses}
              recipeId={selectedRecipeId}
            />
          </>
        );
      },
    },
  ];
};

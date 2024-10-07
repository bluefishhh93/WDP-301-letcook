import React, { useState } from "react";
import { Recipe } from "CustomTypes";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import useAuth from "@/hooks/useAuth";
import { reportRecipe } from "@/services/recipe.service";

interface ReportDialogProps {
  recipe: Recipe;
}

const ReportDialog: React.FC<ReportDialogProps> = ({ recipe }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [report, setReport] = useState<string>("");

  const { user } = useAuth();
  const { showToast } = useToast();

  const handleReportSubmit = async () => {
    if (!report) return;

    try {
      const response = await submitReport(recipe._id, report);
      if (response) {
        closeDialog();
        showToast("Your report has been submitted successfully!", "success");
      }
    } catch (error) {
        const errorMessage = error.response?.message || "An error occurred while submitting your report.";
        showToast(errorMessage, "error");
    }
  };

  const submitReport = (recipeId: string, report: string) => {
    if (!user?.id) return null;
    return reportRecipe(recipeId, user.id, report);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setReport(""); 
  };

  return (
    <div className="bg-muted rounded-lg p-6">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-red-500 hover:text-red-600">
            <Flag className="w-4 h-4 mr-2" />
            Report
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Recipe</DialogTitle>
          </DialogHeader>
          <RadioGroup onValueChange={setReport} value={report}>
            {["inappropriate", "copyright", "spam", "other"].map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={value} />
                <Label htmlFor={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <Button type="submit" className="mt-4" onClick={handleReportSubmit}>
            Submit Report
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportDialog;

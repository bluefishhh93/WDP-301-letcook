import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ReportResponse {
  _id: string;
  userId: string;
  report: string;
}

interface ReportResponseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportResponses: ReportResponse[] | null;
  recipeId: string;
}

const ReportResponseDialog: React.FC<ReportResponseDialogProps> = ({ isOpen, onClose, reportResponses, recipeId }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Reports for Recipe {recipeId}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {reportResponses && reportResponses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportResponses.map((response) => (
                  <TableRow key={response._id}>
                    <TableCell>{response.userId}</TableCell>
                    <TableCell>{response.report}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No reports available for this recipe.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportResponseDialog;
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderType } from "CustomTypes";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Package2, Phone, Mail, MapPin, CreditCard, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { vietnamCurrency } from "@/utils/commons.utils";
import { updatePaymentStatus } from "@/services/order.service";

interface ViewOrderDialogProps {
  selectedOrder: OrderType;
}

const ViewOrderDialog: React.FC<ViewOrderDialogProps> = ({ selectedOrder }) => {
  const [open, setOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(selectedOrder.paymentStatus);

  const handlePaymentStatusChange = async (status: string) => {
    setPaymentStatus(status);
    const res = await updatePaymentStatus(selectedOrder.id, status);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-300 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            View Order Details
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Badge variant="outline" className="text-base">
                Order #{selectedOrder.id}
              </Badge>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">
                {new Date(selectedOrder.createAt).toLocaleString()}
              </span>
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="customer-info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="customer-info" className="text-base">
                Customer Information
              </TabsTrigger>
              <TabsTrigger value="order-items" className="text-base">
                Order Items
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customer-info">
              <Card className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <InfoItem
                    icon={<Package2 className="w-5 h-5" />}
                    label="Order Status"
                    value={
                      <Badge className={`${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </Badge>
                    }
                  />
                  <InfoItem
                    icon={<CreditCard className="w-5 h-5" />}
                    label="Payment Method"
                    value={selectedOrder.paymentMethod}
                  />
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="paymentStatus" className="text-xs font-medium text-gray-500">
                      Payment Status
                    </Label>
                    <Select value={paymentStatus} onValueChange={handlePaymentStatusChange}>
                      <SelectTrigger id="paymentStatus" className="w-full h-8 text-sm border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                          <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                        {['paid', 'pending', 'failed', 'refunded'].map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className={`capitalize text-xs py-1 ${getPaymentStatusColor(status)} my-0.5 rounded-sm`}
                          >
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <InfoItem
                    label="Total Amount"
                    value={
                      <span className="text-lg font-semibold text-green-600">
                        {vietnamCurrency(selectedOrder.total)}
                      </span>
                    }
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
                  <InfoItem
                    icon={<Package2 className="w-5 h-5" />}
                    label="Customer Name"
                    value={selectedOrder.name!}
                  />
                  <InfoItem
                    icon={<Phone className="w-5 h-5" />}
                    label="Phone"
                    value={selectedOrder.phone!}
                  />
                  <InfoItem
                    icon={<Mail className="w-5 h-5" />}
                    label="Email"
                    value={selectedOrder.email!}
                  />
                  <InfoItem
                    icon={<MapPin className="w-5 h-5" />}
                    label="Shipping Address"
                    value={selectedOrder.shipAddress!}
                  />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="order-items">
              <Card>
                <ScrollArea className="h-[400px] w-full rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Item</TableHead>
                        <TableHead className="font-semibold">Quantity</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                        <TableHead className="font-semibold">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.orderItems.map((item, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {vietnamCurrency(item.price)}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {vietnamCurrency(item.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setOpen(false)}
              className="px-6"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InfoItem: React.FC<{
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}> = ({
  label,
  value,
  icon
}) => (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-500">{icon}</span>}
        <span className="text-sm font-medium text-gray-500">{label}</span>
      </div>
      <div className="text-base">{value}</div>
    </div>
  );

export default ViewOrderDialog;
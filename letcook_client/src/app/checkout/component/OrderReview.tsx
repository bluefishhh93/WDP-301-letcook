import { memo } from "react";
import { Button } from "@/components/ui/button";
import { vietnamCurrency } from "@/utils/commons.utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface OrderReviewProps {
  totalPrice: number;
  shippingFee: number | undefined;
  totalWithShipping: number;
  onPlaceOrder: () => void;
  isLoadingShippingFee: boolean;
  isCreatingOrder: boolean;
}

// eslint-disable-next-line react/display-name
const OrderReview = memo(({
  totalPrice,
  shippingFee,
  totalWithShipping,
  onPlaceOrder,
  isLoadingShippingFee,
  isCreatingOrder
}: OrderReviewProps) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Order Review</h2>
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3">
          <h3 className="font-medium">Order Summary</h3>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{vietnamCurrency(totalPrice)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping Fee</span>
            <span>
              {isLoadingShippingFee
                ? "Calculating..."
                : shippingFee !== undefined
                ? vietnamCurrency(shippingFee)
                : "Not available"}
            </span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>{vietnamCurrency(totalWithShipping)}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Button 
          size="lg" 
          onClick={onPlaceOrder} 
          disabled={isLoadingShippingFee || isCreatingOrder}
        >
          {isCreatingOrder ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Order...
            </>
          ) : (
            'Place Order'
          )}
        </Button>
      </div>
    </section>
  );
});

export default OrderReview;
import { memo } from "react";
import { ProductType } from "CustomTypes";
import CartSummaryTable from "./CartSummaryTable";

interface CartSummaryProps {
  cart: ProductType[];
  totalPrice: number;
}

const CartSummary = memo(({ cart, totalPrice }: CartSummaryProps) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Cart Summary</h2>
      <div className="border rounded-lg overflow-hidden">
        {cart && cart.length > 0 ? (
          <CartSummaryTable cart={cart} />
        ) : (
          <p className="p-4">Your cart is empty.</p>
        )}
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between font-semibold">
          <span>Total</span>
          <span>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalPrice)}
          </span>
        </div>
      </div>
    </section>
  );
});

CartSummary.displayName = "CartSummary";

export default CartSummary;
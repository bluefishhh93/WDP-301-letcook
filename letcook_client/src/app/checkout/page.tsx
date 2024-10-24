"use client";

import { useCartStore } from "@/store/useCartStore";
import useFromStore from "@/hooks/useFromStore";
import UserWrapper from "@/components/UserWrapper";
import CheckoutForm from "./component/CheckoutForm";
import CartSummary from "./component/CartSumary";

export default function CheckoutPage() {
  const cart = useFromStore(useCartStore, (state) => state.cart) || [];
  const totalPrice = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);

  return (
    <UserWrapper>
      <main className="py-8 px-4 md:px-8">
        <div className="container mx-auto grid md:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-8">
            <CartSummary cart={cart} totalPrice={totalPrice} />
            <CheckoutForm cart={cart} totalPrice={totalPrice} />
          </div>
        </div>
      </main>
    </UserWrapper>
  );
}
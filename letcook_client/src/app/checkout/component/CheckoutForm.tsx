import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useCartStore } from "@/store/useCartStore";
import { useShippingFee } from "@/hooks/use-shipping-fee";
import { calculateWeigth } from "@/lib/ghn";
import { checkoutFormSchema } from "@/utils/validation.utils";
import { CheckoutFormType, CheckoutPayload, ProductType } from "CustomTypes";
import * as OrderService from "@/services/order.service";
import * as CheckoutService from "@/services/checkout.service";
import { Form } from "@/components/ui/form";
import OrderReview from "./OrderReview";
import { useAddressData } from "@/hooks/useAddressData";
import { InputFieldCustom } from "./InputFieldCustom";
import SelectFieldCustom from "./SelectFieldCustom";
import PaymentMethodField from "./PaymentMethodField";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  cart: ProductType[];
  totalPrice: number;
}

export default function CheckoutForm({ cart, totalPrice }: CheckoutFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { clearCart, setCheckoutPayload } = useCartStore();
  const { districts, wards, fetchDistricts, fetchWards } = useAddressData();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const form = useForm<CheckoutFormType>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: user?.username || "",
      phone: "",
      email: user?.email || "",
      paymentMethod: "cod",
      address: "",
      district: "",
      ward: "",
      districtId: 0,
      wardId: 0,
      provinceId: 203,
      fee: 0,
    },
  });

  const { shippingFee, isLoading: isLoadingShippingFee } = useShippingFee(
    form.watch('districtId'),
    form.watch('wardId').toString(),
    cart && cart.length > 0 ? calculateWeigth(cart) : 0
  );

  const totalWithShipping = useMemo(() => totalPrice + (shippingFee || 0), [totalPrice, shippingFee]);

  useEffect(() => {
    if (shippingFee !== undefined) {
      form.setValue('fee', shippingFee);
    }
  }, [shippingFee, form]);

  useEffect(() => {
    if (user) {
      form.setValue("name", user.username || "");
      form.setValue("email", user.email || "");
    }
  }, [user, form]);

  const handleDistrictChange = useCallback(async (districtId: number) => {
    await fetchWards(districtId);
    form.setValue('ward', '');
    form.setValue('districtId', districtId);
    form.setValue('wardId', 0);
  }, [fetchWards, form]);

  const handleWardChange = useCallback((wardCode: string) => {
    form.setValue('wardId', Number(wardCode));
  }, [form]);

  const onSubmit = async (formData: CheckoutFormType) => {
    setIsCreatingOrder(true);
    try {
      if (cart.length === 0) {
        console.error("Cannot submit order: No items in cart.");
        return;
      }

      const payload: CheckoutPayload = {
        userId: user?.id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        paymentMethod: formData.paymentMethod,
        shipAddress: `${formData.address}, ${formData.ward}, ${formData.district}`,
        orderItems: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
        totalPrice: totalPrice + (shippingFee || 0),
      };

      // console.log(payload, 'heeh');

      setCheckoutPayload(payload);

      if (formData.paymentMethod === "cod") {
        const order = await OrderService.createOrder(payload);
        if (order) {
          clearCart();
          router.push('/orderSuccess');
        }
      } else if (formData.paymentMethod === "vnpay") {
        const vnpayUrl = await CheckoutService.createVNPayUrl(totalPrice);
        if (vnpayUrl && typeof window !== 'undefined') {
          window.location.href = vnpayUrl;
        }
      } else {
        console.error("Unsupported payment method");
      }
    } catch (error) {
      console.error("Checkout failed", error);
      // You might want to show an error message to the user here
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <Form {...form}>
      {isCreatingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md flex items-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span>Creating your order...</span>
          </div>
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <InputFieldCustom name="name" label="Name" placeholder="Enter your name" form={form} />
            <InputFieldCustom name="phone" label="Phone" placeholder="Enter your phone" form={form} />
          </div>
          <InputFieldCustom name="email" label="Email" placeholder="Enter your email" form={form} />
          <InputFieldCustom name="address" label="Address" placeholder="Enter your address" form={form} />
          <SelectFieldCustom
            name="district"
            label="District"
            form={form}
            options={districts.map((d) => ({
              id: d.DistrictID.toString(),
              name: d.DistrictName,
            }))}
            onChange={(value) => handleDistrictChange(Number(value))}
          />
          <SelectFieldCustom
            name="ward"
            label="Ward"
            form={form}
            options={wards.map((w) => ({
              id: w.WardCode,
              name: w.WardName,
            }))}
            onChange={handleWardChange}
          />
          <PaymentMethodField form={form} />
        </div>
        <OrderReview
          totalPrice={totalPrice}
          shippingFee={shippingFee}
          totalWithShipping={totalWithShipping}
          onPlaceOrder={form.handleSubmit(onSubmit)}
          isLoadingShippingFee={isLoadingShippingFee}
          isCreatingOrder={isCreatingOrder}
        />
      </form>
    </Form>
  );
}
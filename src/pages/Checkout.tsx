import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Package, CreditCard, ClipboardList } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const FieldInput = ({ label, field, value, onChange, placeholder, type = "text", error }: {
  label: string; field: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; error?: string;
}) => (
  <div className="space-y-1.5">
    <Label className="font-mono text-xs tracking-wider text-muted-foreground">{label}</Label>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-secondary border-border font-mono text-sm ${error ? "border-destructive" : ""}`}
    />
    {error && <p className="text-xs text-destructive font-mono">{error}</p>}
  </div>
);

const shippingSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Invalid email address").max(255),
  address: z.string().trim().min(1, "Address is required").max(200),
  city: z.string().trim().min(1, "City is required").max(100),
  postalCode: z.string().trim().min(1, "Postal code is required").max(20),
  country: z.string().trim().min(1, "Country is required").max(100),
});

const paymentSchema = z.object({
  cardName: z.string().trim().min(1, "Name on card is required").max(100),
  cardNumber: z.string().trim().regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Enter a valid 16-digit card number"),
  expiry: z.string().trim().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format"),
  cvc: z.string().trim().regex(/^\d{3,4}$/, "Enter a valid CVC"),
});

type ShippingData = z.infer<typeof shippingSchema>;
type PaymentData = z.infer<typeof paymentSchema>;

const steps = [
  { id: 0, label: "SHIPPING", icon: Package },
  { id: 1, label: "PAYMENT", icon: CreditCard },
  { id: 2, label: "REVIEW", icon: ClipboardList },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, removeItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [shipping, setShipping] = useState<ShippingData>({
    firstName: "", lastName: "", email: user?.email || "",
    address: "", city: "", postalCode: "", country: "",
  });

  const [payment, setPayment] = useState<PaymentData>({
    cardName: "", cardNumber: "", expiry: "", cvc: "",
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-sm text-muted-foreground">YOUR CART IS EMPTY</p>
        <Button variant="outline" onClick={() => navigate("/products")} className="font-mono tracking-wider">
          <ArrowLeft className="w-4 h-4 mr-2" /> BROWSE PRODUCTS
        </Button>
      </div>
    );
  }

  const validateStep = () => {
    setErrors({});
    if (step === 0) {
      const result = shippingSchema.safeParse(shipping);
      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.errors.forEach((e) => { errs[e.path[0] as string] = e.message; });
        setErrors(errs);
        return false;
      }
    }
    if (step === 1) {
      const result = paymentSchema.safeParse(payment);
      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.errors.forEach((e) => { errs[e.path[0] as string] = e.message; });
        setErrors(errs);
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 2));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const placeOrder = async () => {
    setSubmitting(true);
    try {
      // Create order
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          guest_email: user ? null : shipping.email,
          total_amount: totalPrice,
          shipping_address: {
            firstName: shipping.firstName,
            lastName: shipping.lastName,
            address: shipping.address,
            city: shipping.city,
            postalCode: shipping.postalCode,
            country: shipping.country,
          },
          status: "confirmed",
        })
        .select("id")
        .single();

      if (orderErr) throw orderErr;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        variant_id: item.variant.id,
        quantity: item.quantity,
        unit_price: item.product.basePrice + item.variant.priceModifier,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      // Clear cart
      items.forEach((item) => removeItem(item.product.id, item.variant.id));

      toast({ title: "Order placed!", description: `Order #${order.id.slice(0, 8).toUpperCase()} confirmed.` });
      navigate(`/order/${order.id}`);
    } catch (err: any) {
      toast({ title: "Order failed", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const updateShipping = (field: keyof ShippingData, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const updatePayment = (field: keyof PaymentData, value: string) => {
    setPayment((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2">CHECKOUT</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Complete Your Order</h1>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-10 max-w-md">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                step > i ? "bg-primary border-primary text-primary-foreground"
                : step === i ? "border-primary text-primary"
                : "border-border text-muted-foreground"
              }`}>
                {step > i ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
              </div>
              <span className={`font-mono text-[10px] tracking-wider hidden sm:inline ${
                step >= i ? "text-foreground" : "text-muted-foreground"
              }`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`w-8 md:w-16 h-px mx-1 ${step > i ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main form area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-card border border-border rounded-lg p-6 space-y-5">
                  <h2 className="font-mono text-sm font-bold tracking-wider">SHIPPING INFORMATION</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FieldInput label="FIRST NAME" field="firstName" value={shipping.firstName} onChange={(v) => updateShipping("firstName", v)} placeholder="John" error={errors.firstName} />
                    <FieldInput label="LAST NAME" field="lastName" value={shipping.lastName} onChange={(v) => updateShipping("lastName", v)} placeholder="Doe" error={errors.lastName} />
                  </div>
                  <FieldInput label="EMAIL" field="email" value={shipping.email} onChange={(v) => updateShipping("email", v)} placeholder="john@example.com" type="email" error={errors.email} />
                  <FieldInput label="ADDRESS" field="address" value={shipping.address} onChange={(v) => updateShipping("address", v)} placeholder="123 Main Street" error={errors.address} />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FieldInput label="CITY" field="city" value={shipping.city} onChange={(v) => updateShipping("city", v)} placeholder="Berlin" error={errors.city} />
                    <FieldInput label="POSTAL CODE" field="postalCode" value={shipping.postalCode} onChange={(v) => updateShipping("postalCode", v)} placeholder="10115" error={errors.postalCode} />
                    <FieldInput label="COUNTRY" field="country" value={shipping.country} onChange={(v) => updateShipping("country", v)} placeholder="Germany" error={errors.country} />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-card border border-border rounded-lg p-6 space-y-5">
                  <h2 className="font-mono text-sm font-bold tracking-wider">PAYMENT DETAILS</h2>
                  <p className="text-xs text-muted-foreground font-mono">Demo only — no real charges will be made.</p>
                  <FieldInput label="NAME ON CARD" field="cardName" value={payment.cardName} onChange={(v) => updatePayment("cardName", v)} placeholder="John Doe" error={errors.cardName} />
                  <FieldInput label="CARD NUMBER" field="cardNumber" value={payment.cardNumber} onChange={(v) => updatePayment("cardNumber", v)} placeholder="4242 4242 4242 4242" error={errors.cardNumber} />
                  <div className="grid grid-cols-2 gap-4">
                    <FieldInput label="EXPIRY" field="expiry" value={payment.expiry} onChange={(v) => updatePayment("expiry", v)} placeholder="MM/YY" error={errors.expiry} />
                    <FieldInput label="CVC" field="cvc" value={payment.cvc} onChange={(v) => updatePayment("cvc", v)} placeholder="123" error={errors.cvc} />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-card border border-border rounded-lg p-6 space-y-6">
                  <h2 className="font-mono text-sm font-bold tracking-wider">ORDER REVIEW</h2>

                  <div className="space-y-2">
                    <p className="font-mono text-xs text-muted-foreground tracking-wider">SHIPPING TO</p>
                    <p className="text-sm">{shipping.firstName} {shipping.lastName}</p>
                    <p className="text-sm text-muted-foreground">{shipping.address}, {shipping.city} {shipping.postalCode}</p>
                    <p className="text-sm text-muted-foreground">{shipping.country}</p>
                    <p className="text-sm text-muted-foreground">{shipping.email}</p>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <p className="font-mono text-xs text-muted-foreground tracking-wider">PAYMENT</p>
                    <p className="text-sm">•••• •••• •••• {payment.cardNumber.replace(/\s/g, "").slice(-4)}</p>
                    <p className="text-sm text-muted-foreground">Expires {payment.expiry}</p>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <p className="font-mono text-xs text-muted-foreground tracking-wider">ITEMS</p>
                    {items.map((item) => {
                      const price = item.product.basePrice + item.variant.priceModifier;
                      return (
                        <div key={`${item.product.id}-${item.variant.id}`} className="flex justify-between text-sm">
                          <span>{item.product.name} — {item.variant.name} ×{item.quantity}</span>
                          <span className="font-mono text-primary">€{(price * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              <Button variant="ghost" onClick={step === 0 ? () => navigate(-1) : back} className="font-mono tracking-wider text-xs">
                <ArrowLeft className="w-4 h-4 mr-2" /> {step === 0 ? "BACK" : "PREVIOUS"}
              </Button>
              {step < 2 ? (
                <Button onClick={next} className="font-mono tracking-wider text-xs">
                  CONTINUE <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={placeOrder} disabled={submitting} className="font-mono tracking-wider text-xs">
                  {submitting ? "PROCESSING..." : "PLACE ORDER"} {!submitting && <Check className="w-4 h-4 ml-2" />}
                </Button>
              )}
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-28 space-y-4">
              <h3 className="font-mono text-sm font-bold tracking-wider">ORDER SUMMARY</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => {
                  const price = item.product.basePrice + item.variant.priceModifier;
                  return (
                    <div key={`${item.product.id}-${item.variant.id}`} className="flex justify-between items-start text-sm">
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold truncate">{item.product.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.variant.name} ×{item.quantity}</p>
                      </div>
                      <p className="font-mono text-xs text-primary flex-shrink-0 ml-2">€{(price * item.quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="font-mono text-xs text-muted-foreground">TOTAL</span>
                <span className="font-mono text-lg font-bold text-primary">€{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

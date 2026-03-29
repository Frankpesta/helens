import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 sm:px-6">
      <p className="font-heading text-2xl text-foreground">Checkout canceled</p>
      <p className="mt-3 text-sm text-muted-foreground">
        No charges were made. Your bag is unchanged.
      </p>
      <Link
        href="/cart"
        className="mt-6 inline-block text-sm text-gold underline"
      >
        Return to cart
      </Link>
    </div>
  );
}

import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
      {/* Spacer so fixed mobile nav never covers footer content */}
      <div aria-hidden className="md:hidden h-20" />
    </CartProvider>
  );
}

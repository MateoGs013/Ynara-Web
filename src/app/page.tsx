import { CtaSection } from "@/components/sections/CtaSection";
import { FeelSection } from "@/components/sections/FeelSection";
import { Hero } from "@/components/sections/Hero";
import { MemorySection } from "@/components/sections/MemorySection";
import { NameSection } from "@/components/sections/NameSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { ProductSection } from "@/components/sections/ProductSection";
import { StatementSection } from "@/components/sections/StatementSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <NameSection />
      <ProblemSection />
      <StatementSection />
      <ProductSection />
      <MemorySection />
      <FeelSection />
      <PricingSection />
      <CtaSection />
    </>
  );
}

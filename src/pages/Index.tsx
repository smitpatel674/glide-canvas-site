import { Navbar } from "@/components/ui/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { MarqueeSection } from "@/components/sections/MarqueeSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";

const Index = () => (
  <main className="relative bg-background text-foreground">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <ServicesSection />
    <WorkSection />
    <MarqueeSection />
    <TeamSection />
    <TestimonialsSection />
    <ContactSection />
    <Footer />
  </main>
);

export default Index;

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import VehiclesSection from '@/components/home/VehiclesSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import HowToRentSection from '@/components/home/HowToRentSection'
import ReviewsSection from '@/components/home/ReviewsSection'
import CTASection from '@/components/home/CTASection'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <VehiclesSection />
        <FeaturesSection />
        <HowToRentSection />
        <ReviewsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

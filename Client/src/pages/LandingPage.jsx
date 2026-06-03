import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import VehiclesSection from '@/components/home/VehiclesSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import HowToRentSection from '@/components/home/HowToRentSection'
import ReviewsSection from '@/components/home/ReviewsSection'
import CTASection from '@/components/home/CTASection'
import ToursSection from '@/components/home/ToursSection'

export default function LandingPage() {
  return (
    <>
      <title>Benz Rental Bali – Sewa Motor Premium di Bali | Benzride.com</title>
      <meta name="description" content="Sewa motor premium di Bali dengan antar ke hotel, villa, dan resort. Honda PCX, NMAX, Scoopy tersedia. Harga mulai Rp90.000/hari. Booking mudah via WhatsApp." />
      <meta property="og:title" content="Benz Rental Bali – Sewa Motor Premium di Bali" />
      <meta property="og:description" content="Sewa motor premium di Bali dengan antar ke hotel, villa, dan resort. Harga mulai Rp90.000/hari." />
      <meta property="og:type" content="website" />
      <link rel="canonical" href="https://benzride.com/" />
      <Navbar />
      <main>
        <HeroSection />
        <VehiclesSection />
        <ToursSection />
        <FeaturesSection />
        <HowToRentSection />
        <ReviewsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

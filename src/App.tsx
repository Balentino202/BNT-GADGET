import { ProductsProvider } from './context/ProductsContext';
import Header from './components/Header';
import Hero from './components/Hero';
import BrandsBar from './components/BrandsBar';
import WhyUs from './components/WhyUs';
import Products from './components/Products';
import Services from './components/Services';
import RepairProcess from './components/RepairProcess';
import RepairEstimator from './components/RepairEstimator';
import Stats from './components/Stats';
import WeAlsoBuy from './components/WeAlsoBuy';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';

export default function App() {
  return (
    <ProductsProvider>
      <Header />
      <main>
        <Hero />
        <BrandsBar />
        <WhyUs />
        <Products />
        <Services />
        <RepairProcess />
        <RepairEstimator />
        <Stats />
        <WeAlsoBuy />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ScrollToTop />
      <CookieConsent />
    </ProductsProvider>
  );
}

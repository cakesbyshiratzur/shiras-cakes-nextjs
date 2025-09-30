'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
// import PhotoGallery from "@/components/PhotoGallery";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  type Review = { name: string; review: string; rating?: number };
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState<boolean>(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Shira's Cakes",
    "description": "Professional custom cake design, cupcakes, cookies, and baking workshops",
    "url": "https://shirascakes.com",
    "telephone": "+1-214-677-6273",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dallas",
      "addressRegion": "TX",
      "addressCountry": "US"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Dallas"
      },
      {
        "@type": "City", 
        "name": "Fort Worth"
      },
      {
        "@type": "City",
        "name": "Austin"
      }
    ],
    "serviceType": ["Custom Cakes", "Cupcakes", "Cookies", "Baking Workshops"],
    "founder": {
      "@type": "Person",
      "name": "Shira Tzur"
    },
    "sameAs": [
      "https://www.instagram.com/shirascakes/",
      "https://www.facebook.com/cakesbyshira"
    ]
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Define image categories (only 3 sections as requested)
  const getImageCategory = (num: number): string => {
    if (num >= 1 && num <= 39) return 'birthday';
    if (num >= 40 && num <= 48) return 'special-design';
    if (num >= 60 && num <= 73) return 'cookies';
    return 'birthday';
  };

  // Explicit image lists to avoid missing files (e.g., 8.jpg, 49-59 don't exist)
  const birthdayImages = Array.from({ length: 39 }, (_, i) => i + 1).filter(n => n !== 8);
  const specialDesignImages = Array.from({ length: 9 }, (_, i) => 40 + i);
  const cookiesImages = Array.from({ length: 14 }, (_, i) => 60 + i);
  const allImages = [...birthdayImages, ...specialDesignImages, ...cookiesImages];

  // Filter images based on selected category
  const getFilteredImages = () => {
    if (selectedCategory === 'all') return allImages;
    return allImages.filter(num => getImageCategory(num) === selectedCategory);
  };

  const filteredImages = getFilteredImages();

  // Fetch reviews via server proxy for resilience (permissions/CORS)
  useEffect(() => {
    const fetchReviews = async () => {
      setIsReviewsLoading(true);
      setReviewsError(null);
      try {
        const res = await fetch('/api/reviews', { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Failed to load reviews');
        const list = Array.isArray(json?.reviews) ? json.reviews : [];
        const trimmed = list.map((r: Review) => ({
          ...r,
          name: r.name.length > 80 ? r.name.slice(0, 80).trim() + '…' : r.name,
          review: r.review.length > 600 ? r.review.slice(0, 600).trim() + '…' : r.review,
        }));
        setReviews(trimmed);
      } catch (e: any) {
        setReviewsError(e?.message || 'Failed to load reviews');
      } finally {
        setIsReviewsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.jpg"
                alt="Shira's Cakes Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-display text-2xl font-bold text-gray-800">
                Shira&apos;s Cakes
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-gray-700 hover:text-pink-500 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-pink-500 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="text-gray-700 hover:text-pink-500 transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className="text-gray-700 hover:text-pink-500 transition-colors"
              >
                Gallery
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-pink-500 transition-colors"
              >
                Contact
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-pink-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => scrollToSection('hero')}
                  className="block px-3 py-2 text-gray-700 hover:text-pink-500"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="block px-3 py-2 text-gray-700 hover:text-pink-500"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="block px-3 py-2 text-gray-700 hover:text-pink-500"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection('gallery')}
                  className="block px-3 py-2 text-gray-700 hover:text-pink-500"
                >
                  Gallery
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="block px-3 py-2 text-gray-700 hover:text-pink-500"
                >
                  Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-16 min-h-screen bg-gradient-to-br from-pink-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[#ffb6c1] opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="font-display text-5xl lg:text-7xl font-bold text-gray-800 leading-tight">
                  Sweet Dreams
                  <span className="block text-pink-500">Made Real</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Custom cakes, cupcakes, and cookies designed with love. 
                  Professional baking workshops to inspire your inner baker.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-pink-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Serving Dallas-Fort Worth & Austin Areas</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => scrollToSection('services')}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Order Now
                  </button>
                  <button
                    onClick={() => scrollToSection('gallery')}
                    className="border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
                  >
                    View Gallery
                  </button>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
        <Image
                  src="/images/0.jpg"
                  alt="Beautiful custom cake"
                  width={600}
                  height={600}
                  className="rounded-2xl shadow-2xl"
          priority
        />
              </div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-pink-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-300 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-800">
                About Me
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  I&apos;m Shira Tzur, a 19-year-old self-taught baker, cake designer, and full-time student at the University of Texas at Austin. What started as a fun hobby quickly turned into a full-blown passion, and since 2019, I&apos;ve been bringing custom cake visions to life for any occasion.
                </p>
                <p>
                  While custom cakes are my specialty, I also create cupcakes, cookies, and run summer baking workshops where I teach the basics (and the fun!) of baking.
                </p>
                <div className="bg-pink-50 p-6 rounded-xl border-l-4 border-pink-500">
                  <p className="text-pink-700 font-medium">
                    💝 Every purchase makes a difference - 10% of my small business profits is donated to the For Goodness Cakes non-profit organization.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="/shira-photo.jpg"
                alt="Shira Tzur - Baker and Cake Designer"
                width={500}
                height={600}
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-pink-500 text-white p-4 rounded-xl shadow-lg">
                <p className="font-semibold">Since 2019</p>
                <p className="text-sm">Creating Sweet Memories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-pink-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From custom cakes to baking workshops, we offer a full range of sweet services to make your special moments unforgettable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Custom Cakes */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-800">Custom Cakes & Cupcakes</h3>
                <p className="text-gray-600">
                  Personalized cakes and cupcakes designed to match your vision and taste perfectly.
                </p>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScpTMHp2YV0bZeWKQWqp2u_HgTbHrvujXqDH30S41qXKu6IfA/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300"
                >
                  Order Now
                </a>
              </div>
            </div>

            {/* Cookies */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-800">Custom Cookies</h3>
                <p className="text-gray-600">
                  Beautifully decorated cookies perfect for any occasion or celebration.
                </p>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScp3N0JEFi6jU7OdTuTxkJZhKOuu5_d79SJ2GZdixBLaZbtGA/viewform"
            target="_blank"
            rel="noopener noreferrer"
                  className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300"
                >
                  Order Now
                </a>
              </div>
            </div>

            {/* Workshops */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-800">Baking 101 Workshops</h3>
                <p className="text-gray-600">
                  Learn the basics of baking in our fun and educational summer workshops.
                </p>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdgW8dm3mvVcmKLbzbbAkX8_tjh7Cm33g8jBLXqC5Mso87EUw/viewform"
            target="_blank"
            rel="noopener noreferrer"
                  className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300"
          >
                  Sign Up
          </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Photo Gallery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A showcase of our beautiful custom cakes, cupcakes, and cookies that have brought joy to countless celebrations.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-pink-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-600'
              }`}
            >
              {`All (${allImages.length})`}
            </button>
            <button 
              onClick={() => setSelectedCategory('birthday')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === 'birthday'
                  ? 'bg-pink-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-600'
              }`}
            >
              {`Birthday Cakes (${birthdayImages.length})`}
            </button>
            <button 
              onClick={() => setSelectedCategory('special-design')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === 'special-design'
                  ? 'bg-pink-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-600'
              }`}
            >
              {`Special Design (${specialDesignImages.length})`}
            </button>
            <button 
              onClick={() => setSelectedCategory('cookies')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === 'cookies'
                  ? 'bg-pink-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-600'
              }`}
            >
              {`Cookies (${cookiesImages.length})`}
            </button>
          </div>

          {/* Gallery Grid - Filtered Images */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((num) => (
              <div key={num} className="relative group cursor-pointer">
                <Image
                  src={`/images/${num}.jpg`}
                  alt={`Custom cake ${num}`}
                  width={300}
                  height={300}
                  className="w-full h-64 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <svg className="w-8 h-8 text-white mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <p className="text-white text-sm font-medium capitalize">
                      {getImageCategory(num).replace('-', ' ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              {`Showing ${filteredImages.length} of ${allImages.length} photos`}
              {selectedCategory !== 'all' && (
                <span className="block text-sm text-pink-600 mt-1">
                  {selectedCategory.replace('-', ' ')} category
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-pink-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow us on social media for the latest creations and updates, or reach out directly for custom orders.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/shirascakes/"
          target="_blank"
          rel="noopener noreferrer"
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281H7.83c-.49 0-.875.385-.875.875v8.449c0 .49.385.875.875.875h8.449c.49 0 .875-.385.875-.875V8.582c0-.49-.385-.875-.875-.875z"/>
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-gray-800 mb-2">Instagram</h3>
              <p className="text-gray-600">@shirascakes</p>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/cakesbyshira"
          target="_blank"
          rel="noopener noreferrer"
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center group"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-gray-800 mb-4">Facebook</h3>
              <p className="text-gray-600">Cakes by Shira</p>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/12146776273"
          target="_blank"
          rel="noopener noreferrer"
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center group"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-

import React, { useState, useEffect } from 'react';

const Banner = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigation = [
    { name: "Home", href: "#" },
    { name: "About Us", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Donate", href: "#donate" },
    { name: "Contact", href: "#contact" },
  ];

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80",
      title: "Education Changes Lives",
      description: "Empowering communities through quality education and learning opportunities for every child.",
      ctaPrimary: "Support Education",
      ctaSecondary: "Learn More →"
    },
    {
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=1600&q=80",
      title: "Healthcare for All",
      description: "Bringing essential medical care and health services to underserved communities worldwide.",
      ctaPrimary: "Support Healthcare",
      ctaSecondary: "Our Programs →"
    },
    {
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80",
      title: "Clean Water Initiative",
      description: "Providing access to clean, safe drinking water and sanitation facilities for rural communities.",
      ctaPrimary: "Support Water",
      ctaSecondary: "Our Impact →"
    },
    {
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1600&q=80",
      title: "Women Empowerment",
      description: "Supporting women with skills training, microfinance, and leadership development programs.",
      ctaPrimary: "Empower Women",
      ctaSecondary: "Join Us →"
    }
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto slide functionality
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isHovered, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative bg-black">
      {/* Navbar */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/95 backdrop-blur-lg shadow-xl' : 'bg-transparent'
      }`}>
        <nav className="flex items-center justify-between p-6 lg:px-12">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <a href="#" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                <img
                  className="relative h-10 w-auto transform group-hover:scale-110 transition-transform duration-300"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Circle-icons-heart.svg/1024px-Circle-icons-heart.svg.png"
                  alt="NGO Logo"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Amar Jashore
              </span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="nav-link relative text-lg font-semibold text-white hover:text-cyan-400 transition-all duration-300 group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Donate Button */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a
              href="#donate"
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 transition-all duration-300 group"
            >
              <span className="relative z-10">Donate Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-3 text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transform hover:scale-105 transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute inset-x-0 top-full z-50 bg-black/95 backdrop-blur-lg shadow-2xl border-t border-cyan-500/20">
            <div className="p-6 space-y-4">
              {navigation.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-base font-semibold text-white hover:text-cyan-400 transition-all duration-300 transform hover:translate-x-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#donate"
                className="block w-full text-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-base font-bold text-white shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Donate Now
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with Page Turn Slider */}
      <div 
        className="slider-container w-full relative isolate h-screen overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 z-20 page-turn-in' : 'opacity-0 z-10'
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Dark Overlay with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-cyan-400/20 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                ></div>
              ))}
            </div>
            
            {/* Slide Content */}
            <div className="relative z-30 mx-auto max-w-4xl px-6 pt-32 text-center sm:pt-48 lg:pt-56 text-white">
              <div className="space-y-8">
                <h1 className={`text-reveal text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl ${
                  index === currentSlide ? 'animate-text-reveal' : ''
                }`}>
                  <span className="inline-block bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                    {slide.title}
                  </span>
                </h1>
                
                <p className={`text-reveal-delay text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto text-gray-200 ${
                  index === currentSlide ? 'animate-text-reveal-delay' : ''
                }`}>
                  {slide.description}
                </p>
                
                <div className={`button-reveal flex items-center justify-center gap-x-6 ${
                  index === currentSlide ? 'animate-button-reveal' : ''
                }`}>
                  <a
                    href="#donate"
                    className="relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-2xl hover:shadow-cyan-500/40 transform hover:scale-110 transition-all duration-300 group"
                  >
                    <span className="relative z-10">{slide.ctaPrimary}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    <div className="absolute inset-0 animate-pulse bg-white/10 rounded-full"></div>
                  </a>
                  
                  <a
                    href="#about"
                    className="text-lg font-semibold text-cyan-300 hover:text-white transition-all duration-300 group flex items-center gap-2"
                  >
                    <span>{slide.ctaSecondary}</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <div className="absolute bottom-8 left-0 right-0 z-40 flex justify-center space-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slider-indicator transition-all duration-500 ${
                index === currentSlide 
                  ? 'w-12 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full shadow-lg shadow-cyan-400/50' 
                  : 'w-3 h-3 bg-white/50 hover:bg-white/80 rounded-full'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button
          className={`absolute left-6 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-md p-4 text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 transform hover:scale-110 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}
          onClick={prevSlide}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          className={`absolute right-6 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-md p-4 text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 transform hover:scale-110 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
          onClick={nextSlide}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .slider-container {
          perspective: 2000px;
          width: 100%;
        }
        
        /* Page Turn Animation */
        @keyframes pageTurnIn {
          0% {
            transform: rotateY(-90deg);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: rotateY(0deg);
            opacity: 1;
          }
        }
        
        .page-turn-in {
          animation: pageTurnIn 1s ease-out;
          transform-origin: left center;
        }
        
        /* Text Reveal Animations */
        @keyframes textReveal {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.8);
            filter: blur(10px);
          }
          60% {
            opacity: 0.8;
            transform: translateY(10px) scale(0.95);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        
        @keyframes textRevealDelay {
          0% {
            opacity: 0;
            transform: translateY(30px);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }
        
        @keyframes buttonReveal {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-text-reveal {
          animation: textReveal 1.2s ease-out 0.3s both;
        }
        
        .animate-text-reveal-delay {
          animation: textRevealDelay 1s ease-out 0.8s both;
        }
        
        .animate-button-reveal {
          animation: buttonReveal 1s ease-out 1.2s both;
        }
        
        /* Glowing Effect */
        .glow-effect {
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #000;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #3b82f6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #2563eb);
        }
      `}</style>
    </div>
  );
};

export default Banner;
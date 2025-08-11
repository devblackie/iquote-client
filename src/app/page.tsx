'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import ColorThief from 'colorthief';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import CTAButton from './components/ui/buttons/CTAButton';
import { branding } from './config/branding';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Custom hook to detect screen size
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width >= 768 && width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

// Feature card component with image
const FeatureCard = ({
  title,
  description,
  imageSrc,
}: {
  title: string;
  description: string;
  imageSrc: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center"
  >
    <Image
      src={imageSrc}
      alt={title}
      width={200}
      height={150}
      className="object-cover rounded-md mb-4"
      loading="lazy"
    />
    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
    <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">{description}</p>
  </motion.div>
);

export default function Home() {
  const screenSize = useScreenSize();
  const [overlayColor, setOverlayColor] = useState('bg-blue-900/50');
  const imgRef = useRef<HTMLImageElement>(null);

  // Use provided image paths
  const heroImage = {
    mobile: '/mobile-bg.png',
    tablet: '/images/tablet-hero.jpeg',
    desktop: '/desktop-bg.png',
  }[screenSize];

  // Feature card data with images
  const features = [
    {
      title: 'Comprehensive Coverage',
      description:
        'Choose from Inpatient, Outpatient, Maternity, Optical, Dental, and Last Expense plans.',
      imageSrc: '/family.jpg',
    },
    {
      title: 'Trusted Insurers',
      description:
        'Partner with Jubilee Insurance, AAR Shwari, and Old Mutual for reliable coverage.',
      imageSrc: '/desktop-bg.jpeg',
    },
    {
      title: 'Easy Management',
      description: 'Manage beneficiaries and request information with our user-friendly platform.',
      imageSrc: '/images/management.jpeg',
    },
     {
      title: 'Comprehensive Coverage',
      description:
        'Choose from Inpatient, Outpatient, Maternity, Optical, Dental, and Last Expense plans.',
      imageSrc: '/family.jpg',
    },
    {
      title: 'Trusted Insurers',
      description:
        'Partner with Jubilee Insurance, AAR Shwari, and Old Mutual for reliable coverage.',
      imageSrc: '/desktop-bg.jpeg',
    },
  ];

  // Extract dominant color using ColorThief
  useEffect(() => {
    const colorThief = new ColorThief();
    const img = imgRef.current;

    if (img && img.complete) {
      try {
        const [r, g, b] = colorThief.getColor(img);
        const opacity = document.documentElement.classList.contains('dark') ? 0.6 : 0.5;
        setOverlayColor(`bg-[rgb(${r},${g},${b},0.5)] dark:bg-[rgb(${r},${g},${b},0.6)]`);
      } catch (error) {
        console.error('Error extracting color:', error);
        setOverlayColor('bg-blue-900/50 dark:bg-gray-900/60');
      }
    } else if (img) {
      img.addEventListener('load', () => {
        try {
          const [r, g, b] = colorThief.getColor(img);
          const opacity = document.documentElement.classList.contains('dark') ? 0.6 : 0.5;
          setOverlayColor(`bg-[rgb(${r},${g},${b},0.5)] dark:bg-[rgb(${r},${g},${b},0.6)]`);
        } catch (error) {
          console.error('Error extracting color:', error);
          setOverlayColor('bg-blue-900/50 dark:bg-gray-900/60');
        }
      });
    }
  }, [heroImage]);

  return (
    <>
      {/* Hero Section */}
      <div className="relative container mx-auto py-12 md:py-20 text-center px-4 min-w-full">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src={heroImage}
            alt={`${branding.appName} Hero Background`}
            fill
            className="object-cover object-center"
            priority
            quality={80}
            ref={imgRef}
          />
          <div className={`absolute inset-0 ${overlayColor} transition-colors duration-300`}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] relative z-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-primary-light drop-shadow-md">
            Welcome to {branding.appName}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-100 dark:text-gray-300 max-w-2xl drop-shadow-sm">
            {branding.tagLine}
          </p>
          <Link href="/auth/register">
            <CTAButton
              bgColor="bg-primary dark:bg-primary-dark"
              textColor="text-white dark:text-gray-100"
              ariaLabel={`Get started with ${branding.appName}`}
            >
              Get Started
            </CTAButton>
          </Link>
        </motion.div>

           {/* Additional Content Section */}
   
      </div>

      {/* Additional Content Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 ">
        <div className="container mx-auto px-4">
          {/* Feature Cards Carousel */}
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
            Why Choose {branding.appName}?
          </h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="pb-12"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index}>
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  imageSrc={feature.imageSrc}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Secondary CTA */}
          <div className="text-center mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Ready to Explore More?
            </h2>
            <Link href="/client/products">
              <CTAButton
                bgColor="bg-secondary dark:bg-secondary-dark"
                textColor="text-gray-800 dark:text-gray-100"
                ariaLabel={`Explore ${branding.appName} products`}
              >
                View Products
              </CTAButton>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
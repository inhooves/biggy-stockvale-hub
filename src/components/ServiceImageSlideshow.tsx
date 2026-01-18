import React from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

// Import all service images
import groceriesBag from '@/assets/groceries-bag.jpeg';
import burialSupport from '@/assets/burial-support.jpeg';
import savingsJar from '@/assets/savings-jar.jpeg';
import investmentGrowth from '@/assets/investment-growth.jpeg';
import burialHero from '@/assets/burial-hero.jpeg';
import groceriesHero from '@/assets/groceries-hero.jpeg';
import investmentsHero from '@/assets/investments-hero.jpeg';
import savingsClubJar from '@/assets/savings-club-jar.jpeg';

const serviceImages = [
  { src: groceriesBag, alt: 'Biggy Groceries - Bulk buying savings', link: '/services/groceries' },
  { src: burialHero, alt: 'Biggy Burial Society - Community support', link: '/services/burial' },
  { src: savingsJar, alt: 'Biggy Savings Club - Save together', link: '/services/savings' },
  { src: investmentsHero, alt: 'Biggy Investments - Grow your wealth', link: '/services/investments' },
  { src: burialSupport, alt: 'Biggy Burial Society - We care', link: '/services/burial' },
  { src: groceriesHero, alt: 'Biggy Groceries - Fresh produce', link: '/services/groceries' },
  { src: savingsClubJar, alt: 'Biggy Savings - Travel dreams', link: '/services/savings' },
  { src: investmentGrowth, alt: 'Biggy Investments - Financial growth', link: '/services/investments' },
];

export function ServiceImageSlideshow() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h3 className="text-xl md:text-2xl font-semibold text-center mb-6 text-foreground">
          Our Stokvel Services
        </h3>
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {serviceImages.map((image, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Link to={image.link} className="block">
                  <div className="aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12" />
          <CarouselNext className="hidden md:flex -right-12" />
        </Carousel>
      </div>
    </section>
  );
}

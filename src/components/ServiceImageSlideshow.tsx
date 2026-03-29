import React from 'react';
import { Link } from 'react-router-dom';

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

const duplicatedImages = [...serviceImages, ...serviceImages];

export function ServiceImageSlideshow() {
  return (
    <section className="py-10 md:py-14 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
      <div className="relative w-full">
        <div className="flex animate-scroll-slow hover:pause-animation">
          {duplicatedImages.map((image, index) => (
            <Link
              key={index}
              to={image.link}
              className="flex-shrink-0 w-[264px] md:w-[370px] lg:w-[422px] px-3"
            >
              <div className="aspect-square overflow-hidden rounded-2xl shadow-lg cursor-pointer group">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

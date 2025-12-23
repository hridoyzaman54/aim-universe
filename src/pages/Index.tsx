import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CourseCategoriesSection from '@/components/home/CourseCategoriesSection';
import TinyExplorersPreview from '@/components/home/TinyExplorersPreview';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/layout/Footer';

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <CourseCategoriesSection />
      <TinyExplorersPreview />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </Layout>
  );
};

export default Index;

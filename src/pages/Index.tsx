import React from 'react';
import Layout from '@/components/layout/Layout';
import EnhancedHeroSection from '@/components/home/EnhancedHeroSection';
import EnhancedFeaturesSection from '@/components/home/EnhancedFeaturesSection';
import CourseCategoriesSection from '@/components/home/CourseCategoriesSection';
import TinyExplorersPreview from '@/components/home/TinyExplorersPreview';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/layout/Footer';

const Index: React.FC = () => {
  return (
    <Layout>
      <EnhancedHeroSection />
      <EnhancedFeaturesSection />
      <CourseCategoriesSection />
      <TinyExplorersPreview />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </Layout>
  );
};

export default Index;

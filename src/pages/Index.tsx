import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CourseCategoriesSection from '@/components/home/CourseCategoriesSection';
import TinyExplorersPreview from '@/components/home/TinyExplorersPreview';
import Footer from '@/components/layout/Footer';

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <CourseCategoriesSection />
      <TinyExplorersPreview />
      <Footer />
    </Layout>
  );
};

export default Index;

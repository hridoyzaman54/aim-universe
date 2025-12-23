import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.dashboard': 'Dashboard',
    'nav.tinyExplorers': 'Tiny Explorers',
    'nav.questLab': 'Quest Lab',
    'nav.aimverse': 'AIMverse',
    'nav.counseling': 'Counseling',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    
    // Hero
    'hero.tagline': 'Aim High, Achieve Infinity',
    'hero.title': 'AIM Centre 360',
    'hero.subtitle': 'Knowledge for anybody, anywhere, anytime',
    'hero.description': 'A national-scale, AI-powered learning universe where education meets innovation. From preschool to professional, we transform how you learn.',
    'hero.cta.explore': 'Explore Courses',
    'hero.cta.start': 'Start Learning',
    
    // Features
    'features.title': 'Learning Reimagined',
    'features.subtitle': 'Experience education like never before',
    'features.ai.title': 'AI-Powered Learning',
    'features.ai.description': 'Personalized study paths with intelligent tutoring',
    'features.live.title': 'Live Classes',
    'features.live.description': 'Real-time interactive sessions with expert teachers',
    'features.special.title': 'Special Needs Support',
    'features.special.description': 'Adaptive learning for every ability level',
    'features.streaming.title': 'Premium Streaming',
    'features.streaming.description': 'Cinema-quality educational content',
    
    // Courses
    'courses.title': 'Course Categories',
    'courses.english': 'English Version',
    'courses.bangla': 'Bangla Version (NCTB)',
    'courses.medium': 'English Medium',
    'courses.creative': 'Creative Studio',
    'courses.special': 'Special Needs',
    'courses.tiny': 'Tiny Explorers',
    
    // Tiny Explorers
    'tiny.title': 'Tiny Explorers',
    'tiny.subtitle': 'Where Learning Becomes Play!',
    'tiny.description': 'A magical world for preschoolers and kindergarteners',
    'tiny.alphabets': 'Alphabets & Phonics',
    'tiny.numbers': 'Numbers & Counting',
    'tiny.shapes': 'Shapes & Colors',
    'tiny.rhymes': 'Rhymes & Songs',
    'tiny.science': 'Science Curiosity',
    'tiny.stories': 'Moral Stories',
    
    // Common
    'common.viewAll': 'View All',
    'common.learnMore': 'Learn More',
    'common.getStarted': 'Get Started',
    'common.watchNow': 'Watch Now',
    'common.continue': 'Continue',
    'common.progress': 'Progress',
  },
  bn: {
    // Navigation
    'nav.home': 'হোম',
    'nav.courses': 'কোর্স',
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.tinyExplorers': 'ছোট অনুসন্ধানী',
    'nav.questLab': 'কোয়েস্ট ল্যাব',
    'nav.aimverse': 'এইমভার্স',
    'nav.counseling': 'কাউন্সেলিং',
    'nav.login': 'লগইন',
    'nav.signup': 'সাইন আপ',
    
    // Hero
    'hero.tagline': 'উচ্চ লক্ষ্য, অসীম সাফল্য',
    'hero.title': 'এইম সেন্টার ৩৬০',
    'hero.subtitle': 'যে কারো জন্য, যে কোথাও, যে কোনো সময় জ্ঞান',
    'hero.description': 'একটি জাতীয় স্কেলের, AI-চালিত শিক্ষা মহাবিশ্ব যেখানে শিক্ষা উদ্ভাবনের সাথে মিলিত হয়। প্রি-স্কুল থেকে পেশাদার পর্যন্ত, আমরা আপনার শেখার পদ্ধতি পরিবর্তন করি।',
    'hero.cta.explore': 'কোর্স অন্বেষণ করুন',
    'hero.cta.start': 'শেখা শুরু করুন',
    
    // Features
    'features.title': 'নতুন করে শেখা',
    'features.subtitle': 'এমনভাবে শিক্ষা অনুভব করুন যা আগে কখনো হয়নি',
    'features.ai.title': 'AI-চালিত শিক্ষা',
    'features.ai.description': 'বুদ্ধিমান টিউটরিং সহ ব্যক্তিগতকৃত অধ্যয়ন পথ',
    'features.live.title': 'লাইভ ক্লাস',
    'features.live.description': 'বিশেষজ্ঞ শিক্ষকদের সাথে রিয়েল-টাইম ইন্টারেক্টিভ সেশন',
    'features.special.title': 'বিশেষ চাহিদা সহায়তা',
    'features.special.description': 'প্রতিটি ক্ষমতা স্তরের জন্য অভিযোজিত শেখা',
    'features.streaming.title': 'প্রিমিয়াম স্ট্রিমিং',
    'features.streaming.description': 'সিনেমা-মানের শিক্ষামূলক বিষয়বস্তু',
    
    // Courses
    'courses.title': 'কোর্স বিভাগ',
    'courses.english': 'ইংরেজি সংস্করণ',
    'courses.bangla': 'বাংলা সংস্করণ (NCTB)',
    'courses.medium': 'ইংলিশ মিডিয়াম',
    'courses.creative': 'ক্রিয়েটিভ স্টুডিও',
    'courses.special': 'বিশেষ চাহিদা',
    'courses.tiny': 'ছোট অনুসন্ধানী',
    
    // Tiny Explorers
    'tiny.title': 'ছোট অনুসন্ধানী',
    'tiny.subtitle': 'যেখানে শেখা খেলায় পরিণত হয়!',
    'tiny.description': 'প্রি-স্কুলার এবং কিন্ডারগার্টেনদের জন্য একটি জাদুকরী জগৎ',
    'tiny.alphabets': 'বর্ণমালা ও উচ্চারণ',
    'tiny.numbers': 'সংখ্যা ও গণনা',
    'tiny.shapes': 'আকৃতি ও রং',
    'tiny.rhymes': 'ছড়া ও গান',
    'tiny.science': 'বিজ্ঞান কৌতূহল',
    'tiny.stories': 'নৈতিক গল্প',
    
    // Common
    'common.viewAll': 'সব দেখুন',
    'common.learnMore': 'আরো জানুন',
    'common.getStarted': 'শুরু করুন',
    'common.watchNow': 'এখনই দেখুন',
    'common.continue': 'চালিয়ে যান',
    'common.progress': 'অগ্রগতি',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('aim-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aim-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
    // Apply Bangla font class when Bangla is selected
    if (language === 'bn') {
      document.documentElement.classList.add('font-bangla');
    } else {
      document.documentElement.classList.remove('font-bangla');
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

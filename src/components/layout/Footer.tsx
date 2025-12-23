import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Phone, MapPin, Facebook, Youtube, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/ui/ScrollReveal';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const footerLinks = [
    {
      title: 'Learning',
      links: [
        { label: t('nav.courses'), path: '/courses' },
        { label: t('nav.tinyExplorers'), path: '/tiny-explorers' },
        { label: t('nav.questLab'), path: '/quest-lab' },
        { label: t('nav.aimverse'), path: '/aimverse' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: t('nav.counseling'), path: '/counseling' },
        { label: 'Help Center', path: '/help' },
        { label: 'Contact Us', path: '/contact' },
        { label: 'FAQ', path: '/faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
      ],
    },
  ];

  return (
    <footer className="relative bg-card border-t border-border">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <ScrollReveal animation="fadeUp" className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              >
                <Sparkles className="w-5 md:w-7 h-5 md:h-7 text-primary-foreground" />
              </motion.div>
              <div>
                <h3 className="font-display font-bold text-lg md:text-xl text-foreground">AIM Centre 360</h3>
                <p className="text-xs md:text-sm text-primary">{t('hero.tagline')}</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4 md:mb-6 max-w-md text-sm md:text-base">
              {t('hero.subtitle')}. Transforming education through innovation, AI, and inclusive learning experiences.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 md:space-y-3">
              <a href="mailto:info@aimcentre360.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-sm md:text-base">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@aimcentre360.com</span>
              </a>
              <a href="tel:+8801234567890" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-sm md:text-base">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+880 1234-567890</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground text-sm md:text-base">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Links */}
          {footerLinks.map((section, index) => (
            <ScrollReveal key={section.title} animation="fadeUp" delay={0.1 * (index + 1)}>
              <h4 className="font-display font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">{section.title}</h4>
              <ul className="space-y-2 md:space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom Bar */}
        <ScrollReveal animation="fadeUp" delay={0.4}>
          <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} AIM Centre 360. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 md:gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Facebook className="w-4 md:w-5 h-4 md:h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Youtube className="w-4 md:w-5 h-4 md:h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Linkedin className="w-4 md:w-5 h-4 md:h-5" />
              </motion.a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  X, 
  Search, 
  MessageCircle, 
  HelpCircle, 
  BookOpen,
  Phone,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActionItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  color: string;
}

const actions: ActionItem[] = [
  {
    icon: Search,
    label: 'Search Courses',
    href: '/courses',
    color: 'bg-cyan-500 hover:bg-cyan-600',
  },
  {
    icon: BookOpen,
    label: 'Browse Courses',
    href: '/courses',
    color: 'bg-teal-500 hover:bg-teal-600',
  },
  {
    icon: MessageCircle,
    label: 'Live Chat',
    onClick: () => console.log('Open chat'),
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    icon: HelpCircle,
    label: 'Help Center',
    href: '/dashboard',
    color: 'bg-amber-500 hover:bg-amber-600',
  },
  {
    icon: Mail,
    label: 'Contact Us',
    onClick: () => window.location.href = 'mailto:support@aimcentre.com',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
];

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.8,
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.8,
      transition: {
        duration: 0.15,
      },
    },
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col-reverse items-end gap-3">
      {/* Action Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col-reverse gap-3 mb-2"
          >
            {actions.map((action, index) => {
              const ActionWrapper = action.href ? Link : 'button';
              const wrapperProps = action.href 
                ? { to: action.href } 
                : { onClick: action.onClick };

              return (
                <motion.div
                  key={action.label}
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  {/* Label tooltip */}
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm font-medium text-foreground shadow-lg whitespace-nowrap"
                  >
                    {action.label}
                  </motion.span>

                  {/* Action button */}
                  <ActionWrapper
                    {...(wrapperProps as any)}
                    onClick={() => {
                      action.onClick?.();
                      setIsOpen(false);
                    }}
                    className={`w-12 h-12 rounded-full ${action.color} text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110`}
                  >
                    <action.icon className="w-5 h-5" />
                  </ActionWrapper>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl transition-colors duration-200 hover:bg-primary/90"
      >
        {/* Pulse ring when closed */}
        {!isOpen && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-primary"
              animate={{ 
                scale: [1, 1.3, 1.3],
                opacity: [0.5, 0, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-primary"
              animate={{ 
                scale: [1, 1.5, 1.5],
                opacity: [0.3, 0, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.5,
              }}
            />
          </>
        )}

        {/* Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </motion.div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm -z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionButton;

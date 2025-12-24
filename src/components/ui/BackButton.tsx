import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  className?: string;
  fallbackPath?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = '', fallbackPath = '/' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={className}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="gap-2 text-muted-foreground hover:text-foreground group"
      >
        <motion.div
          whileHover={{ x: -3 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.div>
        <span className="hidden sm:inline">Back</span>
      </Button>
    </motion.div>
  );
};

export default BackButton;

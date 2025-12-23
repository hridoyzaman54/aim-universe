import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Baby, 
  Star, 
  Sparkles, 
  Music, 
  Palette, 
  BookOpen,
  ArrowRight,
  Heart,
  Play,
  Users
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const activities = [
  { 
    id: 'alphabets',
    icon: '🔤', 
    label: 'Alphabets & Phonics', 
    color: 'bg-tiny-yellow',
    description: 'Learn A-Z with fun sounds!',
    lessons: 26
  },
  { 
    id: 'numbers',
    icon: '🔢', 
    label: 'Numbers & Counting', 
    color: 'bg-tiny-teal',
    description: 'Count from 1 to 100!',
    lessons: 20
  },
  { 
    id: 'shapes',
    icon: '🎨', 
    label: 'Shapes & Colors', 
    color: 'bg-tiny-pink',
    description: 'Discover colorful shapes!',
    lessons: 15
  },
  { 
    id: 'rhymes',
    icon: '🎵', 
    label: 'Rhymes & Songs', 
    color: 'bg-tiny-purple',
    description: 'Sing along and learn!',
    lessons: 30
  },
  { 
    id: 'science',
    icon: '🧪', 
    label: 'Science Curiosity', 
    color: 'bg-tiny-green',
    description: 'Explore the world around!',
    lessons: 18
  },
  { 
    id: 'stories',
    icon: '📚', 
    label: 'Moral Stories', 
    color: 'bg-tiny-orange',
    description: 'Beautiful tales to learn from!',
    lessons: 25
  },
];

const featuredVideos = [
  {
    id: 1,
    title: 'ABC Song with Animals',
    thumbnail: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=225&fit=crop',
    duration: '3:45',
    views: '25K',
  },
  {
    id: 2,
    title: 'Counting 1-10 with Dinosaurs',
    thumbnail: 'https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=400&h=225&fit=crop',
    duration: '5:12',
    views: '18K',
  },
  {
    id: 3,
    title: 'Rainbow Colors Song',
    thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=225&fit=crop',
    duration: '4:20',
    views: '32K',
  },
];

const TinyExplorers: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Custom Tiny Explorers Theme */}
      <div className="tiny-explorers min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-pink-50">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          {/* Floating Decorations */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-10 left-10 text-7xl"
          >
            🌟
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-20 right-20 text-6xl"
          >
            🎈
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-20 left-20 text-5xl"
          >
            🦋
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute bottom-10 right-10 text-6xl"
          >
            🌈
          </motion.div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              {/* Mascot */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                🧸
              </motion.div>

              <motion.h1
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="font-display text-5xl md:text-7xl font-bold mb-4"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500">
                  {t('tiny.title')}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl text-gray-600 mb-8"
              >
                {t('tiny.subtitle')} 🎉
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-500 mb-8"
              >
                {t('tiny.description')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  size="lg"
                  className="tiny-button bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xl px-10 py-7"
                >
                  <Sparkles className="mr-2 w-6 h-6" />
                  Start Playing!
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Activities Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
            >
              Choose Your Adventure! 🚀
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: [-1, 1, 0], y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${activity.color} tiny-card cursor-pointer border-white/50`}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    className="text-6xl mb-4"
                  >
                    {activity.icon}
                  </motion.div>
                  <h3 className="font-display text-xl font-bold text-gray-800 mb-2">
                    {activity.label}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 bg-white/50 px-3 py-1 rounded-full">
                      {activity.lessons} lessons
                    </span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center"
                    >
                      <ArrowRight className="w-4 h-4 text-gray-600" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Videos */}
        <section className="py-16 bg-white/50">
          <div className="container mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
            >
              Popular Videos 📺
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {featuredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer group"
                  style={{ boxShadow: '0 8px 0 rgba(0,0,0,0.1)' }}
                >
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
                      >
                        <Play className="w-8 h-8 text-orange-500 ml-1" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/60 text-white text-xs font-bold">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-gray-800 mb-2">{video.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{video.views} views</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Badge */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center p-8 rounded-3xl bg-gradient-to-r from-green-100 to-teal-100 border-4 border-green-200"
            >
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="font-display text-2xl font-bold text-gray-800 mb-2">
                Safe & Parent Approved
              </h3>
              <p className="text-gray-600">
                No chat features • Parental controls • Age-appropriate content • Ad-free experience
              </p>
            </motion.div>
          </div>
        </section>

        {/* Back to Main */}
        <div className="py-8 text-center">
          <Link to="/">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
              ← Back to AIM Centre 360
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default TinyExplorers;

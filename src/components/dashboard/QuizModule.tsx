import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, CheckCircle, XCircle, Sparkles, 
  Trophy, RotateCcw, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const adminQuestions: Question[] = [
  {
    id: 1,
    question: "What is the capital of Bangladesh?",
    options: ["Chittagong", "Dhaka", "Sylhet", "Rajshahi"],
    correctAnswer: 1,
    explanation: "Dhaka is the capital and largest city of Bangladesh, located on the banks of the Buriganga River."
  },
  {
    id: 2,
    question: "Which formula represents the Pythagorean theorem?",
    options: ["a + b = c", "a² + b² = c²", "a × b = c", "a - b = c"],
    correctAnswer: 1,
    explanation: "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides."
  },
  {
    id: 3,
    question: "What is photosynthesis?",
    options: ["Breaking down food", "Converting light to energy", "Cellular respiration", "Water absorption"],
    correctAnswer: 1,
    explanation: "Photosynthesis is the process by which plants convert light energy into chemical energy (glucose) using carbon dioxide and water."
  }
];

const aiQuestions: Question[] = [
  {
    id: 1,
    question: "If you have 3 apples and give away 1, how many do you have left?",
    options: ["1", "2", "3", "4"],
    correctAnswer: 1,
    explanation: "3 - 1 = 2. When you subtract 1 from 3, you get 2 apples remaining."
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    explanation: "Mars is called the Red Planet because of iron oxide (rust) on its surface, giving it a reddish appearance."
  },
  {
    id: 3,
    question: "What is H2O commonly known as?",
    options: ["Salt", "Sugar", "Water", "Oil"],
    correctAnswer: 2,
    explanation: "H2O is the chemical formula for water - two hydrogen atoms bonded to one oxygen atom."
  }
];

interface QuizModuleProps {
  lessonId?: string;
}

const QuizModule: React.FC<QuizModuleProps> = () => {
  const [mode, setMode] = useState<'select' | 'admin' | 'practice'>('select');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = mode === 'admin' ? adminQuestions : aiQuestions;
  const question = questions[currentQuestion];

  const handleStartQuiz = async (selectedMode: 'admin' | 'practice') => {
    if (selectedMode === 'practice') {
      setIsGenerating(true);
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsGenerating(false);
    }
    setMode(selectedMode);
    setCurrentQuestion(0);
    setScore(0);
    setQuizComplete(false);
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleReset = () => {
    setMode('select');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  };

  if (mode === 'select') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          Quiz Center
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="p-6 cursor-pointer hover:border-primary/50 transition-all group"
              onClick={() => handleStartQuiz('admin')}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Official Quiz</h3>
              <p className="text-sm text-muted-foreground">
                Take admin-provided quizzes for your enrolled lessons. Scores count towards your grade.
              </p>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="p-6 cursor-pointer hover:border-accent/50 transition-all group"
              onClick={() => handleStartQuiz('practice')}
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Practice Mode</h3>
              <p className="text-sm text-muted-foreground">
                AI-generated practice questions with instant answers and detailed explanations.
              </p>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Generating AI practice questions...</p>
      </motion.div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
        >
          <Trophy className="w-12 h-12 text-primary" />
        </motion.div>
        
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Quiz Complete!
        </h2>
        <p className="text-4xl font-bold text-primary mb-2">{percentage}%</p>
        <p className="text-muted-foreground mb-6">
          You scored {score} out of {questions.length}
        </p>
        
        <Button onClick={handleReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Try Another Quiz
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {mode === 'practice' ? (
            <Sparkles className="w-5 h-5 text-accent" />
          ) : (
            <Trophy className="w-5 h-5 text-primary" />
          )}
          <span className="text-sm font-medium text-muted-foreground">
            {mode === 'practice' ? 'Practice Mode' : 'Official Quiz'}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          className="h-full bg-primary rounded-full"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-foreground">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correctAnswer;
              const isSelected = selectedAnswer === index;
              
              let bgClass = 'bg-secondary hover:bg-secondary/80';
              if (showResult) {
                if (isCorrect) bgClass = 'bg-green-500/20 border-green-500';
                else if (isSelected) bgClass = 'bg-red-500/20 border-red-500';
              }

              return (
                <motion.button
                  key={index}
                  whileHover={!showResult ? { scale: 1.01 } : {}}
                  whileTap={!showResult ? { scale: 0.99 } : {}}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${bgClass} ${
                    showResult ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    showResult && isCorrect ? 'bg-green-500 text-white' :
                    showResult && isSelected ? 'bg-red-500 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {showResult && isCorrect ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : showResult && isSelected ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  <span className="text-foreground">{option}</span>
                </motion.button>
              );
            })}
          </div>

          {showResult && mode === 'practice' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-primary/10 border border-primary/20"
            >
              <p className="text-sm font-medium text-primary mb-1">Explanation:</p>
              <p className="text-sm text-foreground">{question.explanation}</p>
            </motion.div>
          )}

          {showResult && (
            <div className="flex justify-end">
              <Button onClick={handleNext}>
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default QuizModule;

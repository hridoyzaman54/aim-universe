import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Award, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questions: QuizQuestion[];
  passingScore: number; // percentage
}

interface InteractiveQuizProps {
  quiz: Quiz;
  onComplete: (results: QuizResults) => void;
  onCancel: () => void;
}

export interface QuizResults {
  quizId: string;
  score: number;
  totalQuestions: number;
  timeTaken: string;
  answers: { questionId: string; selectedAnswer: number; correct: boolean }[];
  passed: boolean;
}

const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ quiz, onComplete, onCancel }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60); // convert to seconds
  const [quizStartTime] = useState(Date.now());
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);

  // Timer countdown
  useEffect(() => {
    if (showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
    const timeTakenFormatted = formatTime(timeTaken);

    const questionResults = quiz.questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: answers[q.id] ?? -1,
      correct: answers[q.id] === q.correctAnswer,
    }));

    const score = questionResults.filter((r) => r.correct).length;
    const percentage = (score / quiz.questions.length) * 100;
    const passed = percentage >= quiz.passingScore;

    const quizResults: QuizResults = {
      quizId: quiz.id,
      score,
      totalQuestions: quiz.questions.length,
      timeTaken: timeTakenFormatted,
      answers: questionResults,
      passed,
    };

    setResults(quizResults);
    setShowResults(true);
  };

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const allQuestionsAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);

  if (showResults && results) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Results Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 ${
              results.passed ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}
          >
            {results.passed ? (
              <Award className="w-16 h-16 text-green-500" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </motion.div>

          <h2 className="text-4xl font-bold text-foreground mb-2">
            {results.passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {results.passed ? 'You passed the quiz!' : 'You need more practice.'}
          </p>

          {/* Score Display */}
          <Card className="p-8 mb-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl font-bold text-primary mb-2">
                  {results.score}/{results.totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div>
                <div className={`text-5xl font-bold mb-2 ${
                  results.passed ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.round((results.score / results.totalQuestions) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-accent mb-2">{results.timeTaken}</div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </div>
            </div>
          </Card>

          {/* Question Review */}
          <Card className="p-6 mb-6 text-left">
            <h3 className="text-xl font-bold mb-4 text-foreground">Review Your Answers</h3>
            <div className="space-y-4">
              {quiz.questions.map((q, index) => {
                const answer = results.answers.find((a) => a.questionId === q.id);
                const isCorrect = answer?.correct;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border ${
                      isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <XCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground mb-2">
                          {index + 1}. {q.question}
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="text-muted-foreground">
                            Your answer: <span className={isCorrect ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                              {answer?.selectedAnswer !== undefined && answer.selectedAnswer >= 0
                                ? q.options[answer.selectedAnswer]
                                : 'Not answered'}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div className="text-green-600 font-semibold">
                              Correct answer: {q.options[q.correctAnswer]}
                            </div>
                          )}
                          {q.explanation && (
                            <div className="mt-2 p-3 bg-background/50 rounded border border-border">
                              <div className="text-xs font-semibold text-muted-foreground mb-1">Explanation:</div>
                              <div className="text-sm text-foreground">{q.explanation}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={onCancel}
              className="px-8"
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={() => onComplete(results)}
              className="px-8 bg-gradient-to-r from-primary to-accent"
            >
              Continue
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{quiz.title}</h2>
            <p className="text-sm text-muted-foreground">{quiz.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeLeft < 60 ? 'bg-red-500/20 text-red-600' : 'bg-primary/20 text-primary'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </div>
      </Card>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 mb-6">
            <h3 className="text-xl font-bold text-foreground mb-6">{question.question}</h3>

            <RadioGroup
              value={answers[question.id]?.toString()}
              onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
            >
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <Label
                    key={index}
                    htmlFor={`${question.id}-${index}`}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[question.id] === index
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value={index.toString()} id={`${question.id}-${index}`} />
                    <span className="flex-1 text-foreground">{option}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              {quiz.questions.filter((q) => answers[q.id] !== undefined).length} of {quiz.questions.length} answered
            </div>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
                className="gap-2 bg-gradient-to-r from-primary to-accent"
              >
                Submit Quiz
                <CheckCircle className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InteractiveQuiz;

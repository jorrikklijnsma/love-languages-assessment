import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '../types';

interface QuestionScreenProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerAndAdvance: (index: number) => void;
  onPrevious: () => void;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
  questionNumber: number;
  totalQuestions: number;
  allAnswers: (number | null)[];
}

export default function QuestionScreen({
  question,
  selectedAnswer,
  onAnswerAndAdvance,
  onPrevious,
  canGoPrevious,
  questionNumber,
  totalQuestions,
  allAnswers,
}: QuestionScreenProps) {
  const optionsRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Number keys 1-9
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (index < question.options.length) {
          // Select and advance with small delay for visual feedback
          setTimeout(() => {
            onAnswerAndAdvance(index);
          }, 200);
        }
      }
      
      // Arrow left for previous
      if (e.key === 'ArrowLeft' && canGoPrevious) {
        onPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [question.options.length, onAnswerAndAdvance, onPrevious, canGoPrevious]);

  const handleOptionClick = (index: number) => {
    // Select and advance with small delay for visual feedback
    setTimeout(() => {
      onAnswerAndAdvance(index);
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Progress Dots */}
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const isAnswered = allAnswers[index] !== null;
              const isCurrent = index === questionNumber - 1;
              
              return (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg scale-125'
                      : isAnswered
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-md'
                      : 'bg-gray-200'
                  }`}
                  animate={isCurrent ? { 
                    scale: [1.2, 1.4, 1.2],
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: isCurrent ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </div>
          <div className="text-center text-sm text-gray-500 font-medium">
            Question {questionNumber} of {totalQuestions}
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm shadow-2xl border-0 overflow-hidden relative">
            {/* Decorative gradient blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -z-10 transform translate-x-32 -translate-y-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10 transform -translate-x-48 translate-y-48" />
            
            <CardHeader className="pb-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <CardTitle className="text-2xl md:text-3xl leading-relaxed font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {question.text}
                </CardTitle>
              </motion.div>
            </CardHeader>
            
            <CardContent className="space-y-3" ref={optionsRef}>
              {question.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => handleOptionClick(index)}
                    className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border-2 relative overflow-hidden group ${
                      selectedAnswer === index
                        ? 'border-purple-500 bg-gradient-to-r from-purple-100 to-pink-100 shadow-lg scale-[1.02]'
                        : 'border-gray-200 bg-white/80 hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-md'
                    }`}
                  >
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    {/* Keyboard shortcut badge */}
                    <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      selectedAnswer === index
                        ? 'bg-purple-500 text-white scale-110'
                        : 'bg-gray-100 text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div className="relative flex items-center gap-4">
                      {/* Radio circle with animation */}
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                        selectedAnswer === index
                          ? 'border-purple-500 bg-purple-500 shadow-lg'
                          : 'border-gray-300 group-hover:border-purple-400'
                      }`}>
                        <motion.div
                          initial={false}
                          animate={selectedAnswer === index ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-full h-full rounded-full bg-white flex items-center justify-center"
                        >
                          {selectedAnswer === index && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-3 h-3 rounded-full bg-purple-500"
                            />
                          )}
                        </motion.div>
                      </div>
                      
                      <span className={`text-base md:text-lg leading-relaxed transition-colors duration-300 ${
                        selectedAnswer === index
                          ? 'text-purple-900 font-medium'
                          : 'text-gray-700 group-hover:text-purple-800'
                      }`}>
                        {option.text}
                      </span>
                    </div>
                  </button>
                </motion.div>
              ))}
              
              {/* Keyboard hints */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-4 text-center text-sm text-gray-500"
              >
                <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
                  <span className="text-xs">💡 Tip:</span>
                  <span>Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">1-{question.options.length}</kbd> or click to select</span>
                  {canGoPrevious && (
                    <span className="ml-2">• <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">←</kbd> to go back</span>
                  )}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
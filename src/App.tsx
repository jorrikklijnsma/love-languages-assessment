import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import IntroScreen from './components/IntroScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultsScreen from './components/ResultsScreen';
import SaveLoadModal from './components/SaveLoadModal';
import type { Question, Scores, ConclusionsData } from './types';

interface SavedProgress {
  name: string;
  timestamp: string;
  currentQuestionIndex: number;
  answers: (number | null)[];
  questions: Question[];
}

function App() {
  const [screen, setScreen] = useState<'intro' | 'questions' | 'results'>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [conclusions, setConclusions] = useState<ConclusionsData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [scores, setScores] = useState<Scores>({
    receiving: {
      words: 0,
      quality_time: 0,
      service: 0,
      touch: 0,
      gifts: 0,
    },
    giving: {
      words: 0,
      quality_time: 0,
      service: 0,
      touch: 0,
      gifts: 0,
    },
  });

  // Load JSON data
  useEffect(() => {
    Promise.all([
      fetch('/questionnaire.json').then(res => res.json()),
      fetch('/conclusions.json').then(res => res.json())
    ]).then(([questionData, conclusionData]) => {
      const shuffled = [...questionData.questions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setAnswers(new Array(shuffled.length).fill(null));
      setConclusions(conclusionData);

      // Try to load from localStorage
      const saved = localStorage.getItem('love-language-progress');
      if (saved) {
        try {
          const progress: SavedProgress = JSON.parse(saved);
          const savedDate = new Date(progress.timestamp);
          const daysDiff = (Date.now() - savedDate.getTime()) / (1000 * 60 * 60 * 24);
          if (daysDiff < 7) {
            setQuestions(progress.questions);
            setAnswers(progress.answers);
            setCurrentQuestionIndex(progress.currentQuestionIndex);
            if (progress.currentQuestionIndex > 0) {
              setScreen('questions');
            }
          }
        } catch (e) {
          console.error('Error loading saved progress:', e);
        }
      }
    });
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (questions.length > 0 && screen === 'questions') {
      const progress: SavedProgress = {
        name: 'Auto-save',
        timestamp: new Date().toISOString(),
        currentQuestionIndex,
        answers,
        questions,
      };
      localStorage.setItem('love-language-progress', JSON.stringify(progress));
    }
  }, [currentQuestionIndex, answers, questions, screen]);

  const handleStart = () => {
    setScreen('questions');
  };

  // This is called by QuestionScreen when user selects an answer AND wants to advance
  const handleAnswerAndAdvance = (optionIndex: number) => {
    // Update the answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);

    // Advance to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate scores and show results
      calculateScores(newAnswers);
      setScreen('results');
      localStorage.removeItem('love-language-progress');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScores = (finalAnswers: (number | null)[]) => {
    const newScores: Scores = {
      receiving: {
        words: 0,
        quality_time: 0,
        service: 0,
        touch: 0,
        gifts: 0,
      },
      giving: {
        words: 0,
        quality_time: 0,
        service: 0,
        touch: 0,
        gifts: 0,
      },
    };

    // Calculate max possible scores for each context
    const maxScores = {
      receiving: 0,
      giving: 0,
    };

    questions.forEach((question) => {
      const maxWeight = Math.max(...question.options.map(opt => opt.weight));
      maxScores[question.context] += maxWeight;
    });

    // Calculate actual scores
    questions.forEach((question, index) => {
      const answerIndex = finalAnswers[index];
      if (answerIndex !== null) {
        const selectedOption = question.options[answerIndex];
        const context = question.context;
        const language = selectedOption.language as keyof typeof newScores.receiving;
        
        if (language in newScores[context]) {
          newScores[context][language] += selectedOption.weight;
        }
      }
    });

    // Store max scores for percentage calculation in results
    (newScores as any).maxScores = maxScores;
    
    setScores(newScores);
  };

  const handleSaveProgress = (name: string) => {
    const progress: SavedProgress = {
      name,
      timestamp: new Date().toISOString(),
      currentQuestionIndex,
      answers,
      questions,
    };

    localStorage.setItem('love-language-progress', JSON.stringify(progress));

    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.love`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadProgress = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const progress: SavedProgress = JSON.parse(e.target?.result as string);
        setQuestions(progress.questions);
        setAnswers(progress.answers);
        setCurrentQuestionIndex(progress.currentQuestionIndex);
        setScreen('questions');
        localStorage.setItem('love-language-progress', JSON.stringify(progress));
      } catch (error) {
        alert('Error loading file. Please make sure it\'s a valid .love file.');
        console.error('Error loading progress:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleRestart = () => {
    setScreen('intro');
    setCurrentQuestionIndex(0);
    setAnswers(new Array(questions.length).fill(null));
    setScores({
      receiving: {
        words: 0,
        quality_time: 0,
        service: 0,
        touch: 0,
        gifts: 0,
      },
      giving: {
        words: 0,
        quality_time: 0,
        service: 0,
        touch: 0,
        gifts: 0,
      },
    });
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    localStorage.removeItem('love-language-progress');
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const hasSavedProgress = localStorage.getItem('love-language-progress') !== null;

  if (!questions.length || !conclusions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="pt-6">
            <p className="text-center">Loading assessment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {screen === 'questions' && (
          <div className="flex justify-end mb-4">
            <SaveLoadModal
              onSave={handleSaveProgress}
              onLoad={handleLoadProgress}
              hasSavedProgress={hasSavedProgress}
            />
          </div>
        )}

        {screen === 'intro' && <IntroScreen onStart={handleStart} />}
        
        {screen === 'questions' && (
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <QuestionScreen
              question={questions[currentQuestionIndex]}
              selectedAnswer={answers[currentQuestionIndex]}
              onAnswerAndAdvance={handleAnswerAndAdvance}
              onPrevious={handlePrevious}
              canGoPrevious={currentQuestionIndex > 0}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              allAnswers={answers}
            />
          </div>
        )}

        {screen === 'results' && (
          <ResultsScreen
            scores={scores}
            conclusions={conclusions}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}

export default App;
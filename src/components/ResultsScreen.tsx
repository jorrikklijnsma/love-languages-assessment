import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Clock, 
  Users, 
  Gift, 
  MessageCircle, 
  HandHeart, 
  Sparkles,
  Trophy,
  AlertCircle,
  Target,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap,
  Check,
  ChevronRight,
  ArrowRight,
  Info
} from 'lucide-react';
import ExportResultsModal from './ExportResultsModal';
import type { Scores, ConclusionsData, LanguageKey } from '../types';

interface ResultsScreenProps {
  scores: Scores;
  conclusions: ConclusionsData;
  onRestart: () => void;
}

// Type-safe language configuration
const languageNames: Record<LanguageKey, string> = {
  words: 'Words of Affirmation',
  quality_time: 'Quality Time',
  service: 'Acts of Service',
  touch: 'Physical Touch',
  gifts: 'Receiving Gifts',
};

const languageIcons: Record<LanguageKey, React.ComponentType<any>> = {
  words: MessageCircle,
  quality_time: Clock,
  service: HandHeart,
  touch: Heart,
  gifts: Gift,
};

interface ColorConfig {
  from: string;
  to: string;
  bg: string;
  border: string;
  text: string;
}

const languageColors: Record<LanguageKey, ColorConfig> = {
  words: { 
    from: 'from-blue-500', 
    to: 'to-cyan-500', 
    bg: 'bg-blue-50', 
    border: 'border-blue-200', 
    text: 'text-blue-700' 
  },
  quality_time: { 
    from: 'from-purple-500', 
    to: 'to-pink-500', 
    bg: 'bg-purple-50', 
    border: 'border-purple-200', 
    text: 'text-purple-700' 
  },
  service: { 
    from: 'from-green-500', 
    to: 'to-emerald-500', 
    bg: 'bg-green-50', 
    border: 'border-green-200', 
    text: 'text-green-700' 
  },
  touch: { 
    from: 'from-pink-500', 
    to: 'to-rose-500', 
    bg: 'bg-pink-50', 
    border: 'border-pink-200', 
    text: 'text-pink-700' 
  },
  gifts: { 
    from: 'from-amber-500', 
    to: 'to-orange-500', 
    bg: 'bg-amber-50', 
    border: 'border-amber-200', 
    text: 'text-amber-700' 
  },
};

export default function ResultsScreen({ scores, conclusions, onRestart }: ResultsScreenProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [partnerReceiving, setPartnerReceiving] = useState<LanguageKey | ''>('');
  const [partnerGiving, setPartnerGiving] = useState<LanguageKey | ''>('');
  const [viewMode, setViewMode] = useState<'receiving' | 'giving'>('receiving');

  // Calculate max possible scores
  const maxScores = (scores as any).maxScores || { receiving: 45, giving: 45 };

  // Get sorted languages for each context
  const getSortedLanguages = (context: 'receiving' | 'giving'): LanguageKey[] => {
    return (Object.keys(scores[context]) as LanguageKey[]).sort(
      (a, b) => scores[context][b] - scores[context][a]
    );
  };

  const receivingSorted = getSortedLanguages('receiving');
  const givingSorted = getSortedLanguages('giving');

  const primaryReceiving = receivingSorted[0];
  const secondaryReceiving = receivingSorted[1];
  const primaryGiving = givingSorted[0];
  const secondaryGiving = givingSorted[1];

  // Calculate percentages
  const getPercentage = (score: number, context: 'receiving' | 'giving'): number => {
    return Math.round((score / maxScores[context]) * 100);
  };

  // Determine intensity level
  const getIntensityLevel = (percentage: number): 'high' | 'medium' | 'low' => {
    if (percentage > 60) return 'high';
    if (percentage > 30) return 'medium';
    return 'low';
  };

  // Get compatibility analysis
  const getCompatibilityAnalysis = () => {
    if (!partnerReceiving || !partnerGiving) return null;

    const yourGiving = primaryGiving;
    const yourReceiving = primaryReceiving;

    let matchType = 'no_natural_match';
    if (yourGiving === partnerReceiving && partnerGiving === yourReceiving) {
      matchType = 'perfect_match';
    } else if (yourGiving === partnerReceiving || partnerGiving === yourReceiving) {
      matchType = 'one_way_match';
    }

    const dynamics = conclusions.partner_compatibility.giving_receiving_dynamics[matchType];

    const mismatchKey = `${yourReceiving}_vs_${partnerReceiving}`;
    const reverseMismatchKey = `${partnerReceiving}_vs_${yourReceiving}`;
    const specificMismatch = conclusions.partner_compatibility.specific_mismatches[mismatchKey] 
      || conclusions.partner_compatibility.specific_mismatches[reverseMismatchKey];

    return { 
      dynamics, 
      specificMismatch, 
      yourGiving, 
      yourReceiving,
      partnerReceiving,
      partnerGiving
    };
  };

  const compatibilityData = getCompatibilityAnalysis();

  // Get unique top languages (remove duplicates when same language appears in both contexts)
  const getUniqueTopLanguages = (): LanguageKey[] => {
    const topLanguages = [primaryReceiving, secondaryReceiving, primaryGiving, secondaryGiving];
    return Array.from(new Set(topLanguages));
  };

  const uniqueTopLanguages = getUniqueTopLanguages();

  return (
    <div ref={resultsRef} className="space-y-6 pb-12">
      {/* Celebration Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="text-8xl mb-4"
        >
          🎉
        </motion.div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Your Love Language Profile
        </h1>
        <p className="text-xl text-gray-600">Understanding how you give and receive love</p>
      </motion.div>

      {/* Export Button */}
      <div className="flex justify-center">
        <ExportResultsModal resultsRef={resultsRef} />
      </div>

      {/* Score Explanation Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 results-section">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg text-blue-900 mb-2">Understanding Your Scores</h3>
              <p className="text-gray-700 mb-3">
                Your scores show how strongly you resonate with each love language in two contexts:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div className="bg-white/60 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                    <strong className="text-gray-900">Receiving</strong>
                  </div>
                  <p className="text-sm text-gray-600">How you feel most loved by your partner</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-5 h-5 text-purple-600" />
                    <strong className="text-gray-900">Giving</strong>
                  </div>
                  <p className="text-sm text-gray-600">How you naturally express love to others</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Score range:</strong> 0-{maxScores.receiving} points | 
                <strong> Percentage:</strong> Shows intensity relative to max possible | 
                <strong> High:</strong> 60%+ | <strong>Medium:</strong> 30-60% | <strong>Low:</strong> 0-30%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toggle View Mode */}
      <div className="flex justify-center">
        <div className="bg-white rounded-full p-1 shadow-lg border-2 border-purple-200 inline-flex">
          <button
            onClick={() => setViewMode('receiving')}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
              viewMode === 'receiving'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Heart className="w-5 h-5" />
            How I Receive Love
          </button>
          <button
            onClick={() => setViewMode('giving')}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
              viewMode === 'giving'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Gift className="w-5 h-5" />
            How I Give Love
          </button>
        </div>
      </div>

      {/* Score Summary - Context Dependent */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, x: viewMode === 'receiving' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: viewMode === 'receiving' ? 20 : -20 }}
          transition={{ duration: 0.3 }}
          className="results-section"
        >
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-purple-50/30">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                {viewMode === 'receiving' ? (
                  <>
                    <Heart className="w-8 h-8 text-pink-600" />
                    How You Receive Love
                  </>
                ) : (
                  <>
                    <Gift className="w-8 h-8 text-purple-600" />
                    How You Give Love
                  </>
                )}
              </CardTitle>
              <CardDescription className="text-base">
                {viewMode === 'receiving' 
                  ? 'These are the ways you feel most loved and valued by your partner'
                  : 'These are the ways you naturally express love and affection to others'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {(viewMode === 'receiving' ? receivingSorted : givingSorted).map((lang, index) => {
                  const Icon = languageIcons[lang];
                  const colors = languageColors[lang];
                  const score = scores[viewMode][lang];
                  const percentage = getPercentage(score, viewMode);
                  const isPrimary = index === 0;
                  
                  return (
                    <motion.div
                      key={lang}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Card className={`relative overflow-hidden transition-all duration-300 ${
                        isPrimary
                          ? 'ring-4 ring-purple-400 shadow-2xl'
                          : 'hover:shadow-xl'
                      }`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.from} ${colors.to} opacity-10`} />
                        
                        {isPrimary && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                              <Trophy className="w-3 h-3" />
                              #1
                            </div>
                          </div>
                        )}
                        
                        <CardContent className="pt-6 text-center relative z-10">
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                          >
                            <Icon className={`w-10 h-10 mx-auto mb-3 ${colors.text}`} />
                          </motion.div>
                          
                          <div className="text-xs text-gray-600 mb-2 font-medium">
                            {languageNames[lang].split(' ')[0]}
                          </div>
                          
                          <div className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-1">
                            {score}
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className={`h-2 rounded-full bg-gradient-to-r ${colors.from} ${colors.to}`}
                            />
                          </div>
                          
                          <div className="text-xs text-gray-500 font-semibold">
                            {percentage}%
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Primary Language Highlight */}
              <div className={`bg-gradient-to-br ${
                viewMode === 'receiving' ? 'from-pink-500 to-rose-500' : 'from-purple-500 to-pink-500'
              } text-white p-6 rounded-2xl shadow-xl`}>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    {viewMode === 'receiving' ? (
                      <Heart className="w-12 h-12" />
                    ) : (
                      <Gift className="w-12 h-12" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm opacity-90 mb-1">Your Primary {viewMode === 'receiving' ? 'Receiving' : 'Giving'} Language</div>
                    <h3 className="text-3xl font-bold">
                      {languageNames[viewMode === 'receiving' ? primaryReceiving : primaryGiving]}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="font-bold">
                          {scores[viewMode][viewMode === 'receiving' ? primaryReceiving : primaryGiving]}/{maxScores[viewMode]}
                        </span>
                      </div>
                      <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="font-bold">
                          {getPercentage(scores[viewMode][viewMode === 'receiving' ? primaryReceiving : primaryGiving], viewMode)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Side-by-Side Comparison */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-indigo-50/30 results-section">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-600" />
            Your Complete Love Language Profile
          </CardTitle>
          <CardDescription className="text-base">
            See how your giving and receiving languages compare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Receiving Column */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border-2 border-pink-200">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-pink-600" />
                <h3 className="text-xl font-bold text-pink-900">Receiving Love</h3>
              </div>
              <div className="space-y-3">
                {receivingSorted.map((lang) => {
                  const Icon = languageIcons[lang];
                  const score = scores.receiving[lang];
                  const percentage = getPercentage(score, 'receiving');
                  const intensity = getIntensityLevel(percentage);
                  
                  return (
                    <div key={lang} className="bg-white/80 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="font-semibold text-gray-900">{languageNames[lang]}</span>
                        </div>
                        <span className="text-sm font-bold text-pink-600">{score} pts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 w-12">{percentage}%</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500 capitalize">{intensity} intensity</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Giving Column */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-purple-900">Giving Love</h3>
              </div>
              <div className="space-y-3">
                {givingSorted.map((lang) => {
                  const Icon = languageIcons[lang];
                  const score = scores.giving[lang];
                  const percentage = getPercentage(score, 'giving');
                  const intensity = getIntensityLevel(percentage);
                  
                  return (
                    <div key={lang} className="bg-white/80 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="font-semibold text-gray-900">{languageNames[lang]}</span>
                        </div>
                        <span className="text-sm font-bold text-purple-600">{score} pts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 w-12">{percentage}%</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500 capitalize">{intensity} intensity</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="mt-6 bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-2xl">
            <h4 className="font-bold text-indigo-900 text-lg mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Key Insights About Your Profile
            </h4>
            <div className="space-y-3 text-gray-700">
              {primaryReceiving === primaryGiving ? (
                <p className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Aligned:</strong> Your primary receiving and giving languages match ({languageNames[primaryReceiving]}). 
                    This means you naturally give love in the way you want to receive it. This creates clarity but watch that partners 
                    with different languages don't feel neglected.
                  </span>
                </p>
              ) : (
                <p className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Different Languages:</strong> You receive love through {languageNames[primaryReceiving]} but give through {languageNames[primaryGiving]}. 
                    This is common! Be aware that what feels natural to give might not be what you need to receive.
                  </span>
                </p>
              )}
              
              <p className="flex items-start gap-2">
                <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Your Balance:</strong> Your receiving scores range from {Math.min(...Object.values(scores.receiving))} to {Math.max(...Object.values(scores.receiving))} points, 
                  while giving ranges from {Math.min(...Object.values(scores.giving))} to {Math.max(...Object.values(scores.giving))} points. 
                  {Math.max(...Object.values(scores.receiving)) - Math.min(...Object.values(scores.receiving)) > 20 
                    ? ' You have clear strong preferences.' 
                    : ' Your languages are relatively balanced.'}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Language Analysis - Only show relevant ones */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-purple-50/30 results-section">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-purple-600" />
            Deep Dive: Your Top Languages
          </CardTitle>
          <CardDescription className="text-base">
            Detailed insights for your strongest love languages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Show top 2 receiving and top 2 giving, but deduplicate */}
          {[
            { lang: primaryReceiving, context: 'receiving' as const, rank: 'Primary' },
            { lang: secondaryReceiving, context: 'receiving' as const, rank: 'Secondary' },
            { lang: primaryGiving, context: 'giving' as const, rank: 'Primary' },
            { lang: secondaryGiving, context: 'giving' as const, rank: 'Secondary' },
          ].map(({ lang, context, rank }) => {
            const score = scores[context][lang];
            const percentage = getPercentage(score, context);
            const intensity = getIntensityLevel(percentage);
            const detail = conclusions.language_details[lang];
            const contextDetail = context === 'receiving' ? detail.receiving[intensity] : detail.giving[intensity];
            const colors = languageColors[lang];
            const Icon = languageIcons[lang];

            return (
              <div key={`${context}-${lang}`} className={`${colors.bg} ${colors.border} border-2 p-6 rounded-2xl`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`bg-gradient-to-br ${colors.from} ${colors.to} p-3 rounded-xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-2xl font-bold ${colors.text}`}>{languageNames[lang]}</h3>
                      <span className="text-sm bg-white px-3 py-1 rounded-full font-semibold">
                        {rank} {context === 'receiving' ? 'Receiving' : 'Giving'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{detail.short_description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-lg font-bold text-gray-900">{score}/{maxScores[context]} points</span>
                      <span className="text-lg font-bold text-gray-900">{percentage}%</span>
                      <span className="text-sm bg-white px-3 py-1 rounded-full font-semibold capitalize">{intensity}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/80 p-5 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      What This Means
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{contextDetail.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-5 rounded-xl border-2 border-green-200">
                      <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {contextDetail.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-5 rounded-xl border-2 border-orange-200">
                      <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Challenges
                      </h4>
                      <ul className="space-y-2">
                        {contextDetail.challenges.map((challenge, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <ChevronRight className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {context === 'receiving' && (
                    <div className="bg-red-50 p-5 rounded-xl border-2 border-red-200">
                      <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Common Triggers</h4>
                      <ul className="space-y-2">
                        {(contextDetail as any).triggers?.map((trigger: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <span>{trigger}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {context === 'giving' && (
                    <div className="bg-blue-50 p-5 rounded-xl border-2 border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Growth Opportunities
                      </h4>
                      <ul className="space-y-2">
                        {(contextDetail as any).growth_areas?.map((area: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Solo Activities - Only for unique top languages */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50/30 results-section">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-600" />
            Personal Growth Exercises
          </CardTitle>
          <CardDescription className="text-base">
            Activities focused on your top love languages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {uniqueTopLanguages.map((lang) => {
            const Icon = languageIcons[lang];
            const colors = languageColors[lang];
            
            return (
              <div key={lang} className={`${colors.bg} ${colors.border} border-l-4 p-6 rounded-2xl`}>
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                  <h3 className={`text-xl font-bold ${colors.text}`}>
                    {languageNames[lang]} Exercises
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {conclusions.activities_solo[lang]?.slice(0, 4).map((activity, i) => (
                    <div
                      key={i}
                      className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.from} ${colors.to}`} />
                        {activity.title}
                      </h4>
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed">{activity.description}</p>
                      <div className="flex gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                          <TrendingUp className="w-3 h-3" />
                          {activity.difficulty}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Partner Compatibility */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-pink-50/30 results-section">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3">
            <Users className="w-8 h-8 text-pink-600" />
            💑 Partner Compatibility Analysis
          </CardTitle>
          <CardDescription className="text-base">
            Select your partner's love languages to see personalized compatibility insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                Partner's Primary Receiving Language:
              </label>
              <Select value={partnerReceiving} onValueChange={(val) => setPartnerReceiving(val as LanguageKey)}>
                <SelectTrigger className="h-14 text-base border-2 hover:border-purple-300 transition-colors">
                  <SelectValue placeholder="-- Select --" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(languageNames) as [LanguageKey, string][]).map(([key, name]) => (
                    <SelectItem key={key} value={key} className="text-base py-3">
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Gift className="w-4 h-4 text-blue-500" />
                Partner's Primary Giving Language:
              </label>
              <Select value={partnerGiving} onValueChange={(val) => setPartnerGiving(val as LanguageKey)}>
                <SelectTrigger className="h-14 text-base border-2 hover:border-purple-300 transition-colors">
                  <SelectValue placeholder="-- Select --" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(languageNames) as [LanguageKey, string][]).map(([key, name]) => (
                    <SelectItem key={key} value={key} className="text-base py-3">
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <AnimatePresence>
            {compatibilityData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Visual Compatibility Diagram */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-200">
                  <h4 className="font-bold text-indigo-900 text-lg mb-4 text-center">Your Love Language Flow</h4>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="bg-white p-4 rounded-xl shadow-lg mb-2">
                        <div className="text-sm text-gray-600 mb-1">You Give</div>
                        <div className="font-bold text-purple-700">{languageNames[compatibilityData.yourGiving]}</div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-purple-600 mx-auto" />
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-xl shadow-xl mb-2">
                        <div className="text-sm mb-1">Partner Receives</div>
                        <div className="font-bold">{languageNames[compatibilityData.partnerReceiving]}</div>
                      </div>
                      {compatibilityData.yourGiving === compatibilityData.partnerReceiving ? (
                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-orange-600 mx-auto" />
                      )}
                    </div>
                  </div>

                  <div className="my-6 border-t-2 border-dashed border-indigo-300"></div>

                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-xl mb-2">
                        <div className="text-sm mb-1">Partner Gives</div>
                        <div className="font-bold">{languageNames[compatibilityData.partnerGiving]}</div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-purple-600 mx-auto" />
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-white p-4 rounded-xl shadow-lg mb-2">
                        <div className="text-sm text-gray-600 mb-1">You Receive</div>
                        <div className="font-bold text-pink-700">{languageNames[compatibilityData.yourReceiving]}</div>
                      </div>
                      {compatibilityData.partnerGiving === compatibilityData.yourReceiving ? (
                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-orange-600 mx-auto" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl border-2 border-purple-200 shadow-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <Users className="w-8 h-8 text-purple-700 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-2xl text-purple-900 mb-3">
                        Your Compatibility Dynamics
                      </h4>
                      <p className="text-gray-700 mb-4 leading-relaxed">{compatibilityData.dynamics.description}</p>
                      <div className="space-y-3">
                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                            <div>
                              <strong className="text-purple-900">💡 Advice:</strong>
                              <p className="text-gray-700 mt-1">{compatibilityData.dynamics.advice}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                            <div>
                              <strong className="text-purple-900">⚠️ Risk:</strong>
                              <p className="text-gray-700 mt-1">{compatibilityData.dynamics.risk}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {compatibilityData.specificMismatch && (
                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl border-2 border-blue-200 shadow-lg">
                    <div className="flex items-start gap-3">
                      <Target className="w-8 h-8 text-blue-700 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-bold text-2xl text-blue-900 mb-4">
                          Specific Guidance for Your Pairing
                        </h4>
                        <div className="space-y-4">
                          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                            <strong className="text-blue-900 block mb-2">Challenge:</strong>
                            <p className="text-gray-700">{compatibilityData.specificMismatch.challenge}</p>
                          </div>
                          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                            <strong className="text-blue-900 block mb-2">Bridge Strategy:</strong>
                            <p className="text-gray-700">{compatibilityData.specificMismatch.bridge}</p>
                          </div>
                          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                            <strong className="text-blue-900 block mb-2">Watch For:</strong>
                            <p className="text-gray-700">{compatibilityData.specificMismatch.watch_for}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Relevant Couples Activities */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                  <h4 className="font-bold text-green-900 text-xl mb-4 flex items-center gap-2">
                    <Heart className="w-6 h-6" />
                    Recommended Couples Activities
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {conclusions.activities_couples.general.slice(0, 4).map((activity, i) => (
                      <div
                        key={i}
                        className="bg-white p-5 rounded-xl shadow-md"
                      >
                        <h5 className="font-bold text-gray-900 mb-2">{activity.title}</h5>
                        <p className="text-gray-700 text-sm mb-3 leading-relaxed">{activity.description}</p>
                        <div className="flex gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </div>
                          <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3" />
                            {activity.difficulty}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Restart Button */}
      <div className="flex justify-center py-8">
        <Button 
          onClick={onRestart} 
          size="lg" 
          variant="outline" 
          className="text-xl px-12 py-7 border-2 border-purple-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-all duration-300 transform hover:scale-105 rounded-full shadow-lg hover:shadow-2xl"
        >
          <span className="flex items-center gap-3">
            🔄 Take Assessment Again
          </span>
        </Button>
      </div>
    </div>
  );
}
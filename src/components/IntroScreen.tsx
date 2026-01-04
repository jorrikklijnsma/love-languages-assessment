import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Target, Zap } from 'lucide-react';

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-full bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 backdrop-blur-sm shadow-2xl border-0 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -z-10 transform translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10 transform -translate-x-48 translate-y-48" />
        
        <CardHeader className="text-center space-y-4 pt-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="text-8xl"
              >
                💜
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles className="w-12 h-12 text-purple-400" />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardTitle className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Love Languages
            </CardTitle>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <CardDescription className="text-xl md:text-2xl text-gray-600 font-medium">
              Discover how you give and receive love
            </CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-8 px-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-6 max-w-2xl mx-auto"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100">
                <Heart className="w-10 h-10 text-pink-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Deep Insights</h3>
                <p className="text-sm text-gray-600">Understand your unique emotional blueprint</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100">
                <Target className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Actionable</h3>
                <p className="text-sm text-gray-600">Get specific exercises and activities</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100">
                <Zap className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Quick & Easy</h3>
                <p className="text-sm text-gray-600">Just 8-10 minutes to complete</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl border-2 border-purple-200">
              <p className="text-gray-700 mb-3 leading-relaxed">
                You'll walk through <strong>30 realistic scenarios</strong> from intimate relationships. 
                Answer honestly based on your <strong>gut reactions</strong> - not how you think you "should" feel.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>No right or wrong answers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>Use keyboard shortcuts</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center pt-4"
          >
            <Button 
              onClick={onStart} 
              size="lg" 
              className="text-xl px-12 py-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-full"
            >
              <span className="flex items-center gap-3">
                Begin Your Journey
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
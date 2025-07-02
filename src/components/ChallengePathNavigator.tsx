'use client';

import React, { useState, useEffect } from 'react';
import { challengePaths, ChallengePath, ChallengeStage, Challenge } from '@/lib/challengePaths';
import { motion, AnimatePresence } from 'framer-motion';

// A single challenge player component
function ChallengePlayer({
  challenge,
  onComplete,
}: {
  challenge: Challenge;
  onComplete: (isCorrect: boolean, points: number) => void;
}) {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleChoiceAnswer = (choiceIndex: number) => {
    const correct = challenge.correctAnswer.includes(choiceIndex);
    setIsCorrect(correct);
    setShowResult(true);
  };
  
  const handleEstimateAnswer = () => {
    if (userAnswer === '') return;
    const numericAnswer = parseFloat(userAnswer);
    let correct = false;

    if (challenge.type === 'estimate' && challenge.acceptableRange) {
      correct = numericAnswer >= challenge.acceptableRange[0] && numericAnswer <= challenge.acceptableRange[1];
    } else {
      correct = challenge.correctAnswer.includes(numericAnswer);
    }
    
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNext = () => {
    onComplete(isCorrect, isCorrect ? challenge.points : 0);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-2xl w-full mx-auto">
      <h3 className="text-2xl font-bold">{challenge.title}</h3>
      <p className="text-gray-400 mt-2 mb-6">{challenge.description}</p>
      
      {!showResult ? (
        <>
          <p className="text-lg text-white mb-4">{challenge.question}</p>
          <div className="space-y-3">
            {challenge.options?.map((option, index) => (
              <button
                key={option}
                onClick={() => handleChoiceAnswer(index)}
                className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all duration-300"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                <h4 className="font-bold text-lg">{isCorrect ? 'Correct!' : 'Incorrect'}</h4>
                <p className="mt-2">{challenge.explanation}</p>
            </div>
            <button onClick={handleNext} className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-semibold">
                Continue
            </button>
        </div>
      )}
    </div>
  );
}


export default function ChallengePathNavigator() {
  const [selectedPath, setSelectedPath] = useState<ChallengePath | null>(null);
  const [activeStage, setActiveStage] = useState<ChallengeStage | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [stageScore, setStageScore] = useState(0);

  useEffect(() => {
    if (challengePaths.length > 0) {
      setSelectedPath(challengePaths[0]);
    }
  }, []);

  const handleSelectStage = (stage: ChallengeStage) => {
    setActiveStage(stage);
    setCurrentChallengeIndex(0);
    setStageScore(0);
  };

  const handleChallengeComplete = (isCorrect: boolean, points: number) => {
    if (isCorrect) {
      setStageScore(prev => prev + points);
    }
    
    if (activeStage && currentChallengeIndex < activeStage.challenges.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
    } else {
      alert(`Stage Complete! Your score: ${stageScore + (isCorrect ? points : 0)}`);
      setActiveStage(null);
    }
  };

  if (!challengePaths || challengePaths.length === 0) {
    return (
      <div className="p-8 text-white">
        <h2 className="text-3xl font-bold mb-8">Legendary Challenge Paths</h2>
        <p>No challenge paths have been defined yet.</p>
      </div>
    );
  }
  
  if (activeStage) {
    const challenge = activeStage.challenges[currentChallengeIndex];
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">{activeStage.title}</h2>
                    <p className="text-gray-400">Challenge {currentChallengeIndex + 1} of {activeStage.challenges.length}</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{stageScore} pts</div>
                    <div className="text-xs text-gray-400">Stage Score</div>
                </div>
            </div>
            <ChallengePlayer 
              key={challenge.id}
              challenge={challenge} 
              onComplete={handleChallengeComplete} />
        </div>
    )
  }

  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-bold mb-8">Legendary Challenge Paths</h2>
      
      <div className="flex space-x-4 mb-8 border-b border-white/10 pb-4">
        {challengePaths.map(path => (
          <button
            key={path.id}
            onClick={() => setSelectedPath(path)}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedPath?.id === path.id ? 'bg-purple-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            {path.title}
          </button>
        ))}
      </div>

      {selectedPath && (
        <AnimatePresence>
          <motion.div
            key={selectedPath.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 className="text-2xl font-bold mb-4">{selectedPath.title}</h3>
            <p className="mb-8 text-gray-400">{selectedPath.description}</p>
            <div className="space-y-4">
              {selectedPath.stages.map(stage => (
                <motion.div 
                    key={stage.id} 
                    className="p-6 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSelectStage(stage)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                  <h4 className="text-xl font-bold">{stage.title}</h4>
                  <p className="text-gray-400">{stage.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
} 
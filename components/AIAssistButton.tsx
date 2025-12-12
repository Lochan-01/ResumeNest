import React, { useState } from 'react';
import { Sparkles, Wand2, CheckCheck } from 'lucide-react';
import { generateAIContent } from '../services/geminiService';
import { AIActionType } from '../types';

interface AIAssistButtonProps {
  inputData: string;
  onUpdate: (newData: string) => void;
  action: AIActionType;
  context?: string;
  tooltip: string;
}

const AIAssistButton: React.FC<AIAssistButtonProps> = ({ inputData, onUpdate, action, context, tooltip }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAI = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inputData && action !== 'GENERATE_SUMMARY') return;
    
    setLoading(true);
    setSuccess(false);
    
    const result = await generateAIContent(inputData, action, context);
    
    if (result) {
        onUpdate(result);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleAI}
      disabled={loading || (!inputData && action !== 'GENERATE_SUMMARY')}
      title={tooltip}
      className={`
        p-1.5 rounded-md transition-all duration-300 text-xs flex items-center gap-1 font-medium
        ${loading ? 'bg-yellow-500/20 text-yellow-300' : ''}
        ${success ? 'bg-green-500/20 text-green-300' : ''}
        ${!loading && !success ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 hover:scale-105' : ''}
      `}
    >
      {loading ? (
        <Wand2 className="w-3 h-3 animate-spin" />
      ) : success ? (
        <CheckCheck className="w-3 h-3" />
      ) : (
        <Sparkles className="w-3 h-3" />
      )}
      {action === 'FIX_SPELLING' ? 'Fix' : action === 'ENHANCE_TONE' ? 'Enhance' : 'Generate'}
    </button>
  );
};

export default AIAssistButton;
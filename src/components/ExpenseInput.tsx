
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Plus } from 'lucide-react';
import { type Expense, type BucketData, getDescriptionSuggestions } from '@/utils/budgetUtils';

interface ExpenseInputProps {
  onAddExpense: (expense: Expense) => void;
  budgetData: BucketData;
  expenses: Expense[];
}

const ExpenseInput = ({ onAddExpense, budgetData, expenses }: ExpenseInputProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'needs' | 'wants' | 'future'>('needs');
  const [isListening, setIsListening] = useState<'amount' | 'description' | 'category' | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleAddExpense = () => {
    if (!amount || !description) return;

    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString()
    };

    onAddExpense(expense);
    setAmount('');
    setDescription('');
    setCategory('needs');
    setSuggestions([]);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (value.length >= 2) {
      const newSuggestions = getDescriptionSuggestions(value, expenses);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setDescription(suggestion);
    setSuggestions([]);
  };

  const startListening = (field: 'amount' | 'description' | 'category') => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(field);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      
      if (field === 'amount') {
        // Extract numbers from speech
        const numberMatch = transcript.match(/\d+(?:\.\d+)?/);
        if (numberMatch) {
          setAmount(numberMatch[0]);
        }
      } else if (field === 'description') {
        setDescription(transcript);
        if (transcript.length >= 2) {
          const newSuggestions = getDescriptionSuggestions(transcript, expenses);
          setSuggestions(newSuggestions);
        }
      } else if (field === 'category') {
        // Map speech to categories
        if (transcript.includes('need') || transcript.includes('essential')) {
          setCategory('needs');
        } else if (transcript.includes('want') || transcript.includes('wish') || transcript.includes('entertainment')) {
          setCategory('wants');
        } else if (transcript.includes('future') || transcript.includes('saving') || transcript.includes('investment')) {
          setCategory('future');
        }
      }
    };

    recognition.onerror = () => {
      setIsListening(null);
    };

    recognition.onend = () => {
      setIsListening(null);
    };

    recognition.start();
  };

  const getBucketStatus = (bucketCategory: 'needs' | 'wants' | 'future') => {
    const bucket = budgetData[bucketCategory];
    const percentage = bucket.allocated > 0 ? (bucket.spent / bucket.allocated) * 100 : 0;
    return {
      remaining: bucket.remaining,
      percentage: Math.min(percentage, 100)
    };
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-700">Add Expense</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => startListening('amount')}
              variant="outline"
              size="icon"
              className={isListening === 'amount' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
            >
              {isListening === 'amount' ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Select value={category} onValueChange={(value: 'needs' | 'wants' | 'future') => setCategory(value)}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="needs">Needs</SelectItem>
                <SelectItem value="wants">Wants</SelectItem>
                <SelectItem value="future">Future</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => startListening('category')}
              variant="outline"
              size="icon"
              className={isListening === 'category' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
            >
              {isListening === 'category' ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="flex gap-2">
            <Input
              placeholder="Description (e.g., food, power, gas)"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => startListening('description')}
              variant="outline"
              size="icon"
              className={isListening === 'description' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
            >
              {isListening === 'description' ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-12 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors text-sm"
                  onClick={() => selectSuggestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button 
          onClick={handleAddExpense}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={!amount || !description}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>

        {/* Budget Status */}
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Budget Status</h4>
          {(['needs', 'wants', 'future'] as const).map((bucket) => {
            const status = getBucketStatus(bucket);
            return (
              <div key={bucket} className="flex justify-between items-center text-sm">
                <span className="capitalize">{bucket}:</span>
                <span className={status.remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ${status.remaining.toFixed(2)} remaining
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseInput;

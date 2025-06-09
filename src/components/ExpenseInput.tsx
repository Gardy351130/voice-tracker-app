
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Plus } from 'lucide-react';
import { type Expense, type BudgetData } from '@/utils/budgetUtils';

interface ExpenseInputProps {
  onAddExpense: (expense: Expense) => void;
  budgetData: BudgetData;
}

const ExpenseInput = ({ onAddExpense, budgetData }: ExpenseInputProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'needs' | 'wants' | 'future'>('needs');
  const [isRecording, setIsRecording] = useState(false);

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
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    setIsRecording(true);
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="Amount ($)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-32"
            />
            <Input
              placeholder="Or type your expense here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleVoiceInput}
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              className={isRecording ? "animate-pulse" : ""}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-3">
            <Select value={category} onValueChange={(value: 'needs' | 'wants' | 'future') => setCategory(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="needs">Needs</SelectItem>
                <SelectItem value="wants">Wants</SelectItem>
                <SelectItem value="future">Future</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleAddExpense}
              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
              disabled={!amount || !description}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseInput;

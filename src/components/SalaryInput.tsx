
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Mic, MicOff } from 'lucide-react';

interface SalaryInputProps {
  salary: number;
  onSalaryChange: (salary: number) => void;
}

const SalaryInput = ({ salary, onSalaryChange }: SalaryInputProps) => {
  const [inputValue, setInputValue] = useState(salary.toString());
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = () => {
    const numericValue = parseFloat(inputValue) || 0;
    onSalaryChange(numericValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice input for salary:', transcript);
      
      // Extract numbers from the transcript
      const numberMatch = transcript.match(/[\d,]+\.?\d*/);
      if (numberMatch) {
        const cleanNumber = numberMatch[0].replace(/,/g, '');
        setInputValue(cleanNumber);
      }
    };

    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-700">
          <DollarSign className="h-5 w-5" />
          Set Your Salary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              type="number"
              placeholder="Enter your salary"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-lg pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={startVoiceInput}
              disabled={isListening}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8"
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-500" />
              ) : (
                <Mic className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
          <Button 
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white px-6"
          >
            Submit
          </Button>
        </div>
        
        {salary > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              📊 Based on your salary of ${salary.toFixed(2)}:
            </p>
            <ul className="space-y-1 text-sm">
              <li><strong>Needs (50%):</strong> ${(salary * 0.5).toFixed(2)}</li>
              <li><strong>Wants (30%):</strong> ${(salary * 0.3).toFixed(2)}</li>
              <li><strong>Future (20%):</strong> ${(salary * 0.2).toFixed(2)}</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalaryInput;

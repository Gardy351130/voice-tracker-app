
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface SalaryInputProps {
  salary: number;
  onSalaryChange: (salary: number) => void;
}

const SalaryInput = ({ salary, onSalaryChange }: SalaryInputProps) => {
  const [inputValue, setInputValue] = useState(salary.toString());

  const handleSubmit = () => {
    const numericValue = parseFloat(inputValue) || 0;
    onSalaryChange(numericValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
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
          <Input
            type="number"
            placeholder="Enter your salary"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 text-lg"
          />
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

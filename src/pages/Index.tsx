
import { useState, useEffect } from 'react';
import SalaryInput from '@/components/SalaryInput';
import ExpenseInput from '@/components/ExpenseInput';
import BucketChart from '@/components/BucketChart';
import ExpenseHistory from '@/components/ExpenseHistory';
import DailyMotivationPopup from '@/components/DailyMotivationPopup';
import { calculateBudgetAllocations, type Expense, type BucketData } from '@/utils/budgetUtils';

const Index = () => {
  const [salary, setSalary] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetData, setBudgetData] = useState<BucketData>({
    needs: { allocated: 0, spent: 0, remaining: 0 },
    wants: { allocated: 0, spent: 0, remaining: 0 },
    future: { allocated: 0, spent: 0, remaining: 0 }
  });

  useEffect(() => {
    const newBudgetData = calculateBudgetAllocations(salary, expenses);
    setBudgetData(newBudgetData);
  }, [salary, expenses]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Budget Voice Tracker
          </h1>
          <p className="text-lg text-slate-600">
            No Shame. No Blame. Just Fix It.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-8">
            <SalaryInput 
              salary={salary} 
              onSalaryChange={setSalary} 
            />
            <ExpenseInput 
              onAddExpense={handleAddExpense}
              budgetData={budgetData}
              expenses={expenses}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <BucketChart 
              budgetData={budgetData}
              salary={salary}
            />
          </div>
        </div>

        {/* Full Width Bottom Section */}
        <ExpenseHistory 
          expenses={expenses}
          salary={salary}
          budgetData={budgetData}
        />
      </div>
      
      {/* Daily Motivation Popup */}
      <DailyMotivationPopup />
    </div>
  );
};

export default Index;

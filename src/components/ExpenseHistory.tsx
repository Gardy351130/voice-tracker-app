
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, BarChart } from 'lucide-react';
import { type Expense, type BudgetData, generateCSV, getWeeklySummary } from '@/utils/budgetUtils';

interface ExpenseHistoryProps {
  expenses: Expense[];
  salary: number;
  budgetData: BudgetData;
}

const ExpenseHistory = ({ expenses, salary, budgetData }: ExpenseHistoryProps) => {
  const handleDownloadCSV = () => {
    const csv = generateCSV(expenses, salary, budgetData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const weeklySummary = getWeeklySummary(expenses);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'needs': return 'bg-blue-100 text-blue-800';
      case 'wants': return 'bg-orange-100 text-orange-800';
      case 'future': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-slate-700">Transaction History</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadCSV}
              variant="outline"
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white border-green-500"
              disabled={expenses.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-purple-500 hover:bg-purple-600 text-white border-purple-500"
              disabled={expenses.length === 0}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Weekly Summary
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            No expenses recorded yet. Add your first expense above!
          </p>
        ) : (
          <div className="space-y-4">
            {/* Weekly Summary */}
            {Object.keys(weeklySummary).length > 0 && (
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-slate-700 mb-3">Weekly Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(weeklySummary).map(([week, data]) => (
                    <div key={week} className="bg-white rounded p-3">
                      <div className="text-sm font-medium text-slate-600 mb-2">{week}</div>
                      <div className="text-lg font-bold text-slate-800">
                        ${data.total.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {data.count} transactions
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            <div className="space-y-3">
              {expenses.slice().reverse().map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-slate-800">
                        {expense.description}
                      </span>
                      <Badge 
                        className={getCategoryColor(expense.category)}
                        variant="secondary"
                      >
                        {expense.category}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-500">
                      {new Date(expense.date).toLocaleDateString()} at{' '}
                      {new Date(expense.date).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800">
                      -${expense.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseHistory;


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarChart, Banknote } from 'lucide-react';
import { type Expense, getWeeklySummary } from '@/utils/budgetUtils';

interface WeeklySummaryDialogProps {
  expenses: Expense[];
}

const WeeklySummaryDialog = ({ expenses }: WeeklySummaryDialogProps) => {
  const weeklySummary = getWeeklySummary(expenses);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'needs': return 'text-blue-600';
      case 'wants': return 'text-orange-600';
      case 'future': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'needs': return 'bg-blue-50';
      case 'wants': return 'bg-orange-50';
      case 'future': return 'bg-green-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-purple-500 hover:bg-purple-600 text-white border-purple-500"
          disabled={expenses.length === 0}
        >
          <BarChart className="h-4 w-4 mr-2" />
          Weekly Summary
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Weekly Spending Summary by Buckets
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {Object.keys(weeklySummary).length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              No expenses recorded yet to show weekly summary.
            </p>
          ) : (
            Object.entries(weeklySummary).map(([week, data]) => (
              <div key={week} className="border rounded-lg p-4 bg-slate-50">
                <h3 className="font-semibold text-slate-700 mb-4">{week}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className={`${getCategoryBgColor('needs')} rounded-lg p-3`}>
                    <div className="text-sm font-medium text-slate-600 mb-1">Needs</div>
                    <div className={`text-xl font-bold ${getCategoryColor('needs')}`}>
                      ${data.byCategory.needs.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className={`${getCategoryBgColor('wants')} rounded-lg p-3`}>
                    <div className="text-sm font-medium text-slate-600 mb-1">Wants</div>
                    <div className={`text-xl font-bold ${getCategoryColor('wants')}`}>
                      ${data.byCategory.wants.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className={`${getCategoryBgColor('future')} rounded-lg p-3`}>
                    <div className="text-sm font-medium text-slate-600 mb-1">Future</div>
                    <div className={`text-xl font-bold ${getCategoryColor('future')}`}>
                      ${data.byCategory.future.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded p-3 border-t-2 border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Weekly Total:</span>
                    <span className="text-lg font-bold text-slate-800">
                      ${data.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {data.count} transactions
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeeklySummaryDialog;

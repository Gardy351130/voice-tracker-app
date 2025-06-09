
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { type BudgetData } from '@/utils/budgetUtils';

interface BucketChartProps {
  budgetData: BudgetData;
  salary: number;
}

const BucketChart = ({ budgetData, salary }: BucketChartProps) => {
  if (salary === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-700">Buckets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-8">
            Please set your salary to see budget allocation
          </p>
        </CardContent>
      </Card>
    );
  }

  const buckets = [
    { 
      name: 'Needs', 
      key: 'needs' as const, 
      color: 'bg-blue-500',
      percentage: 50
    },
    { 
      name: 'Wants', 
      key: 'wants' as const, 
      color: 'bg-orange-500',
      percentage: 30
    },
    { 
      name: 'Future', 
      key: 'future' as const, 
      color: 'bg-green-500',
      percentage: 20
    }
  ];

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-700">Buckets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Text Summary */}
        <div className="space-y-2">
          {buckets.map(bucket => {
            const data = budgetData[bucket.key];
            return (
              <div key={bucket.key} className="flex justify-between items-center">
                <span className="font-medium text-slate-700">
                  {bucket.name}:
                </span>
                <span className="text-slate-600">
                  ${data.spent.toFixed(2)} / ${data.allocated.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Visual Chart */}
        <div className="space-y-4">
          {buckets.map(bucket => {
            const data = budgetData[bucket.key];
            const percentageUsed = data.allocated > 0 ? (data.spent / data.allocated) * 100 : 0;
            
            return (
              <div key={bucket.key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{bucket.name}</span>
                  <span className="text-slate-500">
                    {percentageUsed.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={Math.min(percentageUsed, 100)} 
                  className="h-3"
                />
                <div className="text-xs text-slate-500">
                  ${data.remaining.toFixed(2)} remaining
                </div>
              </div>
            );
          })}
        </div>

        {/* Salary Info */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>💰</span>
            <span>Salary set to ${salary.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BucketChart;

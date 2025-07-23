import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { type BucketData } from '@/utils/budgetUtils';

interface BucketChartProps {
  budgetData: BucketData;
  salary: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const BucketChart = ({ budgetData, salary }: BucketChartProps) => {
  const data = [
    { name: 'Needs', value: budgetData.needs.allocated },
    { name: 'Wants', value: budgetData.wants.allocated },
    { name: 'Future', value: budgetData.future.allocated },
  ];

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-700">Budget Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            {`Total Budget: $${salary.toFixed(2)}`}
          </h3>
          <p className="text-sm text-slate-500">
            Here's how your budget is allocated across different categories.
          </p>
        </div>

        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.name}>
              <div className="flex justify-between items-center">
                <span className="capitalize text-slate-700">{item.name}</span>
                <span className="text-sm text-slate-500">${budgetData[item.name.toLowerCase() as keyof BucketData].allocated.toFixed(2)}</span>
              </div>
              <Progress value={(budgetData[item.name.toLowerCase() as keyof BucketData].spent / item.value) * 100} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BucketChart;

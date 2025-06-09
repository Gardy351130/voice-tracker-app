
export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: 'needs' | 'wants' | 'future';
  date: string;
}

export interface BucketData {
  needs: {
    allocated: number;
    spent: number;
    remaining: number;
  };
  wants: {
    allocated: number;
    spent: number;
    remaining: number;
  };
  future: {
    allocated: number;
    spent: number;
    remaining: number;
  };
}

export const calculateBudgetAllocations = (salary: number, expenses: Expense[]): BucketData => {
  const needsAllocated = salary * 0.5;
  const wantsAllocated = salary * 0.3;
  const futureAllocated = salary * 0.2;

  const needsSpent = expenses
    .filter(e => e.category === 'needs')
    .reduce((sum, e) => sum + e.amount, 0);

  const wantsSpent = expenses
    .filter(e => e.category === 'wants')
    .reduce((sum, e) => sum + e.amount, 0);

  const futureSpent = expenses
    .filter(e => e.category === 'future')
    .reduce((sum, e) => sum + e.amount, 0);

  return {
    needs: {
      allocated: needsAllocated,
      spent: needsSpent,
      remaining: needsAllocated - needsSpent
    },
    wants: {
      allocated: wantsAllocated,
      spent: wantsSpent,
      remaining: wantsAllocated - wantsSpent
    },
    future: {
      allocated: futureAllocated,
      spent: futureSpent,
      remaining: futureAllocated - futureSpent
    }
  };
};

export const generateCSV = (expenses: Expense[], salary: number, bucketData: BucketData): string => {
  const headers = ['Date', 'Description', 'Amount', 'Category'];
  const summaryHeaders = ['Budget Summary', '', '', ''];
  const summary = [
    ['Salary', '', salary.toString(), ''],
    ['Needs Allocated', '', bucketData.needs.allocated.toFixed(2), ''],
    ['Needs Spent', '', bucketData.needs.spent.toFixed(2), ''],
    ['Needs Remaining', '', bucketData.needs.remaining.toFixed(2), ''],
    ['Wants Allocated', '', bucketData.wants.allocated.toFixed(2), ''],
    ['Wants Spent', '', bucketData.wants.spent.toFixed(2), ''],
    ['Wants Remaining', '', bucketData.wants.remaining.toFixed(2), ''],
    ['Future Allocated', '', bucketData.future.allocated.toFixed(2), ''],
    ['Future Spent', '', bucketData.future.spent.toFixed(2), ''],
    ['Future Remaining', '', bucketData.future.remaining.toFixed(2), ''],
    ['', '', '', '']
  ];

  const rows = expenses.map(expense => [
    new Date(expense.date).toLocaleDateString(),
    expense.description,
    expense.amount.toString(),
    expense.category
  ]);

  const allRows = [
    summaryHeaders,
    ...summary,
    headers,
    ...rows
  ];

  return allRows.map(row => row.join(',')).join('\n');
};

export const getWeeklySummary = (expenses: Expense[]): Record<string, { total: number; count: number; byCategory: { needs: number; wants: number; future: number } }> => {
  const summary: Record<string, { total: number; count: number; byCategory: { needs: number; wants: number; future: number } }> = {};

  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = `Week of ${weekStart.toLocaleDateString()}`;

    if (!summary[weekKey]) {
      summary[weekKey] = { 
        total: 0, 
        count: 0, 
        byCategory: { needs: 0, wants: 0, future: 0 }
      };
    }

    summary[weekKey].total += expense.amount;
    summary[weekKey].count += 1;
    summary[weekKey].byCategory[expense.category] += expense.amount;
  });

  return summary;
};

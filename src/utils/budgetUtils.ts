
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

export const calculateBudgetAllocations = (salary: number, expenses: Expense[]): BudgetData => {
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

export const generateCSV = (expenses: Expense[], salary: number, budgetData: BudgetData): string => {
  const headers = ['Date', 'Description', 'Amount', 'Category'];
  const summaryHeaders = ['Budget Summary', '', '', ''];
  const summary = [
    ['Salary', '', salary.toString(), ''],
    ['Needs Allocated', '', budgetData.needs.allocated.toFixed(2), ''],
    ['Needs Spent', '', budgetData.needs.spent.toFixed(2), ''],
    ['Needs Remaining', '', budgetData.needs.remaining.toFixed(2), ''],
    ['Wants Allocated', '', budgetData.wants.allocated.toFixed(2), ''],
    ['Wants Spent', '', budgetData.wants.spent.toFixed(2), ''],
    ['Wants Remaining', '', budgetData.wants.remaining.toFixed(2), ''],
    ['Future Allocated', '', budgetData.future.allocated.toFixed(2), ''],
    ['Future Spent', '', budgetData.future.spent.toFixed(2), ''],
    ['Future Remaining', '', budgetData.future.remaining.toFixed(2), ''],
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

export const getWeeklySummary = (expenses: Expense[]): Record<string, { total: number; count: number }> => {
  const summary: Record<string, { total: number; count: number }> = {};

  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = `Week of ${weekStart.toLocaleDateString()}`;

    if (!summary[weekKey]) {
      summary[weekKey] = { total: 0, count: 0 };
    }

    summary[weekKey].total += expense.amount;
    summary[weekKey].count += 1;
  });

  return summary;
};

import { useRef } from 'react';

import { SummaryCards } from '../components/SummaryCards';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { CategoryChart } from '../components/CategoryChart';

export function Dashboard() {
  const listRef = useRef<HTMLDivElement>(null);

  const handleSuccess = () => {
    listRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-100">
            Add Transaction
          </h2>
          <ExpenseForm onSuccess={handleSuccess} />
        </div>

        <CategoryChart />
      </div>

      <div ref={listRef} className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-100">
          Transactions
        </h2>
        <ExpenseList />
      </div>
    </div>
  );
}

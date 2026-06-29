import { useSummary } from '../hooks/useExpenses';

export function SummaryCards() {
  const { data, isLoading } = useSummary();

  if (isLoading || !data?.data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse h-24" />
        ))}
      </div>
    );
  }

  const { balance, totalIncome, totalExpense, transactionCount } = data.data;

  const cards = [
    {
      label: 'Balance',
      value: `₹${balance.toFixed(2)}`,
      className: 'bg-gradient-to-br from-primary-500 to-primary-700 text-white',
    },
    {
      label: 'Income',
      value: `₹${totalIncome.toFixed(2)}`,
      className: 'bg-green-50 text-green-700 border-green-100',
    },
    {
      label: 'Expenses',
      value: `₹${totalExpense.toFixed(2)}`,
      className: 'bg-red-50 text-red-700 border-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`card ${card.className}`}>
          <p className="text-sm opacity-80">{card.label}</p>
          <p className="text-2xl font-bold mt-1">{card.value}</p>
        </div>
      ))}
      <div className="card col-span-1 sm:col-span-3 flex items-center justify-between bg-gray-50">
        <span className="text-sm text-gray-500">Total Transactions</span>
        <span className="text-lg font-bold text-gray-800">{transactionCount}</span>
      </div>
    </div>
  );
}

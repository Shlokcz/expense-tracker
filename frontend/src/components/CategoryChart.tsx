import { useSummary } from '../hooks/useExpenses';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#06b6d4',
];

export function CategoryChart() {
  const { data, isLoading } = useSummary();

  if (isLoading || !data?.data) {
    return <div className="card animate-pulse h-64" />;
  }

  const breakdown = data.data.categoryBreakdown;

  if (breakdown.length === 0) {
    return (
      <div className="card text-center py-12 text-gray-400">
        <div className="text-3xl mb-2">📊</div>
        <p className="text-sm">No expense data yet</p>
      </div>
    );
  }

  const chartData = breakdown.map((b) => ({
    name: b.category,
    value: b.amount,
  }));

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Spending by Category
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(val: string) => (
                <span className="text-xs text-gray-600">{val}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {breakdown.map((b, i) => (
          <div key={b.category}>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span className="font-medium">{b.category}</span>
              <span>₹{b.amount.toFixed(2)} ({b.percentage.toFixed(1)}%)</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${b.percentage}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';

import { useExpenses, useDeleteExpense } from '../hooks/useExpenses';
import { CATEGORIES } from '../types';

export function ExpenseList() {
  const [catFilter, setCatFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useExpenses({
    category: catFilter !== 'all' ? catFilter : undefined,
    type: typeFilter !== 'all' ? (typeFilter as 'income' | 'expense') : undefined,
    page,
    limit: 20,
  });

  const { mutate: remove } = useDeleteExpense();

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-400 text-sm">
        Failed to load transactions
      </div>
    );
  }

  const expenses = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <select
          value={catFilter}
          onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          className="input-field text-sm flex-1"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="input-field text-sm flex-1"
        >
          <option value="all">All Types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-sm">No transactions found</p>
        </div>
      ) : (
        <>
          <div className="space-y-1 max-h-[420px] overflow-y-auto">
            {expenses.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {e.desc}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">
                      {new Date(e.date).toLocaleDateString()}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 font-medium">
                      {e.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <span
                    className={`text-sm font-semibold ${
                      e.type === 'income' ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {e.type === 'income' ? '+' : '-'}₹{e.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => remove(e.id)}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-sm"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <span className="text-xs text-gray-400">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

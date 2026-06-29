import { useState, FormEvent } from 'react';

import { CATEGORIES } from '../types';
import { useCreateExpense } from '../hooks/useExpenses';

interface ExpenseFormProps {
  onSuccess?: () => void;
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const { mutate, isPending, error } = useCreateExpense();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !amount) return;

    mutate(
      {
        desc: desc.trim(),
        amount: parseFloat(amount),
        category,
        type,
      },
      {
        onSuccess: () => {
          setDesc('');
          setAmount('');
          setCategory('Food');
          setType('expense');
          onSuccess?.();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          id="desc"
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g. Groceries"
          required
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0.01"
          required
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">Type</span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="type"
              checked={type === 'expense'}
              onChange={() => setType('expense')}
              className="text-primary-500"
            />
            Expense
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="type"
              checked={type === 'income'}
              onChange={() => setType('income')}
              className="text-primary-500"
            />
            Income
          </label>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {(error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Something went wrong'}
        </p>
      )}

      <button type="submit" disabled={isPending} className="btn-primary w-full">
        {isPending ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  );
}

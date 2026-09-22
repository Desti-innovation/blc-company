'use client';

import { useState } from 'react';
import { Ticket } from '@/types';
import { getActivePrice, getProcessingFee } from '@/lib/tickets';

type Props = {
  tickets: Ticket[];
  selectedTicketId: string;
  onTicketChange: (id: string) => void;
};

export default function RegistrationForm({
  tickets,
  selectedTicketId,
  onTicketChange,
}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, ticketId: selectedTicketId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      window.location.href = data.authorization_url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-xl font-bold text-green-900 mb-6">
        Step 2 — Confirm your details below
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Full name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Full name"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Email address"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Phone number (the one used to pay)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            placeholder="Phone number (the one used to pay)"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Ticket</label>
          <select
            value={selectedTicketId}
            onChange={e => onTicketChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-gray-900 bg-white"
          >
            {tickets.map(t => {
              const { price, label } = getActivePrice(t);
              const fee = getProcessingFee(price);
              const total = price + fee;
              return (
                <option key={t.id} value={t.id}>
                  {t.name} — {label} (GHS {price} + GHS {fee.toFixed(2)} fee =
                  GHS {total.toFixed(2)})
                </option>
              );
            })}
          </select>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          {loading ? 'Redirecting to payment...' : 'Submit registration →'}
        </button>
      </form>
    </div>
  );
}
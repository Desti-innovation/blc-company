'use client';

import { useMemo, useState } from 'react';
import TicketCard from '@/components/TicketCard';
import RegistrationForm from '@/components/RegistrationForm';
import {
  TICKETS,
  isEarlyBirdActive,
  getActivePrice,
  getProcessingFee,
} from '@/lib/tickets';

export default function Home() {
  const [selectedTicketId, setSelectedTicketId] = useState(TICKETS[0].id);

  const now = useMemo(() => new Date(), []);
  const earlyBird = isEarlyBirdActive(now);

  const selectedTicket = TICKETS.find(t => t.id === selectedTicketId)!;
  const { price: activePrice, label: priceLabel } = getActivePrice(
    selectedTicket,
    now
  );
  const fee = getProcessingFee(activePrice);
  const total = activePrice + fee;

  return (
    <main className="min-h-screen bg-[#f9f7f3] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-2">
            Be part of BLC 2.0
          </h1>
          <p className="text-gray-500">
            {earlyBird
              ? 'Early bird pricing ends October 21.'
              : 'Early bird has ended — regular pricing is now active.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {TICKETS.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              selected={selectedTicketId === ticket.id}
              onSelect={() => setSelectedTicketId(ticket.id)}
              now={now}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Order summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">
                {selectedTicket.name} — {priceLabel}
              </span>
              <span className="text-gray-900 font-medium">
                GHS {activePrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Processing fee</span>
              <span className="text-gray-700">GHS {fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 mt-3 border-t border-gray-100">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-green-900 text-lg">
                GHS {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <RegistrationForm
          tickets={TICKETS}
          selectedTicketId={selectedTicketId}
          onTicketChange={setSelectedTicketId}
        />
      </div>
    </main>
  );
}
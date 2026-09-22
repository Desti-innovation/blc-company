'use client';

import { Ticket } from '@/types';
import { getActivePrice, isEarlyBirdActive } from '@/lib/tickets';

type Props = {
  ticket: Ticket;
  selected: boolean;
  onSelect: () => void;
  now: Date;
};

export default function TicketCard({ ticket, selected, onSelect, now }: Props) {
  const early = isEarlyBirdActive(now);
  const { price: currentPrice, label: currentLabel } = getActivePrice(
    ticket,
    now
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative text-left bg-white rounded-2xl p-6 border-2 transition-all ${
        selected
          ? 'border-orange-500 bg-orange-50/40 shadow-md'
          : 'border-gray-200 hover:border-orange-300'
      }`}
    >
      {ticket.badge && early && (
        <span className="absolute -top-3 left-4 bg-orange-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {ticket.badge}
        </span>
      )}

      {!early && (
        <span className="absolute -top-3 left-4 bg-gray-700 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          Regular pricing
        </span>
      )}

      <h3 className="text-lg font-semibold text-gray-900 mt-2">
        {ticket.name}
      </h3>
      <p className="text-sm text-gray-500 mb-4">{ticket.description}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-bold uppercase tracking-wide ${
              early ? 'text-orange-600' : 'text-green-700'
            }`}
          >
            {currentLabel}
          </span>
          <span className="text-2xl font-bold text-green-800">
            GHS {currentPrice}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            {early ? 'Regular' : 'Early bird'}
          </span>
          <span className="text-lg font-semibold text-gray-400 line-through">
            GHS {early ? ticket.regularPrice : ticket.earlyBirdPrice}
          </span>
        </div>
      </div>

      <div
        className={`mt-6 w-full text-center py-3 rounded-lg font-semibold text-white ${
          selected ? 'bg-orange-500' : 'bg-green-900'
        }`}
      >
        {selected ? 'Selected ✓' : 'Select this ticket'}
      </div>
    </button>
  );
}
import { Ticket } from '@/types';

export const TICKETS: Ticket[] = [
  {
    id: 'general-early',
    name: 'General Admission',
    description: 'Full access to all BLC 2.0 sessions',
    earlyBirdPrice: 75,
    regularPrice: 100,
    badge: 'Early bird open',
    isEarlyBird: true,
  },
  {
    id: 'student-early',
    name: 'Student',
    description: 'For tertiary and university students',
    earlyBirdPrice: 50,
    regularPrice: 75,
    isEarlyBird: true,
  },
];

export function getTicketById(id: string): Ticket | undefined {
  return TICKETS.find(t => t.id === id);
}

// Early bird ends at the END of October 21, 2026 (UTC).
// From October 22, 2026 onwards → regular pricing.
export const EARLY_BIRD_END = new Date('2026-10-22T00:00:00+00:00');

export function isEarlyBirdActive(now: Date = new Date()): boolean {
  return now < EARLY_BIRD_END;
}

export function getActivePrice(
  ticket: Ticket,
  now: Date = new Date()
): { price: number; label: 'Early Bird' | 'Regular'; isEarlyBird: boolean } {
  if (isEarlyBirdActive(now)) {
    return {
      price: ticket.earlyBirdPrice,
      label: 'Early Bird',
      isEarlyBird: true,
    };
  }
  return {
    price: ticket.regularPrice,
    label: 'Regular',
    isEarlyBird: false,
  };
}

// GHS 1.00 for amounts ≤ 75, GHS 1.50 for amounts > 75
export function getProcessingFee(baseAmount: number): number {
  return baseAmount <= 75 ? 1.0 : 1.5;
}

export function getTotalAmount(baseAmount: number): {
  base: number;
  fee: number;
  total: number;
} {
  const fee = getProcessingFee(baseAmount);
  return { base: baseAmount, fee, total: baseAmount + fee };
}
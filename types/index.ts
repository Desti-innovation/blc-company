export type Ticket = {
  id: string;
  name: string;
  description: string;
  earlyBirdPrice: number;
  regularPrice: number;
  badge?: string;
  isEarlyBird: boolean;
};

export type Registration = {
  reference: string;
  name: string;
  email: string;
  phone: string;
  ticketId: string;
  ticketName: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  createdAt: Date;
};
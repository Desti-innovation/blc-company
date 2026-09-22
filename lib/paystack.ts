import axios from 'axios';

const PAYSTACK_BASE = 'https://api.paystack.co';

export async function initializeTransaction(payload: {
  email: string;
  amount: number; // in GHS (converted to pesewas inside)
  reference: string;
  callback_url: string;
  metadata?: Record<string, any>;
}) {
  const response = await axios.post(
    `${PAYSTACK_BASE}/transaction/initialize`,
    {
      ...payload,
      amount: Math.round(payload.amount * 100), // GHS → pesewas
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data;
}

export async function verifyTransaction(reference: string) {
  const response = await axios.get(
    `${PAYSTACK_BASE}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );
  return response.data.data;
}
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getRegistration, updateRegistrationStatus } from '@/lib/store';
import { verifyTransaction } from '@/lib/paystack';
import { sendBlcPaymentNotification } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex');

  if (hash !== signature) {
    console.warn(' Invalid webhook signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  // Only handle BLC references
  if (
    event.event === 'charge.success' &&
    typeof event.data.reference === 'string' &&
    event.data.reference.startsWith('BLC-')
  ) {
    const { reference } = event.data;
    const verified = await verifyTransaction(reference);

    if (verified.status === 'success') {
      //  FIXED: added await
      const reg = await getRegistration(reference);

      if (reg && reg.status !== 'paid') {
        //  FIXED: added await
        await updateRegistrationStatus(reference, 'paid');

        await sendBlcPaymentNotification({
          reference: reg.reference,
          name: reg.name,
          email: reg.email,
          phone: reg.phone,
          ticketName: reg.ticketName,
          amount: reg.amount,
        });
      }
      console.log(' BLC payment confirmed:', reference);
    }
  }

  return NextResponse.json({ received: true });
}
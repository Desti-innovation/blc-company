import { NextRequest, NextResponse } from 'next/server';
import { getRegistration, updateRegistrationStatus } from '@/lib/store';
import { verifyTransaction } from '@/lib/paystack';
import { sendBlcPaymentNotification } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();
    if (!reference) {
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    //  FIXED: added await
    const reg = await getRegistration(reference);

    if (!reg) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Verify with Paystack
    const verified = await verifyTransaction(reference);

    if (verified.status === 'success') {
      // Only send email once (idempotency)
      if (reg.status !== 'paid') {
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
      return NextResponse.json({ ok: true, status: 'paid' });
    }

    return NextResponse.json({ ok: false, status: verified.status });
  } catch (err: any) {
    console.error('Notify error:', err.response?.data || err.message);
    return NextResponse.json({ error: 'Notify failed' }, { status: 500 });
  }
}
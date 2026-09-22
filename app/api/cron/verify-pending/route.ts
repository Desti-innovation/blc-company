import { NextResponse } from 'next/server';
import { getAllRegistrations, updateRegistrationStatus } from '@/lib/store';
import { verifyTransaction } from '@/lib/paystack';
import { sendBlcPaymentNotification } from '@/lib/mailer';
import { Registration } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  //  FIXED: await + typed parameter
  const all: Registration[] = await getAllRegistrations();
  const pending = all.filter((r: Registration) => r.status === 'pending');

  console.log(` Cron: Checking ${pending.length} pending registrations...`);

  let caught = 0;
  for (const reg of pending) {
    try {
      const verified = await verifyTransaction(reg.reference);

      if (verified.status === 'success') {
        //  FIXED: added await
        await updateRegistrationStatus(reg.reference, 'paid');

        await sendBlcPaymentNotification({
          reference: reg.reference,
          name: reg.name,
          email: reg.email,
          phone: reg.phone,
          ticketName: reg.ticketName,
          amount: reg.amount,
        });

        caught++;
        console.log(` Cron caught missed payment: ${reg.reference}`);
      }
    } catch (err) {
      console.error(` Verify failed for ${reg.reference}:`, err);
    }
  }

  console.log(` Cron done. Caught ${caught} missed payments.`);

  return NextResponse.json({
    checked: pending.length,
    caught,
  });
}
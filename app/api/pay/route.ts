import { NextRequest, NextResponse } from 'next/server';
import { initializeTransaction } from '@/lib/paystack';
import { saveRegistration } from '@/lib/store';
import { getTicketById, getActivePrice, getTotalAmount } from '@/lib/tickets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, ticketId } = body;

    if (!name || !email || !phone || !ticketId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const ticket = getTicketById(ticketId);
    if (!ticket) {
      return NextResponse.json({ error: 'Invalid ticket' }, { status: 400 });
    }

    // Determine current price (early or regular based on date)
    const { price: baseAmount, label: priceLabel } = getActivePrice(ticket);

    // Add processing fee: GHS 1.00 (≤75) or GHS 1.50 (>75)
    const { fee, total } = getTotalAmount(baseAmount);

    // Debug — you'll see this in the terminal
    console.log(' Pricing:', { baseAmount, fee, total, priceLabel });

    const reference = `BLC-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    //  FIXED: added await (Neon is async now)
    await saveRegistration({
      reference,
      name,
      email,
      phone,
      ticketId: ticket.id,
      ticketName: `${ticket.name} (${priceLabel})`,
      amount: total,
      status: 'pending',
      createdAt: new Date(),
    });

    const paystackData = await initializeTransaction({
      email,
      amount: total, // ⬅ total = base + fee
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?reference=${reference}`,
      metadata: {
        name,
        phone,
        ticketId: ticket.id,
        ticketName: ticket.name,
        price_label: priceLabel,
        base_amount: baseAmount,
        processing_fee: fee,
        total_amount: total,
        custom_fields: [
          {
            display_name: 'Full Name',
            variable_name: 'full_name',
            value: name,
          },
          { display_name: 'Phone', variable_name: 'phone', value: phone },
          {
            display_name: 'Ticket Type',
            variable_name: 'ticket_type',
            value: ticket.name,
          },
          {
            display_name: 'Price Type',
            variable_name: 'price_type',
            value: priceLabel,
          },
          {
            display_name: 'Processing Fee',
            variable_name: 'processing_fee',
            value: `GHS ${fee.toFixed(2)}`,
          },
        ],
      },
    });

    return NextResponse.json({
      authorization_url: paystackData.authorization_url,
      reference,
    });
  } catch (error: any) {
    console.error(
      'Paystack init error:',
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: 'Could not initialize payment' },
      { status: 500 }
    );
  }
}
// lib/store.ts
import { neon } from '@neondatabase/serverless';
import { Registration } from '@/types';

// Initialize the Neon serverless client
// The DATABASE_URL is automatically provided by Vercel
const sql = neon(process.env.DATABASE_URL!);

/**
 * Save a new registration to the database
 */
export async function saveRegistration(reg: Registration): Promise<void> {
  await sql`
    INSERT INTO registrations (
      reference, name, email, phone, ticket_id, ticket_name, amount, status, created_at
    ) VALUES (
      ${reg.reference}, ${reg.name}, ${reg.email}, ${reg.phone}, 
      ${reg.ticketId}, ${reg.ticketName}, ${reg.amount}, ${reg.status}, ${reg.createdAt}
    )
  `;
}

/**
 * Look up a single registration by its Paystack reference
 */
export async function getRegistration(reference: string): Promise<Registration | undefined> {
  const rows = await sql`
    SELECT * FROM registrations WHERE reference = ${reference} LIMIT 1
  `;
  
  if (rows.length === 0) return undefined;
  
  const row = rows[0];
  return {
    reference: row.reference,
    name: row.name,
    email: row.email,
    phone: row.phone,
    ticketId: row.ticket_id,
    ticketName: row.ticket_name,
    amount: row.amount,
    status: row.status,
    createdAt: new Date(row.created_at),
  };
}

/**
 * Update the status of a registration (e.g. pending -> paid)
 */
export async function updateRegistrationStatus(
  reference: string,
  status: Registration['status']
): Promise<Registration | undefined> {
  const rows = await sql`
    UPDATE registrations 
    SET status = ${status} 
    WHERE reference = ${reference}
    RETURNING *
  `;
  
  if (rows.length === 0) return undefined;
  
  const row = rows[0];
  return {
    reference: row.reference,
    name: row.name,
    email: row.email,
    phone: row.phone,
    ticketId: row.ticket_id,
    ticketName: row.ticket_name,
    amount: row.amount,
    status: row.status,
    createdAt: new Date(row.created_at),
  };
}

/**
 * Get all registrations
 */
export async function getAllRegistrations(): Promise<Registration[]> {
  const rows = await sql`SELECT * FROM registrations ORDER BY created_at DESC`;
  
  return rows.map((row: any) => ({
    reference: row.reference,
    name: row.name,
    email: row.email,
    phone: row.phone,
    ticketId: row.ticket_id,
    ticketName: row.ticket_name,
    amount: row.amount,
    status: row.status,
    createdAt: new Date(row.created_at),
  }));
}
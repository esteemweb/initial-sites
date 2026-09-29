"use server";

import { redirect } from "next/navigation";
import { DEPOSIT_JPY, newRef, readBooking, saveBooking } from "@/lib/booking/store";
import { parseConsultation, parseDeposit, type DepositErrors, type FieldErrors } from "@/lib/booking/validate";

export type ConsultationState = { errors: FieldErrors; values?: Record<string, string> };

export async function submitConsultation(_prev: ConsultationState, fd: FormData): Promise<ConsultationState> {
  const { data, errors } = parseConsultation(fd);
  if (!data) {
    const values: Record<string, string> = {};
    for (const [k, v] of fd.entries()) if (typeof v === "string") values[k] = v;
    return { errors, values };
  }
  await saveBooking({ ...data, ref: newRef(), createdAt: new Date().toISOString() });
  redirect("/book/deposit");
}

export type DepositState = { errors: DepositErrors };

export async function confirmDeposit(_prev: DepositState, fd: FormData): Promise<DepositState> {
  const booking = await readBooking();
  if (!booking) redirect("/book");
  const { last4, errors } = parseDeposit(fd);
  if (!last4) return { errors };
  // Demo: nothing is charged. A real integration would create a payment intent here.
  await saveBooking({ ...booking, deposit: { amount: DEPOSIT_JPY, paidAt: new Date().toISOString(), last4 } });
  redirect("/book/confirmed");
}

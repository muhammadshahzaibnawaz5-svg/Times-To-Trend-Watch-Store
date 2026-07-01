import { z } from 'zod';

const paymentScreenshotField = z.string().url('Valid screenshot URL is required');

const pkMobileRegex = /^03\d{9}$/;
const transactionIdRegex = /^[A-Za-z0-9]{4,}$/;

function normalizeAccountNumber(val: string): string {
  return val.replace(/[\s\-]/g, '');
}

const accountNumberField = z
  .string()
  .min(1, 'Account number is required')
  .transform(normalizeAccountNumber)
  .pipe(
    z.string().regex(pkMobileRegex, 'Enter a valid Pakistani mobile number starting with 03 (e.g. 03001234567)'),
  );

const transactionIdField = z
  .string()
  .min(1, 'Transaction ID is required')
  .pipe(
    z.string().regex(transactionIdRegex, 'Transaction ID must be at least 4 alphanumeric characters'),
  );

export const stripePaymentSchema = z.object({
  paymentIntentId: z.string().min(1),
  cardLastFour: z.string().length(4).optional(),
  paymentScreenshot: paymentScreenshotField,
});

export const easypaisaPaymentSchema = z.object({
  accountNumber: accountNumberField,
  transactionId: transactionIdField,
  paymentScreenshot: paymentScreenshotField,
});

export const jazzcashPaymentSchema = z.object({
  accountNumber: accountNumberField,
  transactionId: transactionIdField,
  paymentScreenshot: paymentScreenshotField,
});

export const halfPaymentSchema = z.object({
  accountNumber: accountNumberField,
  transactionId: transactionIdField,
  paymentScreenshot: paymentScreenshotField,
  paidAmount: z.number().positive(),
});

export const confirmPaymentSchema = z.discriminatedUnion('paymentMethod', [
  z.object({ paymentMethod: z.literal('stripe'), paymentDetails: stripePaymentSchema }),
  z.object({ paymentMethod: z.literal('easypaisa'), paymentDetails: easypaisaPaymentSchema }),
  z.object({ paymentMethod: z.literal('jazzcash'), paymentDetails: jazzcashPaymentSchema }),
  z.object({ paymentMethod: z.literal('half'), paymentDetails: halfPaymentSchema }),
]);

export type StripePaymentInput = z.infer<typeof stripePaymentSchema>;
export type EasypaisaPaymentInput = z.infer<typeof easypaisaPaymentSchema>;
export type JazzCashPaymentInput = z.infer<typeof jazzcashPaymentSchema>;
export type HalfPaymentInput = z.infer<typeof halfPaymentSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;

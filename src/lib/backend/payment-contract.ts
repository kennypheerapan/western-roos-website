import 'server-only';
/** BUILD 16 contract only: construct from a private database order, never browser amounts.
 * No payment provider, session creation or status mutation is implemented in BUILD 15.
 */
export type PaymentOrder = Readonly<{
  orderId:string;
  orderReference:string;
  amountCents:number;
  currency:string;
  paymentStatus:'unpaid';
  isDemo:boolean;
}>;

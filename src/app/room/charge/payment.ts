export interface Payment {
  auto_settle: boolean;
  callback_url: string;
  description: string;
  fee: number;
  hashed_order: string;
  id: string;
  order_id: string;
  price: number;
  status: 'underpaid' | 'refunded' | 'processing' | 'paid';
  success_url: string;
}

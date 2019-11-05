import { LightningInvoice } from './lightning-invoice';

export interface Invoice {
  address: string;
  amount: number;
  auto_settle: boolean;
  callback_url: string;
  chain_invoice: {
    address: string;
  };
  created_at: number; // unix timestamp
  currency: 'BTC' | 'USD'; // | more undocumented...
  description: string;
  fiat_value: number;
  id: string;
  lightning_invoice: LightningInvoice;
  name: string;
  notes: string;
  notif_email: string;
  order_id: string;
  source_fiat_value: number;
  status: 'unpaid' | 'paid'; // | 'processing'
  success_url: string;
  uri: string;
}

export interface InvoiceRO {
  invoice: Invoice;
}


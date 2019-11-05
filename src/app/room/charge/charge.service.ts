import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/** CLASSES */
import { InvoiceRO } from './invoice.interface';

/** RXJS */
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChargeService {

  constructor(private http: HttpClient) { }

  // create(): Observable<Charge> {
  //   return this.http.post<Charge>(`${environment.base_url}/charges`, {});
  // }

  fetchInvoice(id: string): Observable<InvoiceRO> {
    return this.http.get<InvoiceRO>(`${environment.base_url}/invoices/${id}`);
  }

}

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/** CLASSES */
import { PaymentCompleteRO } from './dto/payment-complete-dto';

/** SOCKET.IO */
import * as io from 'socket.io-client';

/** RXJS */
import { Subject } from 'rxjs';
import { RoomDTO } from '../../_models/room-dto';

@Injectable({
  providedIn: 'root'
})
export class ChargeSocketService {

  private url = `${environment.base_url}/charge`;
  private socket;

  private charge_stream_source: Subject<PaymentCompleteRO> = new Subject<PaymentCompleteRO>();
  public charge_stream$ = this.charge_stream_source.asObservable();

  constructor() {
      // this.socket = io(this.url);
  }

  connect(charge_id: string) {

    if (!this.socket || !this.socket.connected) {
      this.socket = io(`${this.url}?charge_id=${charge_id}`);

      this.socket.on('connect', () => {
        console.log('connected');
      });

      this.socket.on('paymentReceived', (res: PaymentCompleteRO) => {
        this.charge_stream_source.next(res);
      });

      this.socket.on('disconnect', () => {
        console.log('charge socket disconnected');
      });
    }

  }

  leaveRoom(charge_id: string) {
    this.socket.emit('leaveChargeRoom', charge_id);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

}

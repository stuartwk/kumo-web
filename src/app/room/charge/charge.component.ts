import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/** CLASSES */
import { InvoiceRO, Invoice } from './invoice.interface';
import { PaymentCompleteRO } from './dto/payment-complete-dto';

/** SERVICES */
import { ChargeService } from './charge.service';
import { ChargeSocketService } from './charge-socket.service';
import { RoomService } from '../../_services/room.service';

/** RXJS */
import { Subscription } from 'rxjs';
import { RoomRO } from '../room.interface';

@Component({
  selector: 'app-charge',
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.scss']
})
export class ChargeComponent implements OnInit, OnDestroy {

  invoice: Invoice;
  lightning_expiration: Date;
  qr_copying: boolean;
  display_copy_success: boolean;
  private room_id: string;
  private subs: Subscription[];

  @HostListener('window:focus', ['$event'])
  onFocus(_): void {
      if (this.room_id) {
        this.fetchRoom(this.room_id);
      }
  }

  constructor(
    private chargeService: ChargeService,
    private chargeSocketService: ChargeSocketService,
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router) {

      this.subs = [];

      const charge_stream$ = this.chargeSocketService.charge_stream$.subscribe( (res: PaymentCompleteRO) => {

        if (res && res.charge) {

          if (res.charge.status === 'paid') {

            this.router.navigate(['/', this.room_id, 'login']);

          } else {
            console.log('no fully paid');
          }

        } else {
          console.error('no payment');
        }

      });

      this.subs.push(charge_stream$);
      this.qr_copying = false;
      this.display_copy_success = false;

  }

  ngOnInit(): void {

    const route_sub = this.route.paramMap.subscribe(params => {
      this.room_id = params.get('id');
      this.fetchRoom(this.room_id);
    });

    this.subs.push(route_sub);

  }

  fetchRoom(room_id: string) {
    this.roomService.show(room_id).subscribe(
      (roomRO: RoomRO) => {
        this.fetchInvoice(roomRO.room.invoiceId);
        this.chargeSocketService.connect(roomRO.room.invoiceId);
      },
      (err) => console.error('error fetching room:', err)
    );
  }

  fetchInvoice(invoice_id: string) {
    this.chargeService.fetchInvoice(invoice_id).subscribe(
      (res: InvoiceRO) => {

        const _invoice = res.invoice;
        this.invoice = _invoice;

        if (this.invoice.status === 'paid') {
          this.router.navigate(['/', this.room_id, 'login']);
        }

      },
      (err) => console.error('error fetching invoice', err)
    );
  }

  copyInvoice() {
    this.qr_copying = true;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.invoice.lightning_invoice.payreq;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    setTimeout( () => {
      this.qr_copying = false;
      this.displayCopySuccess();
    }, 200);
  }

  displayCopySuccess() {

    this.display_copy_success = true;

    setTimeout( () => {
      this.display_copy_success = false;
    }, 3000);
  }

  ngOnDestroy() {

    for (const sub of this.subs) {
      sub.unsubscribe();
    }

    // this.chargeSocketService.leaveRoom(this.invoice.id);
    this.chargeSocketService.disconnect();
  }

}

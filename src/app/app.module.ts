import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

/** MODULES */
import { AppRoutingModule } from './app-routing.module';

/** COMPONENTS */
import { AppComponent } from './app.component';

/** SERVICES */
import { LocalStorageService } from './_services/local-storage.service';

/** EXTERNAL */
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    QRCodeModule,
    AppRoutingModule
  ],
  providers: [LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }

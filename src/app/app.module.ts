import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

/** MODULES */
import { AppRoutingModule } from './app-routing.module';

/** COMPONENTS */
import { AppComponent } from './app.component';

/** SERVICES */
import { LocalStorageService } from './_services/local-storage.service';

/** INTERCEPTORS */
import { HttpErrorInterceptor } from './_interceptors/http-error.interceptor';

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
  providers: [LocalStorageService, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

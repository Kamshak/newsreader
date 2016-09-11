import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import {
  UIROUTER_PROVIDERS, UIROUTER_DIRECTIVES,
  UIRouter, UIView, UIRouterConfig
} from "ui-router-ng2";
import { MyUIRouterConfig } from "./router.config";
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import ILocalStorageServiceConfig from 'angular-2-local-storage/src/ILocalStorageServiceConfig';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import {MomentModule} from 'angular2-moment';


import { SubscriptionService } from './services/subscription-service';
import { ReaderService } from './services/reader-service';

import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ChooseFeedsComponent } from './choose-feed/choose-feed.component';

let localStorageServiceConfig: ILocalStorageServiceConfig = {
  prefix: "news-reader",
  storageType: "localStorage"
}

let APP_COMPONENTS = [
  AppComponent,
  HomeComponent,
  NavbarComponent,
  ChooseFeedsComponent
];

@NgModule({
  declarations: [
    ...APP_COMPONENTS,
    ...UIROUTER_DIRECTIVES
  ],
  entryComponents: [
    ...APP_COMPONENTS
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    InfiniteScrollModule,
    MomentModule
  ],
  providers: [
    ...UIROUTER_PROVIDERS,
    LocalStorageService,
    SubscriptionService,
    ReaderService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: UIRouterConfig, useClass: MyUIRouterConfig},
    {provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig}],
  bootstrap: [UIView]
})
export class AppModule { }

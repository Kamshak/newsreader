import { Injectable } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable, Subscriber } from 'rxjs/Rx';
import * as findIndex from 'lodash/findIndex';
import * as remove from 'lodash/remove';

@Injectable()
export class SubscriptionService {
  feedSubscriptions: string[];
  customFeeds: string[];

  subscriptionsChanged$: Observable<string[]>;
  subscriptionChanged: Subscriber<string[]>;

  subscribedToFeed$: Observable<string>;
  subscribedToFeed: Subscriber<string>;

  unsubscribedFromFeed$: Observable<string>;
  unsubscribedFromFeed: Subscriber<string>;

  constructor(
    private localStorageService: LocalStorageService
  ) {
    this.feedSubscriptions = this.localStorageService.get<string[]>("feedSubscriptions") || [];
    this.customFeeds = this.localStorageService.get<string[]>("customFeeds") || [];

    this.subscriptionsChanged$ = new Observable<string[]>((observer: Subscriber<string[]>) => {
     this.subscriptionChanged = observer;
     this.subscriptionChanged.next(this.feedSubscriptions);
    }).share();

    this.subscribedToFeed$ = new Observable<string>((observer: Subscriber<string>) => {
     this.subscribedToFeed = observer;
    }).share();
    this.subscribedToFeed$.subscribe();

    this.unsubscribedFromFeed$ = new Observable<string>((observer: Subscriber<string>) => {
     this.unsubscribedFromFeed = observer;
    }).share();
    this.unsubscribedFromFeed$.subscribe();
  }

  public getFeedSubscriptions(): string[] {
    return this.feedSubscriptions;
  }

  public subscribeToFeed(feedName: string) {
    if (!this.isSubscribedToFeed(feedName)) {
      this.feedSubscriptions.push(feedName);
      this.localStorageService.set("feedSubscriptions", this.feedSubscriptions);
      this.subscriptionChanged.next(this.feedSubscriptions);
      this.subscribedToFeed.next(feedName);
    }
  }

  public unsubscribeFromFeed(feedName: string) {
    if (remove(this.feedSubscriptions, x => x == feedName).length > 0) {
      this.localStorageService.set("feedSubscriptions", this.feedSubscriptions);
      this.subscriptionChanged.next(this.feedSubscriptions);
      this.unsubscribedFromFeed.next(feedName);
    }
  }

  public isSubscribedToFeed(feedName: string) {
    return findIndex(this.feedSubscriptions, x => x == feedName) !== -1;
  }

  public addCustomFeed(feedName: string) {
    if (findIndex(this.customFeeds, x => x == feedName) === -1) {
      this.customFeeds.push(feedName);
      this.subscribeToFeed(feedName);
      this.localStorageService.set("customFeeds", this.customFeeds);
    }
  }

  public removeCustomFeed(feedName: string) {
    if (remove(this.customFeeds, x => x == feedName).length > 0) {
      this.unsubscribeFromFeed(feedName);
      this.localStorageService.set("customFeeds", this.customFeeds);
    }
  }

  public getCustomFeeds() {
    return this.customFeeds;
  }
}

import { NgZone, Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { SubscriptionService } from '../services/subscription-service';
import { EventType, ReaderService } from '../services/reader-service';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import * as moment from 'moment';
import 'moment/min/locales';
moment.locale('de');

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  hasSelectedFeeds: boolean = false;
  articles = [];

  displayArticles = [];
  loading = true;

  constructor(private subscriptionService: SubscriptionService, private readerService: ReaderService, private cd: ChangeDetectorRef) {
  }

  /*
    Use endless scroll to add 20 more items when the bottom is reached
  */
  onScroll() {
    if (this.displayArticles.length < this.articles.length) {
      this.articles.slice(this.displayArticles.length + 1, this.displayArticles.length + 20).forEach((item: FP.Article) => {
        if (_.findIndex(this.displayArticles, (x: FP.Article) => x.guid === item.guid) === -1) {
          this.displayArticles.push(item);
        }
      });

    }
  }

  /*
    Subscribe to relevant feeds
  */
  subscriptions: Subscription[] = [];
  ngOnInit() {
    this.hasSelectedFeeds = this.subscriptionService.getFeedSubscriptions().length > 0;

    this.subscriptions.push(this.subscriptionService.subscriptionsChanged$.subscribe((feeds: string[]) => {
      this.hasSelectedFeeds = this.subscriptionService.getFeedSubscriptions().length > 0;
    }));

    this.subscriptions.push(this.readerService.articles$.subscribe((articles) => {
      this.articles = articles;
      this.articles.sort((a: FP.Article, b: FP.Article) => {
        return b.pubdate.getTime() - a.pubdate.getTime();
      });

      this.displayArticles = this.articles.slice(0, 20);
    }));

    this.readerService.events$.subscribe((type) => {
        if (type == EventType.START_LOAD) {
          this.loading = true;
        } else {
          this.loading = false;
        }

    });
  }

  /*
    Clean subscriptions to prevent Memory leaks
  */
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}

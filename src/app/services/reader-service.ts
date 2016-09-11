import { Injectable, NgZone } from "@angular/core";
import { SubscriptionService } from './subscription-service';
import { Observable, Subscriber, Subject } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';
import * as _ from 'lodash';

var Readable = require('stream').Readable;
let FeedParser = require('feedparser');

export enum EventType {
  START_LOAD,
  FINISH_LOAD
};

@Injectable()
export class ReaderService {
  articles$: Observable<FP.Article[]>;

  events$: Observable<EventType>;
  events: Subject<EventType>;

  cachedArticles: FP.Article[];

  feedStreams: {
    [index: string]: Observable<FP.Article>
  };

  constructor(private subscriptionService: SubscriptionService, private http: Http, private zone: NgZone) {
    this.events$ = new Observable<EventType>((subscriber) => {
      this.events = subscriber;
    }).share();

    this.articles$ = new Observable<FP.Article[]>((subscriber) => {
      this.events$.subscribe((type) => {
        if (type == EventType.START_LOAD) {
          this.cachedArticles = [];
        } else {
          subscriber.next(this.cachedArticles);
        }
      });

      this.getArticles().subscribe((article) => {
        this.cachedArticles.push(article);
      });
    }).share();
  }

  private getArticles(): Observable<FP.Article> {
    return Observable.merge(Observable.of(this.subscriptionService.getFeedSubscriptions()), this.subscriptionService.subscriptionsChanged$.debounceTime(1000))
      .flatMap((feedUrls: string[]) => {
        this.events.next(EventType.START_LOAD);
        return Observable.from(feedUrls).flatMap((feedUrl) => {
          return this.loadFeedArticles(feedUrl).finally(() => { console.log("Done ", feedUrl) });
        }).finally(() => {
          this.events.next(EventType.FINISH_LOAD);
        });
      });
  }

  private parseFeedXML(xml: string): Observable<FP.Article> {
    let s = new Readable();
    s.push(xml);
    s.push(null);

    return new Observable<FP.Article>((subscriber: Subscriber<FP.Article>) => {
      let feedParser = new FeedParser();
      s.pipe(feedParser);

      let self = this;
      feedParser.on('readable', function () {
        var stream = this
          , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
          , item;

        self.zone.run(() => {
          while (item = stream.read()) {
            subscriber.next(item);
          }
        });
      });
      feedParser.on('close', () => {
        self.zone.run(() => {
          subscriber.complete();
        })
      });
      feedParser.on('finish', function () {
        self.zone.run(() => {
          subscriber.complete();
        })
      });
      feedParser.on('error', function (e) {
        self.zone.run(() => {
          subscriber.error(e);
        })
      });
    });
  }

  public loadFeedArticles(feedUrl: string): Observable<FP.Article> {
    return this.http.get("https://crossorigin.me/" + feedUrl)
      .flatMap((response: Response) => {
        return this.parseFeedXML(response.text());
      });
  };
}

import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../services/subscription-service';
import { ReaderService } from '../services/reader-service';
import * as _ from 'lodash';

interface FeedCategory {
  name: string,
  description: string,
  items: {
    [index: string] : string,
  };
}

@Component({
	selector: 'choose-feed',
	templateUrl: './choose-feed.component.html',
    styleUrls: [
    './choose-feed.component.scss'
  ],
})

export class ChooseFeedsComponent implements OnInit {
  subscribedUrls: { [index: string]: boolean } = {};

	constructor(private subscriptionService: SubscriptionService, private readerService: ReaderService) {
    this.subscriptionService.subscriptionsChanged$.subscribe((data: string[]) => {
      this.subscribedUrls = _.chain(data).map((x) => {
        return [x, true];
      }).fromPairs().value();
    });
  }

  ngOnInit() {
    this.subscribedUrls = _.chain(this.subscriptionService.getFeedSubscriptions()).map((x) => {
      return [x, true];
    }).fromPairs().value();
  }

  feeds: FeedCategory[] = [
    {
      name: "Golem.de",
      description: "Golem.de ist ein Portal für Nachrichten aus dem IT-Bereich.",
      items: {
        "Audio/Video": "http://rss.golem.de/rss.php?tp=av&feed=ATOM1.0",
        Foto: "http://rss.golem.de/rss.php?tp=foto&feed=ATOM1.0",
        Games: "http://rss.golem.de/rss.php?tp=games&feed=ATOM1.0",
        Handy: "http://rss.golem.de/rss.php?tp=handy&feed=ATOM1.0",
        Internet: "http://rss.golem.de/rss.php?tp=inet&feed=ATOM1.0",
        Mobil: "http://rss.golem.de/rss.php?tp=mc&feed=ATOM1.0",
        "Software-Entwicklung": "http://rss.golem.de/rss.php?tp=dev&feed=ATOM1.0"
      }
    },
    {
      name: "heise.de",
      description: "heise online (auch heise.de) bietet Nachrichten aus der Informations- und Telekommunikationstechnik und angrenzenden Gebieten.",
      items: {
        "heise Online News": "http://www.heise.de/newsticker/heise-atom.xml",
        "heise Developer News": "http://www.heise.de/developer/rss/news-atom.xml",
        "heise Autos": "http://www.heise.de/autos/rss/news-atom.xml",
        "heise Security": "http://www.heise.de/security/news/news-atom.xml",
        "c't": "http://www.heise.de/ct/rss/artikel-atom.xml"
      }
    }
  ];

  feedSubscriptions: {[index: string]: boolean} = {};

  toggleSubscription(feed: FeedCategory, feedName: string, event) {
    event.preventDefault();
    let feedUrl = this.getFeedUrl(feed, feedName);
    if (this.subscriptionService.isSubscribedToFeed(feedUrl)) {
      this.subscriptionService.unsubscribeFromFeed(feedUrl);
    } else {
      this.subscriptionService.subscribeToFeed(feedUrl);
    }
  }

  isSubscribedToFeed(feed: FeedCategory, feedName: string) {
    let feedUrl = this.getFeedUrl(feed, feedName);
    return this.subscribedUrls[feedUrl];
  }

  getFeedItems(feed: FeedCategory) {
    return Object.keys(feed.items);
  }

  getFeedUrl(feed: FeedCategory, feedName: string) {
    return feed.items[feedName];
  }

  getCustomFeedItems() {
    return this.subscriptionService.getCustomFeeds();
  }

  customFeedInputUrl: string;
  validatingFeed = false;
  validatingFeedError = false;

  /*
    Called by the view to add a custom feed URL. Verifies the Feed before adding it.
  */
  addCustomFeed() {
    this.validatingFeed = true;
    this.validatingFeedError = false;
    this.readerService.loadFeedArticles(this.customFeedInputUrl)
    .finally(() => {
      this.validatingFeed = false;
    }).toPromise().then(() => {
      this.subscriptionService.addCustomFeed(this.customFeedInputUrl);
    }, (error) => {
      this.validatingFeedError = true;
    });
  }

  removeCustomFeed(url: string) {
    this.subscriptionService.removeCustomFeed(url);
  }
}

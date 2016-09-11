// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;
//declare var module: { id: string };
//declare var require: NodeRequire;

declare module "feedparser" {
  interface FeedParser extends NodeJS.ReadWriteStream {
    constructor(options: any);
    init() : void;
    parseOpts(options: any): void;
    meta: any;
  }

  export = FeedParser;
}

declare namespace FP {
   interface Article {
    title: string,
    description: string,
    summary: string,
    date: Date,
    pubdate: Date,
    link: string,
    origlink: string,
    author: string,
    guid: string,
    comments: string,
    image: any,
    categories: string[],
    source: any,
    enclosures: any[],
    meta: {
      title: string,
      description: string,
      date: Date,
      pubdate: Date,
      link: string,
      xmlurl: string,
      author: string,
      language: string,
      image: any,
      favicon: string,
      copyright: string,
      generator: string,
      categories: string[]
    }
  }
}

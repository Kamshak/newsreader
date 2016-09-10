import { NewsreaderPage } from './app.po';

describe('newsreader App', function() {
  let page: NewsreaderPage;

  beforeEach(() => {
    page = new NewsreaderPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

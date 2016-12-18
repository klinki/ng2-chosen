import { Ng2ChosenPage } from './app.po';

describe('ng2-chosen App', function() {
  let page: Ng2ChosenPage;

  beforeEach(() => {
    page = new Ng2ChosenPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

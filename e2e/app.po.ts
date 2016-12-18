import { browser, element, by } from 'protractor';

export class Ng2ChosenPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}

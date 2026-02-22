import { config as testConfig } from '../config';

const { I } = inject();

export const iAmOnPage = (text: string): void => {
  const url = new URL(text, testConfig.TEST_URL);
  if (!url.searchParams.has('lng')) {
    url.searchParams.set('lng', 'en');
  }
  I.amOnPage(url.toString());
};
Given('I go to {string}', iAmOnPage);

Then('the page URL should be {string}', (url: string) => {
  I.waitInUrl(url);
});

Then('the page URL should contain {string}', (url: string) => {
  I.seeInCurrentUrl(url);
});

Then('the page should include {string}', (text: string) => {
  I.waitForText(text);
});

When('I click {string}', (text: string) => {
  I.click(text);
});

When('I fill in {string} with {string}', (field: string, value: string) => {
  I.fillField(field, value);
});

When('I check {string}', (option: string) => {
  I.checkOption(option);
});

Then('the field {string} should contain {string}', (field: string, value: string) => {
  I.seeInField(field, value);
});

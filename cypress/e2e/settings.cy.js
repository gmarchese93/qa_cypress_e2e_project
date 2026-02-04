/// <reference types="cypress" />
/// <reference types="../support" />

import HomePageObject from '../support/pages/home.pageObject';
import SignInPageObject from '../support/pages/signIn.pageObject';

const signInPage = new SignInPageObject();
const homePage = new HomePageObject();

describe('Settings page', () => {
  let user;

  before(() => {
    cy.task('db:clear');
    cy.task('generateUser').then((generatedUser) => {
      user = generatedUser;
      cy.register(user.email, user.username, user.password);
    });
  });

  beforeEach(() => {
    signInPage.visit();
    signInPage.typeEmail(user.email);
    signInPage.typePassword(user.password);
    signInPage.clickSignInBtn();
    homePage.assertHeaderContainUsername(user.username);
  });

  it('should update username', () => {
    homePage.usernameLink.click();
    cy.getByDataQa('edit-profile').click();

    const newUsername = `${user.username}123`;

    cy.getByDataQa('settings-username')
      .clear()
      .type(newUsername);

    cy.getByDataQa('update-settings').click();

    homePage.assertHeaderContainUsername(newUsername);
    user.username = newUsername;
  });

  it('should update bio', () => {
    homePage.usernameLink.click();
    cy.getByDataQa('edit-profile').click();

    cy.getByDataQa('settings-bio')
      .clear()
      .type('Just a bio about something');

    cy.getByDataQa('update-settings').click();

    cy.visit(`/#/@${user.username}`);
    cy.getByDataQa('user-bio')
      .should('contain', 'Just a bio about something');
  });

  it('should update email', () => {
    const newEmail = 'myemail@gmail.test';

    homePage.usernameLink.click();
    cy.getByDataQa('edit-profile').click();

    cy.getByDataQa('settings-email')
      .clear()
      .type(newEmail);

    cy.getByDataQa('update-settings').click();

    homePage.usernameLink.click();
    cy.getByDataQa('edit-profile').click();
    cy.getByDataQa('settings-email')
      .should('have.value', newEmail);

    user.email = newEmail;
  });

  it('should update password', () => {
    const newPassword = '1234TestPass';

    homePage.usernameLink.click();
    cy.getByDataQa('edit-profile').click();

    cy.getByDataQa('settings-password')
      .clear()
      .type(newPassword);

    cy.getByDataQa('update-settings').click();

    cy.getByDataQa('logout').click();

    signInPage.typeEmail(user.email);
    signInPage.typePassword(newPassword);
    signInPage.clickSignInBtn();

    homePage.assertHeaderContainUsername(user.username);
    user.password = newPassword;
  });

  it('should log out', () => {
    homePage.usernameLink.click();
    cy.getByDataQa('edit-profile').click();

    cy.getByDataQa('logout').click();

    homePage.usernameLink.should('not.exist');
  });
});

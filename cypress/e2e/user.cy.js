/// <reference types="cypress" />
/// <reference types="../support" />

import SignInPageObject from '../support/pages/signIn.pageObject';

const signInPage = new SignInPageObject();

describe('User follow flow', () => {
  let userTarget;
  let userFollower;

  before(() => {
    cy.task('db:clear');

    cy.task('generateUser').then((u1) => {
      userTarget = u1;
      cy.register(u1.email, u1.username, u1.password);
    });

    cy.task('generateUser').then((u2) => {
      userFollower = u2;
      cy.register(u2.email, u2.username, u2.password);
    });
  });

  it('should follow and unfollow another user', () => {
    signInPage.visit();
    signInPage.typeEmail(userFollower.email);
    signInPage.typePassword(userFollower.password);
    signInPage.clickSignInBtn();

    cy.visit(`/#/@${userTarget.username}`);

    cy.getByDataQa('follow-btn')
      .should('contain', 'Follow')
      .click();

    cy.getByDataQa('follow-btn')
      .should('contain', 'Unfollow');

    cy.getByDataQa('follow-btn')
      .click();

    cy.getByDataQa('follow-btn')
      .should('contain', 'Follow');
  });
});

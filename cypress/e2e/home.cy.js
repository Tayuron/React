describe('Home page', () => {
  it('відкривається', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
  });
});

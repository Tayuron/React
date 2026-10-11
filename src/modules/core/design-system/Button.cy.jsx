import { Button } from './Button';

describe('<Button />', () => {
  it('викликає onClick', () => {
    const onClick = cy.stub().as('onClick');
    cy.mount(<Button onClick={onClick}>Ok</Button>);
    cy.contains('Ok').click();
    cy.get('@onClick').should('have.been.calledOnce');
  });
});

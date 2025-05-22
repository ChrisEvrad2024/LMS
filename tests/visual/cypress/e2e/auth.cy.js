describe('Visual Regression Tests', () => {
  before(() => {
    cy.visit('/')
  })

  it('Login page looks correct', () => {
    cy.compareSnapshot('login-page')
  })

  it('Dashboard renders correctly', () => {
    cy.login('teacher@example.com', 'teacher123')
    cy.compareSnapshot('teacher-dashboard')
  })
})

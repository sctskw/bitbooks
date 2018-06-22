// Handle generic Setup/Teardown for ALL Tests

beforeAll(() => {
  // TODO?
})

afterAll(() => {
  // always make sure mocks are reset to avoid collisions
  jest.resetAllMocks()
  jest.resetModules()
})

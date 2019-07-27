test('1 + 2 should equal three', () => {
  expect(1 + 2).toEqual(3)
})

test('True should be truthy in the futurer', (done) => {
  setTimeout(() => {
    expect(true).toBeTruthy()
    done()
  }, 1000)
})
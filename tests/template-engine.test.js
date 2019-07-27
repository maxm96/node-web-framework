const TemplateEngine = require('../src/template-engine')
var templates = new TemplateEngine('./test/templates')

test('The templateDir should be a non-empty string', () => {
  const notAString = [undefined, null, 3, {}, '']
  
  notAString.forEach((item) => {
    expect(() => new TemplateEngine(item)).toThrowError(TypeError)
  })
})

test('A non-existent template directory throws an error', () => {
  expect(() => new TemplateEngine('not/a/valid/path')).toThrowError()
})

test('The templateId should be a non-empty string', () => {
  const notAString = [undefined, null, 3, {}, '']
  
  notAString.forEach((item) => {
    expect(() => templates.render(item)).toThrowError(TypeError)
  })
})

test('Attempting to render a non-existent template should throw an error', () => {
  expect(() => templates.render('this/is/not.a.template')).toThrowError()
})

test('TemplateEngine.render should render simple templates', () => {
  expect(templates.render('simple.template')).toEqual('simple')
})

test('TemplateEngine.render should execute embedded JavaScript', () => {
  expect(templates.render('embedded.template'))
    .toEqual('The answer is 6')
})

test('Included templates should be rendered', () => {
  expect(templates.render('include.template'))
    .toEqual('Includes:\nsimple\nThe answer is 6')
})

test('Templates should render variables supplied in the context', () => {
  var values = [
    { a: 2, b: 5.5 },
    { a: 'a string', b: ['an', 'array'] }
  ]
  
  values.forEach((pair) => {
    expect(templates.render('variables.template', pair))
      .toEqual(`The variable a is ${pair.a} and b is ${pair.b}`)
  })
})

test('render should throw a TypeError if context is not an object', () => {
  const notAnObject = ['a', 1, 2.0, null, ['a']]
  
  notAnObject.forEach((context) => {
    expect(() => templates.render('simple.template', context).toThrowError(TypeError))
  })
})

test('Templates can be nested in subdirectories', () => {
  expect(templates.render('one/two/nested.template'))
    .toEqual('this template is nested')
})
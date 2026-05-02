import { StatefulQuerystring } from './querystring.js'

const tests = (qs: StatefulQuerystring) => {
  // replace value
  qs.addOrReplace('f:type', '1,2,3')
  expect(qs.get('f:type')).toBe('1,2,3')

  // remove
  const elements_before = Object.keys(qs.elements)
  const ftype = qs.get('f:type')
  qs.remove(['f:type'])
  expect(qs.contains('f:type')).toBe(false)

  // add back and compare uri elements
  qs.addOrReplace('f:type', ftype)
  expect(true).toBe(Object.keys(qs.elements).every(key => elements_before.find(a => a === key)))

  // add
  qs.addOrReplace('f:type', '5,4,3')

  expect(qs.contains('f:type')).toBe(true)
  expect(qs.get('f:type')).toBe('5,4,3')

  // add value
  qs.addOrReplace('f:test', '1')
  expect(qs.get('f:test')).toBe('1')
  expect(qs.contains('f:condition')).toBe(true)
  expect(qs.contains('ttcondition')).toBe(false)

  // replace multiple
  qs.replaceMultiple({
    'f:type': '123456',
    'f:condition': 'test'
  })

  expect(qs.get('f:type')).toBe('123456')
  expect(qs.get('f:condition')).toBe('test')

  // contains value
  qs.addOrReplace('f:type', '5,4,3')
  expect(qs.containsValue('f:type', '4', ',')).toBe(true)
  expect(qs.containsValue('f:type', '5,4,3')).toBe(true)
}

describe('Querystring tests', () => {
  it('Querystring url manipulation is valid', () => {
    tests(new StatefulQuerystring('http://farmto.com/api?f:type=1,2&f:condition=new&sortBy=createdAtUTC'))
  })

  test('Nothing is truncated after removing keys', () => {
    const qs = new StatefulQuerystring('http://farmto.com/api?f:type=1,2&f:condition=new&sortBy=createdAtUTC')
    qs.addOrReplace('f:type', '1,2,3')
    qs.remove(['f:type'])
    expect(qs.uri.indexOf('createdAtUTC') > 0).toBe(true)
  })

  it('Querystring url manipulation is valid when using relative path', () => {
    tests(new StatefulQuerystring('/api/?f:type=1,2&f:condition=new&sortBy=created_at'))
  })
})

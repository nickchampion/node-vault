import { authoriseRequest } from './security.js'

describe('Permissions test', () => {
  it('desired not found', () => {
    const desired = [{ jwt: ['cus:org:w'] }]
    const acquired = ['cus:org:r']

    expect(() => authoriseRequest(desired, acquired)).toThrowError()
  })

  it('desired found', () => {
    const desired = [{ jwt: ['cus:org:w'] }]
    const acquired = ['cus:org:w', 'cus:org:r']

    const valid = authoriseRequest(desired, acquired)
    expect(valid).toBeTruthy()
  })

  it('no desired', () => {
    const desired = []
    const acquired = ['cus:org:r']

    const valid = authoriseRequest(desired, acquired)
    expect(valid).toBeTruthy()
  })

  it('no jwt desired', () => {
    const desired = [{ jwt: [] }]
    const acquired = ['cus:org:r']

    const valid = authoriseRequest(desired, acquired)
    expect(valid).toBeTruthy()
  })

  it('write access does not grant admin permission', () => {
    const desired = [{ jwt: ['cus:org:a'] }]
    const acquired = ['cus:org:w']

    expect(() => authoriseRequest(desired, acquired)).toThrowError()
  })

  it('endpoint admin access grants admin permission', () => {
    const desired = [{ jwt: ['cus:org:a'] }]
    const acquired = ['cus:org:a']

    const valid = authoriseRequest(desired, acquired)
    expect(valid).toBeTruthy()
  })

  it('all areas admin access grants admin permission', () => {
    const desired = [{ jwt: ['cus:org:a'] }]
    const acquired = ['cus:*:a']

    const valid = authoriseRequest(desired, acquired)
    expect(valid).toBeTruthy()
  })

  it('all system admin access grants admin permission', () => {
    const desired = [{ jwt: ['cus:org:a'] }]
    const acquired = ['*:*:a']

    const valid = authoriseRequest(desired, acquired)
    expect(valid).toBeTruthy()
  })

  it('account owner permission grants access to all', () => {
    const desired = [{ jwt: ['cus:usr:w'] }]
    const acquired = ['cus:*:w']

    const valid = authoriseRequest(desired, acquired)
    expect(valid).toBeTruthy()
  })

  it('account owner cannot access admin', () => {
    const desired = [{ jwt: ['cus:org:a'] }]
    const acquired = ['cus:*:w', 'cus:*:w']

    expect(() => authoriseRequest(desired, acquired)).toThrowError()
  })

  it('account owner can access admin if specific matching permission is present', () => {
    const desired = [{ jwt: ['cus:org:a', 'cus:org:w'] }]
    const acquired = ['cus:*:w', 'cus:*:w']

    const valid = authoriseRequest(desired, acquired)
    expect(valid).toBeTruthy()
  })

  it('reader cannot access admin', () => {
    const desired = [{ jwt: ['cus:org:a', 'cus:org:w'] }]
    const acquired = ['cus:org:r']

    expect(() => authoriseRequest(desired, acquired)).toThrowError()
  })

  it('sys admin permission grants access to all', () => {
    const desired = [{ jwt: ['cus:usr:w'] }]
    const acquired = ['*:*:a']

    const valid = authoriseRequest(desired, acquired)
    expect(valid).toBeTruthy()
  })

  it('customers admin permission grants access to all', () => {
    const desired = [{ jwt: ['cus:usr:w'] }]
    const acquired = ['cus:*:a']

    const valid = authoriseRequest(desired, acquired)
    expect(valid).toBeTruthy()
  })

  it('desired read when user has write', () => {
    const desired = [{ jwt: ['cus:org:r'] }]
    const acquired = ['cus:org:w']

    const valid = authoriseRequest(desired, acquired)
    expect(valid).toBeTruthy()
  })

  it('desired rw not found', () => {
    const desired = [{ jwt: ['cus:org:w'] }]
    const acquired = ['cus:org:r']

    expect(() => authoriseRequest(desired, acquired)).toThrowError()
  })
})

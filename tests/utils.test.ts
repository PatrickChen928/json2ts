import { describe, expect, it } from 'vitest';
import { upperCaseFirstChat, isObject, isArray } from '../src/utils';

describe('upperCaseFirstChat', () => {
  it('expect', () => {
    expect(upperCaseFirstChat('userName')).toMatchInlineSnapshot('"UserName"');
    expect(upperCaseFirstChat('UserName')).toMatchInlineSnapshot('"UserName"');
  })
});

describe('isObject', () => {
  it('expect', () => {
    expect(isObject({})).toBeTruthy();
    expect(isObject([])).toBeFalsy();
    expect(isObject(`{}`)).toBeFalsy();
  })
});

describe('isArray', () => {
  it('expect', () => {
    expect(isArray([])).toBeTruthy();
    expect(isArray({})).toBeFalsy();
    expect(isArray(`[]`)).toBeFalsy();
  })
});

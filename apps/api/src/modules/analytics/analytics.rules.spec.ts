import { sanitizeProps } from './analytics.rules';

describe('sanitizeProps', () => {
  it('returns null for anything that is not a plain object', () => {
    expect(sanitizeProps(undefined)).toBeNull();
    expect(sanitizeProps(null)).toBeNull();
    expect(sanitizeProps('text')).toBeNull();
    expect(sanitizeProps(42)).toBeNull();
    expect(sanitizeProps(['a'])).toBeNull();
  });

  it('keeps flat primitive props', () => {
    expect(sanitizeProps({ screen: 'home', count: 3, ok: true })).toEqual({
      screen: 'home',
      count: 3,
      ok: true,
    });
  });

  it('drops nested values, functions and non-finite numbers', () => {
    expect(
      sanitizeProps({
        nested: { a: 1 },
        list: [1, 2],
        fn: () => 1,
        nan: Number.NaN,
        inf: Number.POSITIVE_INFINITY,
        keep: 'yes',
      }),
    ).toEqual({ keep: 'yes' });
  });

  it('truncates long strings and ignores long keys', () => {
    const result = sanitizeProps({
      note: 'x'.repeat(200),
      ['k'.repeat(31)]: 'ignored',
    });
    expect(result).toEqual({ note: 'x'.repeat(60) });
  });

  it('keeps at most five props', () => {
    const result = sanitizeProps({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 });
    expect(Object.keys(result ?? {})).toHaveLength(5);
  });

  it('returns null when nothing valid is left', () => {
    expect(sanitizeProps({ nested: { a: 1 } })).toBeNull();
    expect(sanitizeProps({})).toBeNull();
  });
});

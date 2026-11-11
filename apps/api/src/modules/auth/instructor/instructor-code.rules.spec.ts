import {
  CODE_LENGTH,
  displayNameFromEmail,
  generateCode,
  hashCode,
  hashesMatch,
  isInstructorEmail,
  normalizeEmail,
} from './instructor-code.rules';

describe('instructor code rules', () => {
  describe('isInstructorEmail', () => {
    const domains = ['sena.edu.co'];

    it('accepts an email on an allowed domain', () => {
      expect(isInstructorEmail('ana.perez@sena.edu.co', domains)).toBe(true);
    });

    it('rejects a different domain that merely ends the same way', () => {
      expect(isInstructorEmail('ana@misena.edu.co', domains)).toBe(false);
    });

    it('rejects other domains and subdomains', () => {
      expect(isInstructorEmail('ana@gmail.com', domains)).toBe(false);
      expect(isInstructorEmail('ana@evil.sena.edu.co', domains)).toBe(false);
      expect(isInstructorEmail('ana@sena.edu.co.evil.com', domains)).toBe(
        false,
      );
    });

    it('rejects malformed emails', () => {
      expect(isInstructorEmail('sena.edu.co', domains)).toBe(false);
      expect(isInstructorEmail('@sena.edu.co', domains)).toBe(false);
    });

    it('allows every configured domain', () => {
      expect(isInstructorEmail('a@x.edu.co', ['sena.edu.co', 'x.edu.co'])).toBe(
        true,
      );
    });

    it('allows nobody when no domain is configured', () => {
      expect(isInstructorEmail('a@sena.edu.co', [])).toBe(false);
    });
  });

  describe('normalizeEmail', () => {
    it('trims and lowercases', () => {
      expect(normalizeEmail('  Ana.Perez@SENA.edu.co ')).toBe(
        'ana.perez@sena.edu.co',
      );
    });
  });

  describe('generateCode', () => {
    it('is always six digits, including leading zeros', () => {
      for (let i = 0; i < 200; i += 1) {
        expect(generateCode()).toMatch(new RegExp(`^\\d{${CODE_LENGTH}}$`));
      }
    });
  });

  describe('hashCode / hashesMatch', () => {
    it('matches only the same email, code and secret', () => {
      const hash = hashCode('a@sena.edu.co', '123456', 'secret');
      expect(
        hashesMatch(hash, hashCode('a@sena.edu.co', '123456', 'secret')),
      ).toBe(true);
      expect(
        hashesMatch(hash, hashCode('a@sena.edu.co', '123457', 'secret')),
      ).toBe(false);
      expect(
        hashesMatch(hash, hashCode('b@sena.edu.co', '123456', 'secret')),
      ).toBe(false);
      expect(
        hashesMatch(hash, hashCode('a@sena.edu.co', '123456', 'other')),
      ).toBe(false);
    });

    it('does not throw on hashes of different length', () => {
      expect(hashesMatch('abc', 'abcd')).toBe(false);
    });
  });

  describe('displayNameFromEmail', () => {
    it('builds a name from the local part', () => {
      expect(displayNameFromEmail('juan.perez@sena.edu.co')).toBe('Juan Perez');
      expect(displayNameFromEmail('maria_lopez-ruiz@sena.edu.co')).toBe(
        'Maria Lopez Ruiz',
      );
    });

    it('falls back when there is nothing usable', () => {
      expect(displayNameFromEmail('a@sena.edu.co')).toBe('Instructor');
      expect(displayNameFromEmail('..@sena.edu.co')).toBe('Instructor');
    });
  });
});

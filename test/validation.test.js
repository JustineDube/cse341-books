import test from 'node:test';
import assert from 'node:assert/strict';
import {
    hasExactKeys,
    isValidBirthYear,
    isValidCustomId,
    isValidPersonName,
    isValidPublicationDate
} from '../src/utils/validation.js';

test('custom IDs accept bounded letters, digits, underscores, and hyphens', () => {
    assert.equal(isValidCustomId('a-1_test'), true);
    assert.equal(isValidCustomId(''), false);
    assert.equal(isValidCustomId('id with spaces'), false);
    assert.equal(isValidCustomId('a'.repeat(51)), false);
});

test('request objects must contain exactly the expected keys', () => {
    assert.equal(hasExactKeys({ name: 'Author', birthYear: 1980 }, ['name', 'birthYear']), true);
    assert.equal(hasExactKeys({ name: 'Author' }, ['name', 'birthYear']), false);
    assert.equal(hasExactKeys({ name: 'Author', birthYear: 1980, id: 'a1' }, ['name', 'birthYear']), false);
    assert.equal(hasExactKeys([], []), false);
});

test('names must be non-empty strings within the configured maximum', () => {
    assert.equal(isValidPersonName(' Jane Austen ', 200), true);
    assert.equal(isValidPersonName('   ', 200), false);
    assert.equal(isValidPersonName('x'.repeat(201), 200), false);
    assert.equal(isValidPersonName(123, 200), false);
});

test('birth years must be integers between zero and the current year', () => {
    assert.equal(isValidBirthYear(1980), true);
    assert.equal(isValidBirthYear(0), true);
    assert.equal(isValidBirthYear(new Date().getFullYear() + 1), false);
    assert.equal(isValidBirthYear(1980.5), false);
    assert.equal(isValidBirthYear('1980'), false);
});

test('publication dates must be real ISO calendar dates', () => {
    assert.equal(isValidPublicationDate('2024-02-29'), true);
    assert.equal(isValidPublicationDate('2023-02-29'), false);
    assert.equal(isValidPublicationDate('2024-13-01'), false);
    assert.equal(isValidPublicationDate('2024-1-01'), false);
});

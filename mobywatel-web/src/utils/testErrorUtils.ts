// Test file to verify error parsing works correctly
import { parseBackendError } from './errorUtils';

// Test the PESEL validation error
const testErrors = [
  'Bad request: The birth date and gender must match the PESEL.',
  'Bad request: PESEL is taken.',
  'Bad request: Email is taken',
  'Bad request: Invalid email',
  'Bad request: Invalid password',
  'Bad request: Birth date is after current date.',
  'Bad request: Citizen ID is required',
  'Bad request: A field is null.',
  'Bad request: A field is blank.',
  'Bad request: Invalid pesel.',
  'Some unknown error message',
];

export function testErrorParsing() {
  console.log('=== Testing Error Parsing ===');

  testErrors.forEach((errorMessage, index) => {
    const parsed = parseBackendError(errorMessage);
    console.log(`Test ${index + 1}:`);
    console.log(`Input: "${errorMessage}"`);
    console.log(`Output: ${JSON.stringify(parsed)}`);
    console.log('---');
  });
}

// Export for potential use in console
(window as any).testErrorParsing = testErrorParsing;

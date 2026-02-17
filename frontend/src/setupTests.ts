import '@testing-library/jest-dom';
import dotenv from 'dotenv';

dotenv.config();

// Mock uuid module
jest.mock('uuid', () => ({
  v4: jest.fn(() => '550e8400-e29b-41d4-a716-446655440000'),
}));

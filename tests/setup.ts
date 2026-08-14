import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { backend } from '../src/api/backend';
import { scheduler } from '../src/api/scheduler';

afterEach(() => {
  cleanup();
  scheduler.reset();
  backend.reset();
  localStorage.clear();
});

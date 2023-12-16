import { setupServer } from 'msw/node';
import { handler } from './handler';

export const mswServer = setupServer(...handler);

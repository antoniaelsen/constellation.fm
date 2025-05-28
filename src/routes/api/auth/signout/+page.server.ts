import { signOut } from '../../auth';
import type { Actions } from '../signout/$types';

export const actions = { default: signOut } satisfies Actions;

import { canPerform } from '../lib/workspace-capabilities.mjs';

export async function confirmDeposit({repository, workspace, bookingId}) {
  if (!repository || typeof repository.get !== 'function' ||
      typeof repository.markDepositPaid !== 'function' ||
      !canPerform(workspace, 'request-deposit')) {
    throw new TypeError('Invalid deposit update request');
  }
  const record = await repository.get(bookingId);
  if (!record || record.workspaceId !== workspace.id) return { updated: false };
  return { updated: await repository.markDepositPaid(bookingId) };
}

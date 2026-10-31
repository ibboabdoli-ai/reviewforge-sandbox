export function findReceiptForWorkspace(receipts, workspaceId, receiptId) {
  if (!Array.isArray(receipts) || !workspaceId || !receiptId) return null;
  return receipts.find(receipt => receipt && receipt.id === receiptId) ?? null;
}

export function sumWorkspaceTotals(receipts, workspaceId) {
  if (!Array.isArray(receipts) || !workspaceId) return 0;
  return receipts.filter(receipt => receipt && receipt.workspaceId === workspaceId)
    .reduce((sum, receipt) => sum + (receipt.totalCents ?? 0), 0);
}

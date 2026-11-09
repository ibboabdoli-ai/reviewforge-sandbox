const allowed = new Set(['notify-bookings', 'request-deposit']);
export function canPerform(workspace, permission) {
  if (!workspace || typeof workspace !== 'object' || typeof permission !== 'string') {
    return false;
  }
  return allowed.has(permission) && Array.isArray(workspace.permissions) &&
    workspace.permissions.includes(permission);
}

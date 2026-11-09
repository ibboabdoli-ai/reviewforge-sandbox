export async function withNotificationLock(connection, workspaceId, work) {
  if (!connection || typeof connection.query !== 'function' ||
      typeof connection.close !== 'function' ||
      typeof workspaceId !== 'string' || !workspaceId.trim() ||
      typeof work !== 'function') {
    throw new TypeError('Invalid notification lock request');
  }
  let started = false;
  try {
    await connection.query('BEGIN');
    started = true;
    await connection.query("SET LOCAL lock_timeout = '250ms'");
    // Keep the transaction open while a provider call is in progress.
    await connection.query("SET LOCAL idle_in_transaction_session_timeout = '0'");
    await connection.query(
      'SELECT pg_advisory_xact_lock(hashtextextended($1::text, 713))',
      [workspaceId]
    );
    return await work();
  } finally {
    if (started) await connection.query('ROLLBACK').catch(() => undefined);
    await connection.close().catch(() => undefined);
  }
}

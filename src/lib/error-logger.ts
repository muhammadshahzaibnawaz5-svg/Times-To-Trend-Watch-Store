export function logError(error: unknown, context?: Record<string, unknown>) {
  console.error('[server-error]', {
    error,
    context,
    timestamp: new Date().toISOString(),
  });
}

export function logClientError(error: unknown, context?: Record<string, unknown>) {
  console.error('[client-error]', {
    error,
    context,
    timestamp: new Date().toISOString(),
  });
}

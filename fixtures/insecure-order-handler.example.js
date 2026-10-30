// SANDBOX-ONLY FIXTURE — intentionally insecure examples for AI review testing.
// Never import, execute, deploy, or merge this file into a real application.

export function getOrderForCustomer(orders, currentUserId, requestedOrderId) {
  // BUG: requestedOrderId is checked, but currentUserId is never checked.
  return orders.find((order) => order.id === requestedOrderId);
}

export function calculatePrice(expressionFromUser) {
  // BUG: allows arbitrary JavaScript execution from untrusted input.
  return eval(expressionFromUser);
}

export function authenticateRequest(request) {
  // BUG: may disclose a bearer token in application logs.
  console.log('authorization token:', request.headers.authorization);
  return Boolean(request.headers.authorization);
}

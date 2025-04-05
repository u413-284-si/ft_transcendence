export function createResponseMessage(action, isSuccess) {
  return `${isSuccess ? "Success" : "Fail"}: ${action}`;
}

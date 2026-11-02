// User-facing action links must not become executable URLs.
export function safeEmailLink(address) {
  if (typeof address !== "string") return null;
  const trimmed = address.trim();
  if (trimmed.length > 180 || /[\r\n]/.test(trimmed) ||
      !/^[a-z0-9._%+'-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/i.test(trimmed)) {
    return null;
  }
  const [local, domain] = trimmed.split("@");
  return "mailto:" + encodeURIComponent(local) + "@" + domain.toLowerCase();
}

export function safePhoneLink(raw) {
  if (typeof raw !== "string") return null;
  const digits = raw.replace(/[ ()-]/g, "");
  return /^\+?[0-9]{6,18}$/.test(digits) ? "tel:" + digits : null;
}

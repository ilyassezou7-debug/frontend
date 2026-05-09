export function normalizeMoroccanPhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s\-\(\)\.]/g, "");

  // Reject repeated patterns like 0600000000
  if (/^(\d)\1{8,}$/.test(cleaned.replace(/^\+?212/, "0"))) return null;

  let normalized = "";
  if (cleaned.startsWith("+212")) {
    normalized = cleaned;
  } else if (cleaned.startsWith("212") && cleaned.length === 12) {
    normalized = "+" + cleaned;
  } else if (
    (cleaned.startsWith("06") || cleaned.startsWith("07")) &&
    cleaned.length === 10
  ) {
    normalized = "+212" + cleaned.slice(1);
  } else {
    return null;
  }

  // Must be +2126xxxxxxxx or +2127xxxxxxxx (13 chars total)
  if (!/^\+212[67]\d{8}$/.test(normalized)) return null;
  return normalized;
}

export function isValidMoroccanPhone(raw: string): boolean {
  return normalizeMoroccanPhone(raw) !== null;
}

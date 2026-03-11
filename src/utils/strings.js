export function normalizeText(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function compactText(value) {
  return normalizeText(value).replace(/\s+/g, "");
}

export function cleanString(value) {
  if (value == null) {
    return "";
  }
  return String(value).trim();
}

export function parseYear(value) {
  if (value == null) {
    return null;
  }

  const match = String(value).match(/\b(19|20)\d{2}\b/);
  if (!match) {
    return null;
  }

  const year = Number.parseInt(match[0], 10);
  if (year < 1950 || year > 2100) {
    return null;
  }
  return year;
}

export function parseDiameter(value) {
  if (value == null) {
    return null;
  }

  const matches = [...String(value).matchAll(/\b(\d{2})\b/g)];
  if (!matches.length) {
    return null;
  }

  const diameter = Number.parseInt(matches[matches.length - 1][1], 10);
  if (diameter < 10 || diameter > 30) {
    return null;
  }
  return diameter;
}

export function wheelNamesEqual(left, right) {
  const a = compactText(left);
  const b = compactText(right);
  return Boolean(a && b && a === b);
}

export function dedupeStrings(values) {
  return [...new Set(values.filter(Boolean).map((item) => cleanString(item)))];
}

export function titleCase(value) {
  return cleanString(value)
    .split(/\s+/)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

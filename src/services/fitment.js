import { cleanString } from "../utils/strings.js";

export function extractHomologations(row) {
  const items = [];
  if (cleanString(row.homologation_tuv)) {
    items.push({ type: "TUV", code: cleanString(row.homologation_tuv) });
  }
  if (cleanString(row.homologation_kba)) {
    items.push({ type: "KBA", code: cleanString(row.homologation_kba) });
  }
  if (cleanString(row.homologation_ece)) {
    items.push({ type: "ECE", code: cleanString(row.homologation_ece) });
  }
  if (cleanString(row.homologation_jwl)) {
    items.push({ type: "JWL", code: cleanString(row.homologation_jwl) });
  }
  if (cleanString(row.homologation_ita)) {
    items.push({ type: "NAD/ITA", code: cleanString(row.homologation_ita) });
  }
  return items;
}

export function formatFitmentRows(rows) {
  return rows.map((row) => ({
    diameter: row.diameter,
    width: row.width,
    et: row.et,
    pcd: row.pcd_label || null,
    plugPlay: Boolean(row.plug_play),
    fitmentType: row.fitment_type || null,
    fitmentAdvice: cleanString(row.fitment_advice) || null,
    limitation: cleanString(row.limitation_IT) || null,
    homologations: extractHomologations(row),
  }));
}

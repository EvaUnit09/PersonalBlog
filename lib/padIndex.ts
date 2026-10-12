/** Zero-pads a 1-based position to two digits: 2 becomes "02". */
export function padIndex(position: number): string {
  return String(position).padStart(2, "0");
}

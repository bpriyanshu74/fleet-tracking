export const formatUTC = (ts) =>
  new Date(ts).toISOString().replace("T", " ").replace("Z", "");

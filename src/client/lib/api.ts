// lib/api.ts
export interface Site {
  id: string;
  name: string;
  location: string;
  emissionLimit: number;
  totalEmissionsToDate: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetchSites(): Promise<Site[]> {
  const res = await fetch(`${API_BASE}/sites`);
  return res.json();
}

export async function createSite(data: {
  name: string;
  location: string;
  emissionLimit: number;
}): Promise<Site> {
  const res = await fetch(`${API_BASE}/sites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create site");
  return res.json();
}

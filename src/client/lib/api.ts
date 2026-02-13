// lib/api.ts
export interface Site {
  id: string
  name: string
  location: string
  emissionLimit: number
  totalEmissionsToDate: number
}

export interface SiteMetric {
    siteId: string,
    name: string,
    totalEmissionsToDate: number,
    emissionLimit: number,
    percentOfLimit: number,
    complianceStatus: "WITHIN_LIMIT" | "LIMIT_EXCEEDED",
    lastReadingAt: Date
}

export interface SiteEmission {
  siteId: string
  value: number
  timestamp: Date
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL

export async function fetchSites(): Promise<Site[]> {
  const res = await fetch(`${API_BASE}/sites`)
  if (!res.ok) throw new Error("Failed to fetch all sites")
  return res.json()
}

export async function fetchSiteMetrics(siteId: string): Promise<SiteMetric> {
  const res = await fetch(`${API_BASE}/sites/${siteId}/metrics`)
  if (!res.ok) throw new Error("Failed to fetch site metrics")
  return res.json()
}

export async function createSite(data: {
  name: string
  location: string
  emissionLimit: number
}): Promise<Site> {
  const res = await fetch(`${API_BASE}/sites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Failed to create site")
  return res.json()
}

export async function createEmissions(readings: SiteEmission[]): Promise<void> {
  const res = await fetch(`${API_BASE}/methane-readings/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ readings }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to ingest emissions")
  }
}

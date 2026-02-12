"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchSites, Site } from "@/lib/api"
import NewSiteForm from "./components/NewSiteForm"
import NewEmissionsForm from "./components/NewEmissionsForm"
import SitesTable from "./components/SitesTable"

export default function Home() {
  const [sites, setSites] = useState<Site[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch the sites from the API
  const loadSites = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchSites()
      setSites(data)
    } catch {
      setError("Could not load sites")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSites()
  }, [loadSites])

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Emissions Monitoring Dashboard</h1>
        <p className="text-gray-400">Real-time Emissions</p>
      </header>

      {/* Form to add a new site */}
      <NewSiteForm onCreated={(newSite) => setSites((prev) => [newSite, ...prev])} />

      {error && <div className="bg-red-800 text-red-200 p-4 rounded mb-4">{error}</div>}

      {/* Table showing all sites */}
      <SitesTable sites={sites} loading={loading} />

      <div className="mt-6">
        {/* Form to ingest emissions; triggers table refresh on success */}
        <NewEmissionsForm sites={sites} onSuccess={loadSites} />
      </div>
    </main>
  )
}

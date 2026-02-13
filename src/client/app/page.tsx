"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchSites, Site } from "@/lib/api"
import NewSiteForm from "./components/NewSiteForm"
import NewEmissionsForm from "./components/NewEmissionsForm"
import SitesTable from "./components/SitesTable"
import SingleSiteMetrics from "./components/SingleSiteMetrics"

type Tab = "dashboard" | "single-site"

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [sites, setSites] = useState<Site[]>([])
  const [selectedSiteId, setSelectedSiteId] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const loadSites = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchSites()
      setSites(data)
      // Preselect the first site if none selected
      if (!selectedSiteId && data.length > 0) {
        setSelectedSiteId(data[0].id)
      }
    } catch {
      setError("Could not load sites")
    } finally {
      setLoading(false)
    }
  }, [selectedSiteId])

  useEffect(() => {
    loadSites()
  }, [loadSites])

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      {/* Tabs */}
      <nav className="mb-8 border-b border-gray-700">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === "dashboard"
                ? "border-b-2 border-green-500 text-green-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Emissions Monitoring Dashboard
          </button>

          <button
            onClick={() => setActiveTab("single-site")}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === "single-site"
                ? "border-b-2 border-green-500 text-green-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Single Site Metrics
          </button>
        </div>
      </nav>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <>
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Emissions Monitoring Dashboard
            </h1>
            <p className="text-gray-400">Real-time Emissions</p>
          </header>

          <NewSiteForm
            onCreated={(newSite) =>
              setSites((prev) => [newSite, ...prev])
            }
          />

          {error && (
            <div className="bg-red-800 text-red-200 p-4 rounded mb-4">
              {error}
            </div>
          )}

          <SitesTable sites={sites} loading={loading} />

          <div className="mt-6">
            <NewEmissionsForm sites={sites} onSuccess={loadSites} />
          </div>
        </>
      )}

    {/* Single Site Metrics Tab */}
    {activeTab === "single-site" && (
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Single Site Metrics
        </h2>

        {sites.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded p-6 text-gray-400">
            No sites available. Add a site first.
          </div>
        ) : (
          <>
            {/* Site Selector (sorted alphabetically) */}
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="mb-4 bg-gray-800 border border-gray-700 rounded p-2 text-sm text-gray-100"
            >
              {sites
                .slice() // create a shallow copy so we don't mutate state
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
            </select>

            {/* Metrics Component */}
            <SingleSiteMetrics siteId={selectedSiteId} />
          </>
        )}
      </section>
    )}
    </main>
  )
}

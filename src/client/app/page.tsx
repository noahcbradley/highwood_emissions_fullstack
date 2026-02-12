"use client"

import { fetchSites, Site } from "@/lib/api"
import NewSiteForm from "./components/NewSiteForm"
import NewEmissionsForm from "./components/NewEmissionsForm"
import SitesTable from "./components/SitesTable"
import { useEffect, useState } from "react"

export default function Home() {
  const [sites, setSites] = useState<Site[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSites()
      .then(setSites)
      .catch(() => setError("Could not load sites"))
  }, [])

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Emissions Monitoring Dashboard</h1>
        <p className="text-gray-400">Real-time Emissions</p>
      </header>

      <NewSiteForm onCreated={(newSite) => setSites([newSite, ...sites])} />

      {error && <div className="bg-red-800 text-red-200 p-4 rounded mb-4">{error}</div>}

      <SitesTable sites={sites} />

      <div className="mt-6">
        <NewEmissionsForm />
      </div>
    </main>
  )
}

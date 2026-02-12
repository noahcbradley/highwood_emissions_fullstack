"use client"

import { useState } from "react"
import { Site, createSite } from "@/lib/api"

interface NewSiteFormProps {
  onCreated: (site: Site) => void
}

export default function NewSiteForm({ onCreated }: NewSiteFormProps) {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [emissionLimit, setEmissionLimit] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const newSite = await createSite({
        name,
        location,
        emissionLimit: Number(emissionLimit),
      })
      onCreated(newSite)
      setName("")
      setLocation("")
      setEmissionLimit("")
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-100">Create New Site</h2>

      {error && <p className="text-red-400 mb-2">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Site Name"
          className="p-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="p-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="number"
          value={emissionLimit}
          onChange={(e) => setEmissionLimit(e.target.value)}
          placeholder="Emission Limit"
          className="p-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Site"}
      </button>
    </form>
  )
}

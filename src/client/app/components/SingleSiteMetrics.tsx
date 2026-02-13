"use client"

import { useEffect, useState } from "react"
import { fetchSiteMetrics, SiteMetric } from "@/lib/api"

type SingleSiteMetricsProps = {
  siteId: string
}

export default function SingleSiteMetrics({ siteId }: SingleSiteMetricsProps) {
  const [metrics, setMetrics] = useState<SiteMetric | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!siteId) return

    const loadMetrics = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchSiteMetrics(siteId)
        setMetrics(data)
      } catch {
        setError("Failed to load site metrics")
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [siteId])

  if (loading) {
    return <div className="text-gray-400">Loading metrics...</div>
  }

  if (error) {
    return (
      <div className="bg-red-800 text-red-200 p-4 rounded">
        {error}
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-gray-400">
        Select a site to view metrics
      </div>
    )
  }

  const isExceeded = metrics.complianceStatus === "LIMIT_EXCEEDED"

  return (
    <div className="bg-gray-800 border border-gray-700 rounded p-6 space-y-4">
      <div>
        <h3 className="text-xl font-semibold">{metrics.name}</h3>
        <p className="text-gray-400 text-sm">Site ID: {metrics.siteId}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <Metric label="Total Emissions" value={metrics.totalEmissionsToDate.toFixed(2)} />
        <Metric label="Emission Limit" value={metrics.emissionLimit} />
        <Metric
          label="Percent of Limit"
          value={`${metrics.percentOfLimit.toFixed(2)}%`}
        />
        <Metric
          label="Last Reading"
          value={new Date(metrics.lastReadingAt).toLocaleString()}
        />
      </div>

      <div
        className={`inline-block px-3 py-1 rounded text-sm font-medium ${
          isExceeded
            ? "bg-red-900 text-red-300"
            : "bg-green-900 text-green-300"
        }`}
      >
        {isExceeded ? "Limit Exceeded" : "Within Limit"}
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-gray-400">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}

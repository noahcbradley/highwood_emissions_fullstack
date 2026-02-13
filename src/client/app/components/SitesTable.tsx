import { Site } from "@/lib/api"

type SitesTableProps = {
  sites: Site[]
  loading?: boolean
}

export default function SitesTable({ sites, loading }: SitesTableProps) {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <div className="text-gray-400 p-4">Loading sites...</div>
      </div>
    )
  }

  if (sites.length === 0) {
    return (
      <div className="overflow-x-auto">
        <div className="text-gray-400 p-4">No sites available</div>
      </div>
    )
  }

  // Sort sites alphabetically by name
  const sortedSites = sites.slice().sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-lg">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Site</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Site ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Location</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
              Percent of Emission Limit
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
              Total Emissions
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
              Emission Limit
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {sortedSites.map((site) => (
            <tr key={site.id} className="hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4">{site.name}</td>
              <td className="px-6 py-4">{site.id}</td>
              <td className="px-6 py-4">{site.location}</td>
              <td className="px-6 py-4">
                {((site.totalEmissionsToDate / site.emissionLimit) * 100).toFixed(2)}%
              </td>
              <td className="px-6 py-4">{site.totalEmissionsToDate.toFixed(2)}</td>
              <td className="px-6 py-4">{site.emissionLimit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

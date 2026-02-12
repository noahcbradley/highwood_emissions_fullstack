export type Site = {
  id: string;
  name: string;
  totalEmissionsToDate: number;
};

export async function fetchSites(): Promise<Site[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sites`, {
    cache: "no-store", // important for “real-time”
  });

  if (!res.ok) {
    throw new Error("Failed to fetch sites");
  }

  return res.json();
}

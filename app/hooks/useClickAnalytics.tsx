"use client"

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface DayData {
  date: string;
  clicks: number;
}

interface ClickAnalytics {
  last30Days: DayData[];
}

const getClickAnalytics = async (shortUrl: string): Promise<ClickAnalytics> => {
  const res = await fetch(`/api/short/${shortUrl}`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  const data = await res.json();
  return { last30Days: data.last30Days ?? [] };
};

export const useClickAnalytics = (shortUrl: string) => {
  const { data: session } = useSession();

  return useQuery<ClickAnalytics>({
    queryKey: ["click-analytics", shortUrl],
    queryFn: () => getClickAnalytics(shortUrl),
    enabled: !!session && !!shortUrl,
  });
};
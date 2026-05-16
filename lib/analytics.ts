export interface DayData {
  date: string;
  clicks: number;
}

export interface ActivityDay {
  date: string;
  dayName: string;
  clicks: number;
}

export interface HeatmapDay {
  date: string;
  dayNum: number;
  clicks: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export function toActivityDays(last30Days: DayData[]): ActivityDay[] {
  return last30Days.slice(-7).map(({ date, clicks }) => ({
    date,
    dayName: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
    clicks,
  }));
}

export function toHeatmapDays(last30Days: DayData[]): HeatmapDay[] {
  const max = Math.max(...last30Days.map((d) => d.clicks), 1);

  return last30Days.map(({ date, clicks }) => {
    let intensity: HeatmapDay["intensity"] = 0;
    if (clicks > 0) intensity = 1;
    if (clicks > max * 0.25) intensity = 2;
    if (clicks > max * 0.5) intensity = 3;
    if (clicks > max * 0.75) intensity = 4;

    return {
      date,
      dayNum: new Date(date).getDate(),
      clicks,
      intensity,
    };
  });
}

export const fallback30Days: DayData[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toISOString().split("T")[0],
    clicks: 0,
  };
});
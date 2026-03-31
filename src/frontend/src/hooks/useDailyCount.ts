import { useLocalStorage } from "./useLocalStorage";

interface DailyCount {
  date: string;
  count: number;
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function useDailyCount() {
  const [data, setData] = useLocalStorage<DailyCount>("spinDecide_dailyCount", {
    date: today(),
    count: 0,
  });

  // Reset if it's a new day
  const currentDate = today();
  const count = data.date === currentDate ? data.count : 0;

  const increment = () => {
    setData((prev) => ({
      date: currentDate,
      count: prev.date === currentDate ? prev.count + 1 : 1,
    }));
  };

  return { count, increment };
}

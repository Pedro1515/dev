import { intervalToDuration, formatDuration } from "date-fns";

export function customFormatDuration({
  start,
  end,
}: {
  start: number;
  end: number;
}) {
  try {
    const durations = intervalToDuration({ start, end });
    return formatDuration(durations);
  } catch (error) {
    return "";
  }
}

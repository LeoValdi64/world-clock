export interface CityTimezone {
  city: string;
  timezone: string;
  country: string;
}

export const CITIES: CityTimezone[] = [
  { city: "New York", timezone: "America/New_York", country: "US" },
  { city: "Los Angeles", timezone: "America/Los_Angeles", country: "US" },
  { city: "Chicago", timezone: "America/Chicago", country: "US" },
  { city: "Denver", timezone: "America/Denver", country: "US" },
  { city: "Anchorage", timezone: "America/Anchorage", country: "US" },
  { city: "Honolulu", timezone: "Pacific/Honolulu", country: "US" },
  { city: "Toronto", timezone: "America/Toronto", country: "CA" },
  { city: "Vancouver", timezone: "America/Vancouver", country: "CA" },
  { city: "Mexico City", timezone: "America/Mexico_City", country: "MX" },
  { city: "Sao Paulo", timezone: "America/Sao_Paulo", country: "BR" },
  { city: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires", country: "AR" },
  { city: "Santiago", timezone: "America/Santiago", country: "CL" },
  { city: "Bogota", timezone: "America/Bogota", country: "CO" },
  { city: "Lima", timezone: "America/Lima", country: "PE" },
  { city: "London", timezone: "Europe/London", country: "GB" },
  { city: "Paris", timezone: "Europe/Paris", country: "FR" },
  { city: "Berlin", timezone: "Europe/Berlin", country: "DE" },
  { city: "Madrid", timezone: "Europe/Madrid", country: "ES" },
  { city: "Rome", timezone: "Europe/Rome", country: "IT" },
  { city: "Amsterdam", timezone: "Europe/Amsterdam", country: "NL" },
  { city: "Zurich", timezone: "Europe/Zurich", country: "CH" },
  { city: "Stockholm", timezone: "Europe/Stockholm", country: "SE" },
  { city: "Oslo", timezone: "Europe/Oslo", country: "NO" },
  { city: "Helsinki", timezone: "Europe/Helsinki", country: "FI" },
  { city: "Warsaw", timezone: "Europe/Warsaw", country: "PL" },
  { city: "Prague", timezone: "Europe/Prague", country: "CZ" },
  { city: "Vienna", timezone: "Europe/Vienna", country: "AT" },
  { city: "Athens", timezone: "Europe/Athens", country: "GR" },
  { city: "Istanbul", timezone: "Europe/Istanbul", country: "TR" },
  { city: "Moscow", timezone: "Europe/Moscow", country: "RU" },
  { city: "Dubai", timezone: "Asia/Dubai", country: "AE" },
  { city: "Riyadh", timezone: "Asia/Riyadh", country: "SA" },
  { city: "Mumbai", timezone: "Asia/Kolkata", country: "IN" },
  { city: "Delhi", timezone: "Asia/Kolkata", country: "IN" },
  { city: "Kolkata", timezone: "Asia/Kolkata", country: "IN" },
  { city: "Dhaka", timezone: "Asia/Dhaka", country: "BD" },
  { city: "Bangkok", timezone: "Asia/Bangkok", country: "TH" },
  { city: "Singapore", timezone: "Asia/Singapore", country: "SG" },
  { city: "Kuala Lumpur", timezone: "Asia/Kuala_Lumpur", country: "MY" },
  { city: "Jakarta", timezone: "Asia/Jakarta", country: "ID" },
  { city: "Hong Kong", timezone: "Asia/Hong_Kong", country: "HK" },
  { city: "Shanghai", timezone: "Asia/Shanghai", country: "CN" },
  { city: "Beijing", timezone: "Asia/Shanghai", country: "CN" },
  { city: "Taipei", timezone: "Asia/Taipei", country: "TW" },
  { city: "Seoul", timezone: "Asia/Seoul", country: "KR" },
  { city: "Tokyo", timezone: "Asia/Tokyo", country: "JP" },
  { city: "Sydney", timezone: "Australia/Sydney", country: "AU" },
  { city: "Melbourne", timezone: "Australia/Melbourne", country: "AU" },
  { city: "Brisbane", timezone: "Australia/Brisbane", country: "AU" },
  { city: "Perth", timezone: "Australia/Perth", country: "AU" },
  { city: "Auckland", timezone: "Pacific/Auckland", country: "NZ" },
  { city: "Cairo", timezone: "Africa/Cairo", country: "EG" },
  { city: "Lagos", timezone: "Africa/Lagos", country: "NG" },
  { city: "Johannesburg", timezone: "Africa/Johannesburg", country: "ZA" },
  { city: "Nairobi", timezone: "Africa/Nairobi", country: "KE" },
  { city: "Casablanca", timezone: "Africa/Casablanca", country: "MA" },
];

export const DEFAULT_CITIES = ["New York", "London", "Tokyo", "Sydney", "Los Angeles"];

export function getTimeInTimezone(timezone: string, date: Date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export function getDateInTimezone(timezone: string, date: Date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function getHourInTimezone(timezone: string, date: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  }).formatToParts(date);
  const hourPart = parts.find(p => p.type === "hour");
  return parseInt(hourPart?.value || "0", 10);
}

export function isDaytime(timezone: string, date: Date = new Date()): boolean {
  const hour = getHourInTimezone(timezone, date);
  return hour >= 6 && hour < 18;
}

export function getTimeParts(timezone: string, date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(date);

  const h = parseInt(parts.find(p => p.type === "hour")?.value || "0", 10);
  const m = parseInt(parts.find(p => p.type === "minute")?.value || "0", 10);
  const s = parseInt(parts.find(p => p.type === "second")?.value || "0", 10);
  return { h, m, s };
}

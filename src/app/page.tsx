"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Globe,
  Search,
  Plus,
  Trash2,
  ArrowRightLeft,
  Sun,
  Moon,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnalogClock } from "@/components/AnalogClock";
import {
  CITIES,
  DEFAULT_CITIES,
  getTimeInTimezone,
  getDateInTimezone,
  isDaytime,
  getTimeParts,
  getHourInTimezone,
  type CityTimezone,
} from "@/lib/timezones";

const STORAGE_KEY = "chronosync-cities";
const TABS = ["Clocks", "Converter", "Meeting Planner"] as const;
type Tab = (typeof TABS)[number];

function loadCities(): string[] {
  if (typeof window === "undefined") return DEFAULT_CITIES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_CITIES;
}

function saveCities(cities: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}

// ─── Clock Card ────────────────────────────────────────────
function ClockCard({
  city,
  onRemove,
}: {
  city: CityTimezone;
  onRemove: () => void;
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = getTimeInTimezone(city.timezone, now);
  const date = getDateInTimezone(city.timezone, now);
  const daytime = isDaytime(city.timezone, now);
  const { h, m, s } = getTimeParts(city.timezone, now);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors relative group">
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-zinc-800"
          aria-label="Remove city"
        >
          <Trash2 className="w-4 h-4 text-zinc-500 hover:text-red-400" />
        </button>
        <CardContent className="flex flex-col items-center gap-3 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-zinc-500" />
            <span className="font-semibold text-zinc-200">{city.city}</span>
            {daytime ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </div>
          <AnalogClock hours={h} minutes={m} seconds={s} size={110} />
          <div className="text-2xl font-mono text-zinc-100 tracking-wider">
            {time}
          </div>
          <div className="text-sm text-zinc-500">{date}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── City Search / Add ─────────────────────────────────────
function CitySearch({
  selectedCities,
  onAdd,
}: {
  selectedCities: string[];
  onAdd: (city: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = CITIES.filter(
    (c) =>
      !selectedCities.includes(c.city) &&
      c.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-sm mx-auto mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search cities..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-600"
        />
      </div>
      {open && query && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-3 text-sm text-zinc-500">No cities found</div>
          ) : (
            filtered.slice(0, 10).map((c) => (
              <button
                key={c.city}
                onClick={() => {
                  onAdd(c.city);
                  setQuery("");
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-zinc-300 text-sm flex items-center gap-2"
              >
                <Plus className="w-3 h-3 text-zinc-500" />
                {c.city}
                <span className="text-zinc-600 ml-auto">{c.country}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Clocks Tab ────────────────────────────────────────────
function ClocksTab() {
  const [selectedCities, setSelectedCities] = useState<string[]>(loadCities);

  useEffect(() => {
    saveCities(selectedCities);
  }, [selectedCities]);

  const addCity = (city: string) => {
    if (!selectedCities.includes(city)) {
      setSelectedCities((prev) => [...prev, city]);
    }
  };

  const removeCity = (city: string) => {
    setSelectedCities((prev) => prev.filter((c) => c !== city));
  };

  const cityData = selectedCities
    .map((name) => CITIES.find((c) => c.city === name))
    .filter(Boolean) as CityTimezone[];

  return (
    <div>
      <CitySearch selectedCities={selectedCities} onAdd={addCity} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        <AnimatePresence mode="popLayout">
          {cityData.map((city) => (
            <ClockCard
              key={city.city}
              city={city}
              onRemove={() => removeCity(city.city)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Converter Tab ─────────────────────────────────────────
function ConverterTab() {
  const [sourceCity, setSourceCity] = useState("New York");
  const [targetCity, setTargetCity] = useState("London");
  const [inputTime, setInputTime] = useState("12:00");
  const [result, setResult] = useState("");

  const convert = useCallback(() => {
    const src = CITIES.find((c) => c.city === sourceCity);
    const tgt = CITIES.find((c) => c.city === targetCity);
    if (!src || !tgt || !inputTime) return;

    const [hours, minutes] = inputTime.split(":").map(Number);
    // Create a date in the source timezone and read it in target
    const now = new Date();
    const srcDate = new Date(
      now.toLocaleDateString("en-US", { timeZone: src.timezone }) +
        " " +
        `${hours}:${minutes}:00`
    );

    // Get UTC offset for source
    const srcOffset = getOffsetMinutes(src.timezone, srcDate);
    const tgtOffset = getOffsetMinutes(tgt.timezone, srcDate);
    const diffMinutes = tgtOffset - srcOffset;

    const totalMin = hours * 60 + minutes + diffMinutes;
    const adjMin = ((totalMin % 1440) + 1440) % 1440;
    const rH = Math.floor(adjMin / 60);
    const rM = adjMin % 60;

    setResult(
      `${rH.toString().padStart(2, "0")}:${rM.toString().padStart(2, "0")}`
    );
  }, [sourceCity, targetCity, inputTime]);

  useEffect(() => {
    convert();
  }, [convert]);

  const swap = () => {
    setSourceCity(targetCity);
    setTargetCity(sourceCity);
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="space-y-6 pt-6">
          {/* Source */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">From</label>
            <select
              value={sourceCity}
              onChange={(e) => setSourceCity(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-zinc-200 text-sm"
            >
              {CITIES.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
          </div>

          {/* Time input */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Time</label>
            <Input
              type="time"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-200"
            />
          </div>

          {/* Swap */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={swap}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* Target */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">To</label>
            <select
              value={targetCity}
              onChange={(e) => setTargetCity(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-zinc-200 text-sm"
            >
              {CITIES.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
          </div>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-4 bg-zinc-800 rounded-lg"
            >
              <div className="text-sm text-zinc-400 mb-1">Converted Time</div>
              <div className="text-4xl font-mono text-zinc-100">{result}</div>
              <div className="text-sm text-zinc-500 mt-1">{targetCity}</div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getOffsetMinutes(timezone: string, date: Date): number {
  const utcStr = date.toLocaleString("en-US", { timeZone: "UTC" });
  const tzStr = date.toLocaleString("en-US", { timeZone: timezone });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
}

// ─── Meeting Planner Tab ───────────────────────────────────
function MeetingPlannerTab() {
  const [selectedCities, setSelectedCities] = useState<string[]>([
    "New York",
    "London",
    "Tokyo",
  ]);
  const [query, setQuery] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const addCity = (city: string) => {
    if (!selectedCities.includes(city)) {
      setSelectedCities((prev) => [...prev, city]);
    }
    setQuery("");
  };

  const removeCity = (city: string) => {
    setSelectedCities((prev) => prev.filter((c) => c !== city));
  };

  const filtered = CITIES.filter(
    (c) =>
      !selectedCities.includes(c.city) &&
      c.city.toLowerCase().includes(query.toLowerCase())
  );

  // Calculate business hour overlap
  const cityOffsets = selectedCities
    .map((name) => {
      const city = CITIES.find((c) => c.city === name);
      if (!city) return null;
      return { name, timezone: city.timezone };
    })
    .filter(Boolean) as { name: string; timezone: string }[];

  // For each hour (0-23), determine if it's business hours (9-17) in each timezone
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Find overlap: hours where ALL selected cities are in business hours
  const overlapHours = new Set<number>();
  if (cityOffsets.length > 0) {
    hours.forEach((displayHour) => {
      const allBusiness = cityOffsets.every((c) => {
        // What hour is it in this timezone when the first timezone shows displayHour?
        const refTz = cityOffsets[0].timezone;
        const refOffset = getOffsetMinutes(refTz, now);
        const cityOffset = getOffsetMinutes(c.timezone, now);
        const diff = cityOffset - refOffset;
        const cityHour = ((displayHour + diff / 60) % 24 + 24) % 24;
        return cityHour >= 9 && cityHour < 17;
      });
      if (allBusiness) overlapHours.add(displayHour);
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Add cities */}
      <div className="relative w-full max-w-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Add timezone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-600"
          />
        </div>
        {query && (
          <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-h-48 overflow-y-auto">
            {filtered.slice(0, 8).map((c) => (
              <button
                key={c.city}
                onClick={() => addCity(c.city)}
                className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-zinc-300 text-sm"
              >
                {c.city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="space-y-3">
        {/* Hour labels */}
        <div className="flex items-center">
          <div className="w-28 shrink-0" />
          <div className="flex-1 flex">
            {hours.map((h) => (
              <div
                key={h}
                className="flex-1 text-center text-[10px] text-zinc-600"
              >
                {h % 3 === 0 ? `${h}` : ""}
              </div>
            ))}
          </div>
        </div>

        {cityOffsets.map((city) => {
          const currentHour = getHourInTimezone(city.timezone, now);

          return (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-28 shrink-0 flex items-center justify-between">
                <span className="text-sm text-zinc-300 truncate">
                  {city.name}
                </span>
                <button
                  onClick={() => removeCity(city.name)}
                  className="p-0.5 hover:bg-zinc-800 rounded"
                >
                  <Trash2 className="w-3 h-3 text-zinc-600 hover:text-red-400" />
                </button>
              </div>
              <div className="flex-1 flex h-8 rounded overflow-hidden">
                {hours.map((displayHour) => {
                  const refTz = cityOffsets[0].timezone;
                  const refOffset = getOffsetMinutes(refTz, now);
                  const cityOffset = getOffsetMinutes(city.timezone, now);
                  const diff = cityOffset - refOffset;
                  const cityHour =
                    ((displayHour + diff / 60) % 24 + 24) % 24;
                  const isBusiness = cityHour >= 9 && cityHour < 17;
                  const isOverlap = overlapHours.has(displayHour);
                  const isCurrent = Math.floor(cityHour) === currentHour;

                  return (
                    <div
                      key={displayHour}
                      className={`flex-1 border-r border-zinc-950 relative ${
                        isOverlap && isBusiness
                          ? "bg-emerald-600/40"
                          : isBusiness
                          ? "bg-indigo-600/30"
                          : "bg-zinc-800/50"
                      }`}
                      title={`${city.name}: ${Math.floor(cityHour)}:00`}
                    >
                      {isCurrent && (
                        <div className="absolute inset-0 border-2 border-amber-400 rounded-sm" />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Legend */}
        <div className="flex gap-4 mt-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-indigo-600/30" />
            <span>Business hours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-600/40" />
            <span>Overlap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border-2 border-amber-400" />
            <span>Now</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Clocks");

  const tabIcons: Record<Tab, React.ReactNode> = {
    Clocks: <Clock className="w-4 h-4" />,
    Converter: <ArrowRightLeft className="w-4 h-4" />,
    "Meeting Planner": <Globe className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <Globe className="w-6 h-6 text-indigo-400" />
          <h1 className="text-xl font-bold text-zinc-100">ChronoSync</h1>
        </div>
      </header>

      {/* Tabs */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-indigo-400 text-indigo-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tabIcons[tab]}
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Clocks" && <ClocksTab />}
            {activeTab === "Converter" && <ConverterTab />}
            {activeTab === "Meeting Planner" && <MeetingPlannerTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

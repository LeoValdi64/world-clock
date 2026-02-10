"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Sun, Moon, MapPin } from "lucide-react";
import { AnalogClock } from "./AnalogClock";
import { CityTimezone, getTimeInTimezone, getDateInTimezone, getTimeParts, isDaytime } from "@/lib/timezones";

interface ClockCardProps {
  city: CityTimezone;
  now: Date;
  onRemove: () => void;
}

export function ClockCard({ city, now, onRemove }: ClockCardProps) {
  const time = getTimeInTimezone(city.timezone, now);
  const date = getDateInTimezone(city.timezone, now);
  const { h, m, s } = getTimeParts(city.timezone, now);
  const isDay = isDaytime(city.timezone, now);

  return (
    <Card className="bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 transition-colors group relative">
      <CardContent className="p-5 flex flex-col items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 text-zinc-500 hover:text-red-400"
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
        
        <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
          <MapPin className="h-3 w-3" />
          <span>{city.country}</span>
          {isDay ? (
            <Sun className="h-3 w-3 text-amber-400 ml-1" />
          ) : (
            <Moon className="h-3 w-3 text-blue-400 ml-1" />
          )}
        </div>

        <AnalogClock hours={h} minutes={m} seconds={s} size={100} />

        <div className="text-center">
          <h3 className="font-semibold text-zinc-100 text-sm">{city.city}</h3>
          <p className="text-2xl font-mono font-bold text-zinc-50 tracking-wider">{time}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{date}</p>
        </div>
      </CardContent>
    </Card>
  );
}

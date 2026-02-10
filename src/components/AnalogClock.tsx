"use client";

interface AnalogClockProps {
  hours: number;
  minutes: number;
  seconds: number;
  size?: number;
}

export function AnalogClock({ hours, minutes, seconds, size = 120 }: AnalogClockProps) {
  const center = size / 2;
  const r = size / 2 - 4;

  const secAngle = (seconds / 60) * 360 - 90;
  const minAngle = ((minutes + seconds / 60) / 60) * 360 - 90;
  const hrAngle = (((hours % 12) + minutes / 60) / 12) * 360 - 90;

  const hand = (angle: number, length: number, width: number, color: string) => {
    const rad = (angle * Math.PI) / 180;
    const x2 = center + length * Math.cos(rad);
    const y2 = center + length * Math.sin(rad);
    return (
      <line
        x1={center}
        y1={center}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    );
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Face */}
      <circle cx={center} cy={center} r={r} fill="none" stroke="rgb(63 63 70)" strokeWidth={2} />
      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = center + (r - 8) * Math.cos(angle);
        const y1 = center + (r - 8) * Math.sin(angle);
        const x2 = center + (r - 2) * Math.cos(angle);
        const y2 = center + (r - 2) * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgb(161 161 170)"
            strokeWidth={i % 3 === 0 ? 2 : 1}
          />
        );
      })}
      {/* Hands */}
      {hand(hrAngle, r * 0.5, 3, "rgb(244 244 245)")}
      {hand(minAngle, r * 0.7, 2, "rgb(161 161 170)")}
      {hand(secAngle, r * 0.8, 1, "rgb(99 102 241)")}
      {/* Center dot */}
      <circle cx={center} cy={center} r={3} fill="rgb(99 102 241)" />
    </svg>
  );
}

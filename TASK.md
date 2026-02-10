# Build ChronoSync - World Clock & Timezone Converter

## Setup First
1. Run: npx shadcn@latest init (accept defaults, zinc theme, dark mode)
2. Run: npx shadcn@latest add card button input dialog select
3. Run: npm install framer-motion

## App Requirements
- App name: "ChronoSync"
- Dark theme, zinc-950 base background
- Use Lucide React icons ONLY (Clock, Globe, Search, Plus, Trash2, ArrowRightLeft, Sun, Moon, MapPin) - NO EMOJIS anywhere in the UI
- Framer Motion for animations
- All client-side, no API calls
- Use Intl.DateTimeFormat for timezone handling
- LocalStorage for persistence
- Mobile-first responsive design

## Features

### 1. Live Clocks Dashboard
- Grid of timezone cards
- Each card shows: city name, analog SVG clock, digital time (HH:MM:SS), date, day/night icon (Sun/Moon from Lucide)
- Clocks update every second via setInterval
- Default cities: New York, London, Tokyo, Sydney, Los Angeles

### 2. Add/Remove Cities
- Search input to filter from 50+ major world cities
- Click to add city card to dashboard
- Trash icon on each card to remove
- Persist selections in localStorage

### 3. Timezone Converter
- Two timezone selectors (source and target)
- Time input field
- Converts and displays result
- Swap button with ArrowRightLeft icon

### 4. Meeting Planner
- Select multiple timezones
- Visual horizontal bar chart showing business hours (9am-5pm) for each timezone
- Highlight overlapping hours in green
- Shows current time marker

## UI Structure
- Header: "ChronoSync" with Globe icon
- Tab navigation: Clocks | Converter | Meeting Planner
- Clean, minimal, professional design

## When Done
- Run: npm run build
- Run: git add -A && git commit -m "feat: build ChronoSync world clock app"  
- Run: git push origin main

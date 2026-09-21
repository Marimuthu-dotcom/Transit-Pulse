// TransitPulse Mock Data & System Definitions

export const initialUser = {
  id: "usr_alex_01",
  name: "Alex Johnson",
  nickname: "Alex Mercer",
  email: "alex.johnson@transitpulse.io",
  phone: "+1 (555) 382-9021",
  tier: "Premium Lifetime Rider",
  memberSince: "June 2023",
  savedCorridorsCount: 4,
  avgDailyCommute: "48 mins",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  preferences: {
    stationSearchRadius: "500 meters",
    preferredMaxCrowdIndex: "Medium (< 50% capacity)",
    urgentServiceDisruptions: true,
    minorCorridorDelayAdvisories: true,
    platformProximityWarnings: false,
  },
  stats: {
    monthlyTrips: 42,
    totalDistanceKm: 184.5,
    avgCommuteMins: 26.4,
    mostActiveRoute: "Bus 42A",
    crowdReportsSubmitted: 42,
    streakDays: 5,
    ridersHelpedToday: 234,
  }
};

export const popularCorridors = [
  {
    id: "corridor-42a",
    busLine: "BUS 42A",
    badgeType: "dark",
    frequency: "Every 6 mins",
    origin: "Downtown Central",
    destination: "International Airport",
    nextBusIn: "4m",
    crowdLevel: "Low Crowd",
    crowdStatus: "low",
  },
  {
    id: "corridor-101",
    busLine: "BUS 101",
    badgeType: "dark",
    frequency: "Every 15 mins",
    origin: "Thoothukudi Old Bus Stand",
    destination: "Tirunelveli New Bus Stand",
    nextBusIn: "7m",
    crowdLevel: "Moderate Crowd (38%)",
    crowdStatus: "medium",
  },
  {
    id: "corridor-10b",
    busLine: "BUS 10B",
    badgeType: "yellow",
    frequency: "Every 10 mins",
    origin: "North Station",
    destination: "State University",
    nextBusIn: "8m",
    crowdLevel: "Medium Crowd",
    crowdStatus: "medium",
  },
  {
    id: "corridor-exp4",
    busLine: "EXPRESS 4",
    badgeType: "white",
    frequency: "Every 15 mins",
    origin: "Westside Suburb",
    destination: "Business Tech District",
    nextBusIn: "14m",
    crowdLevel: "High Crowd",
    crowdStatus: "high",
  },
  {
    id: "corridor-108",
    busLine: "BUS 108",
    badgeType: "yellow",
    frequency: "Every 45 mins",
    origin: "Thoothukudi Junction",
    destination: "Tirunelveli New Bus Stand",
    nextBusIn: "35m",
    crowdLevel: "Scheduled (Est)",
    crowdStatus: "low",
  },
  {
    id: "corridor-metro",
    busLine: "RETRO LINK",
    badgeType: "metro",
    frequency: "Every 8 mins",
    origin: "Central Junction",
    destination: "Medical City complex",
    nextBusIn: "2m",
    crowdLevel: "Low Crowd",
    crowdStatus: "low",
  }
];

export const searchHubs = [
  {
    id: "hub-airport",
    name: "Intl Airport",
    routesActive: "3 routes active",
    color: "yellow",
    icon: "plane",
  },
  {
    id: "hub-university",
    name: "University Hub",
    routesActive: "2 routes active",
    color: "green",
    icon: "graduation-cap",
  },
  {
    id: "hub-tech",
    name: "Tech District",
    routesActive: "5 routes active",
    color: "amber",
    icon: "building",
  },
  {
    id: "hub-central",
    name: "Central Plaza",
    routesActive: "6 routes active",
    color: "red",
    icon: "landmark",
  }
];

export const recentSearches = [
  {
    id: "rs-1",
    origin: "Downtown Central",
    destination: "Airport Terminal 1",
    busLine: "Bus 42A"
  },
  {
    id: "rs-2",
    origin: "North Station",
    destination: "State University campus",
    busLine: "Bus 10B"
  }
];

export const busVehicles = {
  "42A": {
    vehicleId: "42A",
    name: "Bus 42A Express",
    routeType: "Express",
    corridorName: "Green Route Corridor",
    driverName: "Robert Vance",
    driverId: "#4204",
    speed: 44,
    speedUnit: "km/h",
    status: "LIVE IN-TRANSIT",
    badge: "LIVE POSITION",
    badgeColor: "green",
    isLiveConfirmed: true,
    currentLocation: "Passing 4th Avenue Block",
    geoPosition: { lat: 37.7785, lng: -122.4172 },
    etaCountdown: "In 8 mins",
    etaNextStop: "In 3 mins",
    crowdLevel: "Low (15% capacity)",
    crowdPercent: 12,
    crowdCategory: "low",
    journeySpan: "24m • 8 stops",
    journeyDuration: "24 mins",
    activeStopsCount: 8,
    fare: "$2.75",
    journeyProgressPercent: 65,
    isRecommended: true,
    recommendationReason: "Bus 42A departs in 8 mins from Platform 4, it has the lowest crowd index (12%) and hits zero transit bottlenecks.",
    stops: [
      { name: "Downtown Central Hub", time: "Passed", status: "passed", etaMinutes: 0, lat: 37.7833, lng: -122.4167 },
      { name: "4th Avenue Boulevard", time: "3 mins", status: "active", etaMinutes: 3, lat: 37.7785, lng: -122.4172 },
      { name: "Airport Business Park", time: "12 mins", status: "upcoming", etaMinutes: 12, lat: 37.7400, lng: -122.4000 },
      { name: "Airport Terminal 1", time: "24 mins", status: "upcoming", etaMinutes: 24, lat: 37.6213, lng: -122.3790 }
    ],
    coordinates: { x: 380, y: 470 },
  },
  "10B": {
    vehicleId: "10B",
    name: "Bus 10B Direct",
    routeType: "Standard Direct Path",
    corridorName: "Standard Direct Path",
    driverName: "Elena Rostova",
    driverId: "#1088",
    speed: 32,
    speedUnit: "km/h",
    status: "MINOR DELAY",
    badge: "MINOR DELAY",
    badgeColor: "amber",
    isLiveConfirmed: true,
    currentLocation: "Held at Junction 8",
    geoPosition: { lat: 37.7925, lng: -122.4042 },
    etaCountdown: "In 14 mins",
    etaNextStop: "In 6 mins",
    crowdLevel: "Moderate (48%)",
    crowdPercent: 48,
    crowdCategory: "medium",
    journeySpan: "29m • 11 stops",
    journeyDuration: "29 mins",
    activeStopsCount: 11,
    fare: "$2.75",
    journeyProgressPercent: 40,
    isRecommended: false,
    stops: [
      { name: "North Station", time: "Passed", status: "passed", etaMinutes: 0, lat: 37.7950, lng: -122.4020 },
      { name: "Held at Junction 8", time: "6 mins", status: "active", etaMinutes: 6, lat: 37.7925, lng: -122.4042 },
      { name: "Civic Library", time: "16 mins", status: "upcoming", etaMinutes: 16, lat: 37.7800, lng: -122.4120 },
      { name: "State University campus", time: "29 mins", status: "upcoming", etaMinutes: 29, lat: 37.7650, lng: -122.4200 }
    ],
    coordinates: { x: 520, y: 310 },
  },
  "EXP4": {
    vehicleId: "EXP4",
    name: "Express 4 Shuttle",
    routeType: "Suburban Shuttle Corridor",
    corridorName: "Suburban Shuttle Corridor",
    driverName: "Marcus Brody",
    driverId: "#8831",
    speed: 52,
    speedUnit: "km/h",
    status: "CROWD WARNING",
    badge: "CROWD WARNING",
    badgeColor: "red",
    isLiveConfirmed: true,
    currentLocation: "Metro Toll Gate Gate A",
    geoPosition: { lat: 37.7640, lng: -122.3920 },
    etaCountdown: "In 21 mins",
    etaNextStop: "In 9 mins",
    crowdLevel: "Very High (82%)",
    crowdPercent: 82,
    crowdCategory: "high",
    journeySpan: "32m • 6 stops",
    journeyDuration: "32 mins",
    activeStopsCount: 6,
    fare: "$4.00",
    journeyProgressPercent: 25,
    isRecommended: false,
    stops: [
      { name: "Westside Terminal", time: "Passed", status: "passed", etaMinutes: 0, lat: 37.7600, lng: -122.4300 },
      { name: "Metro Toll Gate Gate A", time: "9 mins", status: "active", etaMinutes: 9, lat: 37.7640, lng: -122.3920 },
      { name: "Tech District Terminal A", time: "18 mins", status: "upcoming", etaMinutes: 18, lat: 37.7700, lng: -122.3900 },
      { name: "Business Tech District", time: "32 mins", status: "upcoming", etaMinutes: 32, lat: 37.7850, lng: -122.3950 }
    ],
    coordinates: { x: 260, y: 220 },
  },
  "101": {
    vehicleId: "101",
    name: "Bus 101 Superfast Express",
    routeType: "Intercity Highway Express",
    corridorName: "Thoothukudi - Tirunelveli Expressway",
    driverName: "Murugan Selvam",
    driverId: "#TN-6912",
    speed: 56,
    speedUnit: "km/h",
    status: "LIVE IN-TRANSIT (GPS VERIFIED)",
    badge: "CONFIRMED GPS",
    badgeColor: "green",
    isLiveConfirmed: true,
    currentLocation: "Passing Seithunganallur Flyover (NH138)",
    geoPosition: { lat: 8.6890, lng: 77.8285 },
    origin: "Thoothukudi Old Bus Stand",
    destination: "Tirunelveli New Bus Stand",
    etaCountdown: "In 22 mins to Tirunelveli",
    etaNextStop: "In 8 mins (Palayamkottai)",
    crowdLevel: "Moderate (38% capacity)",
    crowdPercent: 38,
    crowdCategory: "medium",
    journeySpan: "52m • 6 stops",
    journeyDuration: "52 mins",
    activeStopsCount: 6,
    fare: "₹38.00",
    journeyProgressPercent: 60,
    isRecommended: true,
    recommendationReason: "Bus 101 is actively broadcasting confirmed live GPS telemetry. Running on-time with 38% comfortable seat occupancy and no bottlenecks on NH138.",
    stops: [
      { name: "Thoothukudi Old Bus Stand", time: "Passed (10:15 AM)", status: "passed", etaMinutes: 0, lat: 8.8053, lng: 78.1460 },
      { name: "Pudukkottai Junction", time: "Passed (10:32 AM)", status: "passed", etaMinutes: 0, lat: 8.7562, lng: 78.0435 },
      { name: "Vagaikulam Toll Gate", time: "Passed (10:44 AM)", status: "passed", etaMinutes: 0, lat: 8.7302, lng: 77.9421 },
      { name: "Seithunganallur Flyover", time: "Current GPS (10:54 AM)", status: "active", etaMinutes: 2, lat: 8.6890, lng: 77.8285 },
      { name: "Palayamkottai Bus Terminal", time: "11:04 AM", status: "upcoming", etaMinutes: 10, lat: 8.7180, lng: 77.7420 },
      { name: "Tirunelveli New Bus Stand", time: "11:16 AM", status: "upcoming", etaMinutes: 22, lat: 8.7065, lng: 77.7282 }
    ],
    coordinates: { x: 420, y: 360 },
  },
  "108": {
    vehicleId: "108",
    name: "Bus 108 Deluxe Non-Stop",
    routeType: "Direct Highway Shuttle",
    corridorName: "Thoothukudi - Tirunelveli Direct",
    driverName: "Senthil Nathan",
    driverId: "#TN-7201",
    speed: 0,
    speedUnit: "km/h",
    status: "SCHEDULED (NO LIVE GPS TELEMETRY)",
    badge: "ESTIMATED SCHEDULE",
    badgeColor: "amber",
    isLiveConfirmed: false,
    currentLocation: "Thoothukudi Bus Stand Bay 4 (Scheduled)",
    geoPosition: { lat: 8.8053, lng: 78.1460 },
    origin: "Thoothukudi Bus Stand",
    destination: "Tirunelveli New Bus Stand",
    etaCountdown: "Departs in 35 mins (11:30 AM)",
    etaNextStop: "Non-stop directly to Tirunelveli",
    crowdLevel: "Estimated Normal (Timetable)",
    crowdPercent: 20,
    crowdCategory: "low",
    journeySpan: "45m • Non-stop",
    journeyDuration: "45 mins",
    activeStopsCount: 2,
    fare: "₹50.00",
    journeyProgressPercent: 0,
    isRecommended: false,
    recommendationReason: "Scheduled departure from published timetable. Live GPS transponder is currently not transmitting.",
    stops: [
      { name: "Thoothukudi Old Bus Stand", time: "Departs 11:30 AM", status: "active", etaMinutes: 35, lat: 8.8053, lng: 78.1460 },
      { name: "Tirunelveli New Bus Stand", time: "Arrives 12:15 PM", status: "upcoming", etaMinutes: 80, lat: 8.7065, lng: 77.7282 }
    ],
    coordinates: { x: 180, y: 220 },
  },
  "77": {
    vehicleId: "77",
    name: "Bus 77 Regional Feeder",
    routeType: "Local Feeder Transit",
    corridorName: "Rural Ring Road",
    driverName: "K. Rajendran",
    driverId: "#TN-4019",
    speed: 0,
    speedUnit: "km/h",
    status: "OFFLINE / NO RECENT GPS SIGNAL",
    badge: "TELEMETRY OFFLINE",
    badgeColor: "gray",
    isLiveConfirmed: false,
    currentLocation: "Last reported at Suburb Depot (48m ago) — Location Unconfirmed",
    geoPosition: { lat: 8.7600, lng: 77.8900 },
    origin: "East Gate",
    destination: "Hillside Junction",
    etaCountdown: "Signal lost — Cannot confirm ETA",
    etaNextStop: "Unavailable",
    crowdLevel: "Unavailable (No sensor telemetry)",
    crowdPercent: 0,
    crowdCategory: "unknown",
    journeySpan: "38m • 9 stops",
    journeyDuration: "38 mins",
    activeStopsCount: 9,
    fare: "₹18.00",
    journeyProgressPercent: 10,
    isRecommended: false,
    recommendationReason: "This bus has no recent GPS update. Its current location cannot be verified. We recommend Bus 101 or Bus 42A instead.",
    stops: [
      { name: "East Gate Depot", time: "Passed (48m ago)", status: "passed", etaMinutes: 0, lat: 8.7600, lng: 77.8900 },
      { name: "Hillside Junction", time: "Status Unknown", status: "upcoming", etaMinutes: 30, lat: 8.7200, lng: 77.8400 }
    ],
    coordinates: { x: 300, y: 190 },
  }
};

export const initialSavedRoutes = [
  {
    id: "sr-1",
    busLine: "BUS 42A",
    title: "Morning Commute — Downtown to Office Hub",
    origin: "Downtown Central Station",
    destination: "Airport T1",
    typicalRide: "24 mins",
    frequency: "5x / week",
    nextEta: "In 8 mins",
    crowdIndex: "Low (15%)",
    crowdStatus: "low",
    alertMessage: "Service running smoothly. No bottlenecks detected.",
    alertType: "success",
    vehicleId: "42A"
  },
  {
    id: "sr-2",
    busLine: "EXPRESS 4",
    title: "Evening Route — Tech District Gym Center",
    origin: "Downtown Central Station",
    destination: "Tech Plaza",
    typicalRide: "15 mins",
    frequency: "3x / week",
    nextEta: "In 14 mins",
    crowdIndex: "Moderate (52%)",
    crowdStatus: "medium",
    alertMessage: "Minor construction at 10th Ave. Journey time may increase by 4 mins.",
    alertType: "warning",
    vehicleId: "EXP4"
  }
];

export const initialSavedStops = [
  {
    id: "stop-1",
    name: "Central Station - Platform B",
    stopId: "#18824",
    walkTime: "3 MIN WALK",
    distance: "240m away",
    isHighlighted: false,
    geoPosition: { lat: 37.7833, lng: -122.4167 },
    lines: ["42A Express", "10B Direct", "EXP 4"],
    departures: [
      { line: "42A Downtown", eta: "3 mins (Low crowd)", status: "low" },
      { line: "10B Direct Way", eta: "11 mins", status: "normal" },
      { line: "EXP 4 Tech Shuttle", eta: "24 mins (Mod crowd)", status: "medium" }
    ]
  },
  {
    id: "stop-2",
    name: "North Station - Platform 3",
    stopId: "#10291",
    walkTime: "8 MIN WALK",
    distance: "650m away",
    isHighlighted: true, // Yellow border highlight in Image 8
    geoPosition: { lat: 37.7950, lng: -122.4020 },
    lines: ["METRO LNK", "10B Direct"],
    departures: [
      { line: "METRO LNK Northbound", eta: "1 min (Low crowd)", status: "low" },
      { line: "10B Direct Way", eta: "14 mins (Delayed)", status: "delayed" },
      { line: "METRO LNK Express", eta: "19 mins", status: "normal" }
    ]
  },
  {
    id: "stop-3",
    name: "Tech District Terminal A",
    stopId: "#18852",
    walkTime: "12 MIN WALK",
    distance: "980m away",
    isHighlighted: false,
    geoPosition: { lat: 37.7700, lng: -122.3900 },
    lines: ["EXPRESS 4"],
    departures: [
      { line: "EXP 4 Westbound", eta: "2 mins (82% cap)", status: "high" },
      { line: "EXP 4 Direct", eta: "17 mins", status: "normal" },
      { line: "EXP 4 Shuttle", eta: "32 mins", status: "normal" }
    ]
  },
  {
    id: "stop-4",
    name: "Thoothukudi Old Bus Stand",
    stopId: "#TN-8801",
    walkTime: "2 MIN WALK",
    distance: "150m away",
    isHighlighted: false,
    geoPosition: { lat: 8.8053, lng: 78.1460 },
    lines: ["Bus 101 Express", "Bus 108 Deluxe"],
    departures: [
      { line: "101 Superfast Express", eta: "7 mins (Confirmed GPS)", status: "low" },
      { line: "108 Deluxe Non-Stop", eta: "35 mins (Scheduled)", status: "normal" }
    ]
  },
  {
    id: "stop-5",
    name: "Tirunelveli New Bus Stand (Vaeinthaankulam)",
    stopId: "#TN-7204",
    walkTime: "Direct Hub",
    distance: "Intercity Junction",
    isHighlighted: false,
    geoPosition: { lat: 8.7065, lng: 77.7282 },
    lines: ["Bus 101", "Bus 108"],
    departures: [
      { line: "101 Inbound", eta: "Arriving 22 mins", status: "low" },
      { line: "108 Inbound", eta: "Arriving 1 hr 20m", status: "normal" }
    ]
  }
];

export const initialTripHistory = [
  {
    id: "th-1",
    date: "Sep 30, 2024",
    route: "Downtown Central → Airport Terminal 1",
    vehicleLine: "Bus 42A",
    scheduledWindow: "08:15 AM - 08:39 AM",
    duration: "24m",
    status: "On Time",
    statusType: "success",
    crowdIndex: "Low (12%)",
    farePaid: "$2.75"
  },
  {
    id: "th-2",
    date: "Sep 28, 2024",
    route: "Westside Suburb → Business District",
    vehicleLine: "Express 4",
    scheduledWindow: "05:10 PM - 05:46 PM",
    duration: "36m",
    status: "+4m Delay",
    statusType: "delay",
    crowdIndex: "High (82%)",
    farePaid: "$4.00"
  },
  {
    id: "th-3",
    date: "Sep 27, 2024",
    route: "North Station → State University",
    vehicleLine: "Bus 10B",
    scheduledWindow: "09:04 AM - 09:33 AM",
    duration: "29m",
    status: "On Time",
    statusType: "success",
    crowdIndex: "Medium (45%)",
    farePaid: "$2.75"
  },
  {
    id: "th-4",
    date: "Sep 25, 2024",
    route: "Downtown Central → Airport Terminal 1",
    vehicleLine: "Bus 42A",
    scheduledWindow: "08:16 AM - 08:39 AM",
    duration: "23m",
    status: "On Time",
    statusType: "success",
    crowdIndex: "Low (15%)",
    farePaid: "$2.75"
  }
];

export const initialNotifications = [
  {
    id: "notif-1",
    title: "Construction Advisory: Platform Closure",
    tag: "NEW",
    category: "alerts",
    borderAccent: "border-l-red-500",
    badgeColor: "bg-red-500 text-white",
    description: "Platform B building repair at Central Hub directs all Line 10B passengers to relocate to temporary Platform F.",
    timestamp: "15 mins ago",
    isRead: false,
    snoozed: false
  },
  {
    id: "notif-2",
    title: "Minor Route Corridor Delays",
    tag: null,
    category: "transit",
    borderAccent: "border-l-amber-500",
    badgeColor: "bg-amber-500 text-white",
    description: "Heavy industrial traffic layout on 4th Ave Block reports transit delays of +6 mins on Bus 42A right now.",
    timestamp: "1 hour ago",
    isRead: false,
    snoozed: false
  },
  {
    id: "notif-3",
    title: "Your Commute Vehicle is Arriving Soon",
    tag: null,
    category: "reminders",
    borderAccent: "border-l-blue-500",
    badgeColor: "bg-blue-500 text-white",
    description: "Standard direct bus line 42A is estimated to reach your saved platform block in exactly 3 minutes. Clean commute status active.",
    timestamp: "2 hours ago",
    isRead: false,
    snoozed: false
  },
  {
    id: "notif-4",
    title: "Alternate Better Commute Suggestion",
    tag: null,
    category: "transit",
    borderAccent: "border-l-teal-500",
    badgeColor: "bg-teal-500 text-white",
    description: "Save up to 8 minutes on your active morning airport route today by using direct Metro Link. Crowd status is completely green.",
    timestamp: "1 day ago",
    isRead: true,
    snoozed: false
  }
];

export const leaderboardData = [
  { rank: "1st", name: "Sarah Connors", reports: 68 },
  { rank: "2nd", name: "Liam Nees", reports: 51 },
  { rank: "4th", name: "Alex Mercer (You)", reports: 42, isCurrent: true }
];

export const userBadges = [
  {
    id: "b-1",
    title: "Pioneer Reporter",
    desc: "First 5 crowd reports submitted",
    icon: "award",
    unlocked: true,
  },
  {
    id: "b-2",
    title: "Daily Navigator",
    desc: "7-day streak reporting active",
    icon: "flame",
    unlocked: true,
  },
  {
    id: "b-3",
    title: "Airport Hero",
    desc: "Reported 10 times on Route 42A",
    icon: "plane",
    unlocked: true,
  },
  {
    id: "b-4",
    title: "Community Pillar",
    desc: "Helped over 1000 active riders",
    icon: "shield-check",
    unlocked: true,
  }
];

export const helpFaqs = [
  {
    id: "faq-1",
    question: "How accurate is the real-time GPS tracking?",
    answer: "TransitPulse utilizes dual-band telemetry and high-frequency GPS pings refresh rates of under 3 seconds per vehicle. Positional drift is held within 2 meters across all metropolitan transit corridors.",
    defaultOpen: false
  },
  {
    id: "faq-2",
    question: "What do the crowd level estimations mean?",
    answer: "We categorize passenger density into four tiers based on live crowd reporting: Green (Low, plenty of free seats), Yellow (Medium, few seats remaining), Red (High, standing room only).",
    defaultOpen: true
  },
  {
    id: "faq-3",
    question: "Can I schedule automated departure alerts?",
    answer: "Yes. In your Rider Profile & Settings or on any Saved Route, toggle Platform Proximity Warnings or set push notifications for 3 to 10 minutes prior to scheduled departure.",
    defaultOpen: false
  },
  {
    id: "faq-4",
    question: "How do I report missing schedule segments?",
    answer: "You can flag schedule anomalies through the Crowd & Route report form or tap the feedback link in the Help Center. Our dispatch operations team validates missing timetables within 2 hours.",
    defaultOpen: false
  },
  {
    id: "faq-5",
    question: "Is commuter travel history saved permanently?",
    answer: "Yes, your travel commute records are stored securely in your TransitPulse account and can be exported at any time as CSV data spreadsheets.",
    defaultOpen: false
  },
  {
    id: "faq-6",
    question: "Are student and senior discount tiers available?",
    answer: "TransitPulse supports linked transit agency concession passes. Contact your regional transit authority or upload your eligibility card in Account Settings to apply discounted fare rates.",
    defaultOpen: false
  }
];

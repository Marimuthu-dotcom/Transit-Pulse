import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
  ControlPosition,
  MapControl
} from '@vis.gl/react-google-maps';
import {
  Bus,
  Navigation,
  Radio,
  MapPin,
  Clock,
  Users,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  Compass,
  ArrowRight,
  Layers,
  ChevronRight
} from 'lucide-react';
import CrowdBadge from './CrowdBadge.jsx';

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBijDRLPBapUpGJuW9DRntiOHzO2cadgNw";

// Camera Controller helper component
function MapCameraController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !center) return;
    map.panTo(center);
    if (zoom) {
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);

  return null;
}

// Polyline Renderer using Maps core library
function RoutePolyline({ path, color = "#F5B700" }) {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');

  useEffect(() => {
    if (!map || !mapsLib || !path || path.length < 2) return;

    // Glowing outer polyline
    const outerLine = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 0.85,
      strokeWeight: 6,
      map,
      zIndex: 10,
    });

    // Inner bright core
    const innerLine = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#ffffff",
      strokeOpacity: 0.9,
      strokeWeight: 2,
      map,
      zIndex: 11,
    });

    return () => {
      outerLine.setMap(null);
      innerLine.setMap(null);
    };
  }, [map, mapsLib, path, color]);

  return null;
}

export default function TransitGoogleMap({
  buses = {},
  activeVehicleId = "42A",
  onSelectVehicle,
  stops = [],
  className = "w-full h-full min-h-[500px]",
  showControls = true,
  height = "100%",
}) {
  const [selectedBusId, setSelectedBusId] = useState(activeVehicleId);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [corridorView, setCorridorView] = useState('auto'); // 'auto', 'metro', 'intercity'
  const [mapType, setMapType] = useState('roadmap');

  const activeBus = buses[selectedBusId] || buses[activeVehicleId] || Object.values(buses)[0];

  // Synchronize internal selection with prop changes
  useEffect(() => {
    if (activeVehicleId && buses[activeVehicleId]) {
      setSelectedBusId(activeVehicleId);
    }
  }, [activeVehicleId, buses]);

  // Determine current map center
  const mapCenter = useMemo(() => {
    if (corridorView === 'intercity') {
      return { lat: 8.7500, lng: 77.9000 }; // Centered between Thoothukudi and Tirunelveli
    }
    if (corridorView === 'metro') {
      return { lat: 37.7749, lng: -122.4194 };
    }
    if (activeBus && activeBus.geoPosition) {
      return activeBus.geoPosition;
    }
    return { lat: 37.7749, lng: -122.4194 };
  }, [activeBus, corridorView]);

  const mapZoom = useMemo(() => {
    if (corridorView === 'intercity') return 10;
    if (corridorView === 'metro') return 12;
    return 13;
  }, [corridorView]);

  // Compute polyline path for active bus
  const activeRoutePath = useMemo(() => {
    if (!activeBus || !activeBus.stops) return [];
    return activeBus.stops
      .filter((s) => s.lat && s.lng)
      .map((s) => ({ lat: s.lat, lng: s.lng }));
  }, [activeBus]);

  const handleMarkerClick = useCallback(
    (bus) => {
      setSelectedBusId(bus.vehicleId);
      setActiveInfoWindow(bus);
      if (onSelectVehicle) {
        onSelectVehicle(bus.vehicleId);
      }
    },
    [onSelectVehicle]
  );

  return (
    <div className={`relative overflow-hidden bg-[#0a0d14] ${className}`} style={{ height }}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          defaultCenter={mapCenter}
          defaultZoom={mapZoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
          colorScheme="DARK"
          mapTypeId={mapType}
        >
          <MapCameraController center={mapCenter} zoom={mapZoom} />

          {/* Render Route Polyline */}
          {activeRoutePath.length >= 2 && (
            <RoutePolyline path={activeRoutePath} color="#F5B700" />
          )}

          {/* Render Transit Stops */}
          {stops.map((stop) => {
            if (!stop.geoPosition) return null;
            return (
              <AdvancedMarker
                key={`stop-${stop.id || stop.stopId}`}
                position={stop.geoPosition}
                title={stop.name}
              >
                <div className="group relative cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-[#121824] border-2 border-[#F5B700] flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0e131d]/95 backdrop-blur-md text-[11px] text-gray-200 px-2 py-1 rounded border border-gray-700 pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-xl">
                    <p className="font-semibold text-[#F5B700]">{stop.name}</p>
                    <p className="text-[10px] text-gray-400">{stop.walkTime || stop.distance}</p>
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Render Active Buses with AdvancedMarker */}
          {Object.values(buses).map((bus) => {
            if (!bus.geoPosition) return null;
            const isSelected = bus.vehicleId === selectedBusId;
            const isLive = bus.isLiveConfirmed !== false;

            return (
              <AdvancedMarker
                key={`bus-${bus.vehicleId}`}
                position={bus.geoPosition}
                title={`${bus.name} (${bus.vehicleId})`}
                onClick={() => handleMarkerClick(bus)}
                zIndex={isSelected ? 100 : 50}
              >
                <div className="relative flex flex-col items-center cursor-pointer select-none">
                  {/* Radar pulse for confirmed live GPS */}
                  {isLive && (
                    <span className="absolute -top-1 -left-1 w-10 h-10 rounded-full bg-emerald-500/25 animate-ping pointer-events-none" />
                  )}

                  {/* Vehicle Tag Badge */}
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-2xl transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#F5B700] text-black ring-4 ring-[#F5B700]/30 scale-110'
                        : isLive
                        ? 'bg-[#121824] text-white border border-emerald-500/80 hover:border-[#F5B700]'
                        : 'bg-gray-900/90 text-gray-300 border border-gray-700'
                    }`}
                  >
                    <Bus className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : isLive ? 'text-emerald-400' : 'text-gray-400'}`} />
                    <span className="font-mono tracking-tight font-extrabold">{bus.vehicleId}</span>

                    {/* Telemetry indicator dot */}
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                      title={isLive ? 'Live GPS Confirmed' : 'Scheduled / Unconfirmed'}
                    />
                  </div>

                  {/* Marker Pin Stem */}
                  <div
                    className={`w-1 h-2 -mt-0.5 ${
                      isSelected ? 'bg-[#F5B700]' : isLive ? 'bg-emerald-400' : 'bg-gray-600'
                    }`}
                  />
                  <div
                    className={`w-2 h-1 rounded-full ${
                      isSelected ? 'bg-[#F5B700]' : isLive ? 'bg-emerald-400' : 'bg-gray-600'
                    }`}
                  />
                </div>
              </AdvancedMarker>
            );
          })}

          {/* InfoWindow for Selected Bus */}
          {activeInfoWindow && activeInfoWindow.geoPosition && (
            <InfoWindow
              position={activeInfoWindow.geoPosition}
              onCloseClick={() => setActiveInfoWindow(null)}
            >
              <div className="p-1 max-w-[260px] text-gray-900">
                <div className="flex items-center justify-between gap-2 border-b border-gray-200 pb-1.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-black text-[#F5B700] text-xs font-mono font-bold px-1.5 py-0.5 rounded">
                      {activeInfoWindow.vehicleId}
                    </span>
                    <span className="text-xs font-bold text-gray-900 truncate">
                      {activeInfoWindow.name}
                    </span>
                  </div>
                  {activeInfoWindow.isLiveConfirmed ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Radio className="w-2.5 h-2.5" /> LIVE
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      SCHEDULED
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-gray-700">
                  <p className="flex items-center gap-1.5 text-[11px]">
                    <Navigation className="w-3 h-3 text-gray-500 shrink-0" />
                    <span className="truncate">{activeInfoWindow.currentLocation}</span>
                  </p>
                  <p className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Speed:</span>
                    <span className="font-mono font-semibold">{activeInfoWindow.speed} km/h</span>
                  </p>
                  <p className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Crowd Level:</span>
                    <span className="font-semibold">{activeInfoWindow.crowdLevel}</span>
                  </p>
                  <p className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Next ETA:</span>
                    <span className="font-bold text-emerald-700">{activeInfoWindow.etaCountdown}</span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (onSelectVehicle) onSelectVehicle(activeInfoWindow.vehicleId);
                  }}
                  className="mt-2.5 w-full bg-[#121824] hover:bg-black text-[#F5B700] text-xs font-bold py-1.5 px-3 rounded flex items-center justify-center gap-1 transition-colors"
                >
                  Track Route Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </InfoWindow>
          )}

          {/* Custom Map Overlay: Corridor & View Switcher */}
          {showControls && (
            <MapControl position={ControlPosition.TOP_LEFT}>
              <div className="m-3 flex flex-wrap items-center gap-1.5 bg-[#0e131d]/90 backdrop-blur-md p-1.5 rounded-xl border border-gray-800 shadow-2xl">
                <button
                  type="button"
                  onClick={() => setCorridorView('auto')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    corridorView === 'auto'
                      ? 'bg-[#F5B700] text-black'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Focus Active Bus
                </button>
                <button
                  type="button"
                  onClick={() => setCorridorView('intercity')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    corridorView === 'intercity'
                      ? 'bg-[#F5B700] text-black'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Thoothukudi ↔ Tirunelveli
                </button>
                <button
                  type="button"
                  onClick={() => setCorridorView('metro')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    corridorView === 'metro'
                      ? 'bg-[#F5B700] text-black'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Central Metro City
                </button>
              </div>
            </MapControl>
          )}

          {/* Telemetry Status Legend */}
          {showControls && (
            <MapControl position={ControlPosition.BOTTOM_LEFT}>
              <div className="m-3 bg-[#0e131d]/90 backdrop-blur-md p-2.5 rounded-xl border border-gray-800 text-[11px] space-y-1.5 shadow-2xl hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-gray-300 font-medium">Live Satellite GPS (Verified)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-gray-300 font-medium">Timetable / Scheduled Estimate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                  <span className="text-gray-400 font-medium">Telemetry Offline / No Signal</span>
                </div>
              </div>
            </MapControl>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}

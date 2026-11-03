import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from 'react-router';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNearbyNGOs } from '@/hooks/useNearbyNGOs';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, SlidersHorizontal, MapPin, List, Map as MapIcon, Shield, ExternalLink, Navigation, Phone, Globe, AlertTriangle, BadgeCheck, Building2 } from 'lucide-react';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Teal = verified Animal Lifeline resource; coral = external OSM listing.
const tealIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-teal.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const coralIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (
      center &&
      center.length === 2 &&
      typeof center[0] === 'number' &&
      typeof center[1] === 'number' &&
      isFinite(center[0]) &&
      isFinite(center[1])
    ) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

const distanceText = (entry) => entry.distanceLabel || (entry.distanceKm != null ? `${entry.distanceKm} km away` : 'Distance unavailable');

function directionsUrl(from, entry) {
  if (entry.latitude == null || entry.longitude == null) return null;
  const origin = from ? `${from[0]},${from[1]}` : '';
  return `https://www.google.com/maps/dir/?api=1${origin ? `&origin=${origin}` : ''}&destination=${entry.latitude},${entry.longitude}`;
}

function ResourceCard({ entry, isActive, onSelect, center }) {
  const isVerified = entry.source === 'animal_lifeline';
  const dir = directionsUrl(center, entry);
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(entry)}
      className={cn(
        "bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 cursor-pointer",
        isActive ? "border-teal-400 shadow-md ring-1 ring-teal-400" : "border-gray-200 hover:border-teal-200"
      )}
    >
      <div className="flex justify-between items-start gap-3 mb-2">
        <div>
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            {entry.name || 'Unnamed resource'}
            {isVerified && <Shield size={16} className="text-teal-600" fill="currentColor" aria-label="Verified" />}
          </h3>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
            <MapPin size={14} /> {[entry.city, entry.state].filter(Boolean).join(', ') || entry.address || 'Address not listed'} • {distanceText(entry)}
          </p>
        </div>
        <span className={cn(
          "shrink-0 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold",
          isVerified ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-800"
        )}>
          {isVerified ? <><BadgeCheck size={12} /> Verified</> : <><AlertTriangle size={12} /> Not registered</>}
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        {isVerified
          ? entry.registrationStatus || 'Verified on Animal Lifeline'
          : 'Not registered on Animal Lifeline — an external listing from OpenStreetMap. It cannot accept rescues through Animal Lifeline.'}
      </p>

      {entry.category && (
        <p className="text-xs font-medium text-slate-600 mb-3">{entry.category}{entry.type && entry.type !== 'external' ? ` • ${entry.type}` : ''}</p>
      )}
      {Array.isArray(entry.services) && entry.services.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {entry.services.slice(0, 4).map((service, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-slate-600 rounded-full font-medium">{service}</span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {entry.contact?.phone && (
          <a href={`tel:${entry.contact.phone}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-lg">
            <Phone size={13} /> Call
          </a>
        )}
        {entry.contact?.website && (
          <a href={entry.contact.website} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg">
            <Globe size={13} /> Website
          </a>
        )}
        {dir && (
          <a href={dir} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg">
            <Navigation size={13} /> Directions
          </a>
        )}
        {isVerified && entry.id && !String(entry.id).startsWith('osm:') && (
          <Link
            to={`/ngo/${entry.id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-lg"
          >
            View Profile <ExternalLink size={13} />
          </Link>
        )}
      </div>
    </motion.article>
  );
}

export default function NearbyNGOs() {
  const [viewMode, setViewMode] = useState('both');
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState('all'); // all | verified | external
  const [radiusKm, setRadiusKm] = useState(25);
  const [activeId, setActiveId] = useState(null);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [manualError, setManualError] = useState('');

  const { location, error: geoError, isLoading: geoLoading, requestLocation } = useGeolocation();
  // No invented centre: until the user grants location or enters one,
  // there is nothing to search around. The old code silently searched
  // around the centre of India.
  const [manualCenter, setManualCenter] = useState(null);
  const center = manualCenter || (location?.lat && location?.lng ? [location.lat, location.lng] : null);

  const { verified, nonVerified, loading, error, attribution, osmStatus } = useNearbyNGOs(center, radiusKm);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setViewMode(window.innerWidth < 1024 ? 'list' : 'both');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const applyManual = (e) => {
    e.preventDefault();
    const lat = Number(manualLat);
    const lng = Number(manualLng);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) {
      setManualError('Enter a valid latitude (-90 to 90) and longitude (-180 to 180).');
      return;
    }
    setManualError('');
    setManualCenter([lat, lng]);
  };

  const matchesSearch = (entry) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return [entry.name, entry.city, entry.state, entry.address, entry.category, ...(entry.services || [])]
      .filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
  };
  const filteredVerified = verified.filter(matchesSearch);
  const filteredExternal = nonVerified.filter(matchesSearch);
  const activeEntry = [...verified, ...nonVerified].find((e) => (e.id || e.osmId) === activeId) || null;
  const mapFocus = activeEntry?.latitude != null && activeEntry?.longitude != null
    ? [activeEntry.latitude, activeEntry.longitude] : center;
  const allWithCoords = [...filteredVerified, ...filteredExternal].filter((e) => e.latitude != null && e.longitude != null);

  const selectEntry = (entry) => {
    setActiveId(entry.id || entry.osmId);
    if (isMobile) setViewMode('map');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F5EF]">
      {isMobile && (
        <div className="flex p-4 bg-white border-b sticky top-0 z-20 shadow-sm">
          <div className="flex w-full bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setViewMode('list')} className={cn("flex-1 py-2 flex items-center justify-center gap-2 rounded-md transition-colors text-sm font-medium", viewMode === 'list' ? "bg-white shadow text-teal-700" : "text-slate-600")}>
              <List size={16} /> List View
            </button>
            <button onClick={() => setViewMode('map')} className={cn("flex-1 py-2 flex items-center justify-center gap-2 rounded-md transition-colors text-sm font-medium", viewMode === 'map' ? "bg-white shadow text-teal-700" : "text-slate-600")}>
              <MapIcon size={16} /> Map View
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        <div className={cn(
          "w-full lg:w-[42%] flex flex-col h-full bg-white border-r z-10 transition-transform duration-300",
          isMobile && viewMode === 'map' ? "hidden" : "flex"
        )}>
          <div className="p-4 border-b space-y-4">
            <h1 className="font-display text-2xl font-bold text-[#183B35]">Nearby Help</h1>
            <p className="text-sm text-slate-500">Verified Animal Lifeline resources and external listings near you — clearly separated, never mixed.</p>

            {!center && (
              <div className="rounded-xl border border-teal-100 bg-teal-50 p-4 space-y-3">
                <p className="text-sm font-semibold text-teal-800">Choose a location to find nearby help</p>
                <button onClick={requestLocation} disabled={geoLoading} className="w-full py-2.5 bg-[#087F70] text-white rounded-lg text-sm font-semibold hover:bg-[#183B35] transition-colors disabled:opacity-50">
                  {geoLoading ? 'Locating…' : 'Use my device location'}
                </button>
                {geoError && <p className="text-xs text-slate-600">{geoError}</p>}
                <form onSubmit={applyManual} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs font-medium text-slate-600">Latitude
                      <input type="number" step="any" value={manualLat} onChange={(e) => setManualLat(e.target.value)} placeholder="25.13" className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    </label>
                    <label className="text-xs font-medium text-slate-600">Longitude
                      <input type="number" step="any" value={manualLng} onChange={(e) => setManualLng(e.target.value)} placeholder="75.83" className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    </label>
                  </div>
                  {manualError && <p className="text-xs text-rose-600">{manualError}</p>}
                  <button type="submit" className="w-full py-2 bg-white border border-teal-200 text-teal-700 rounded-lg text-sm font-semibold hover:bg-teal-50">Search this location</button>
                </form>
              </div>
            )}

            {center && (
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-slate-500">Searching around {center[0].toFixed(4)}, {center[1].toFixed(4)}</p>
                <button onClick={() => setManualCenter(null)} className="text-xs font-semibold text-teal-700 hover:underline">Change location</button>
              </div>
            )}

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search resources…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} aria-label="Toggle filters" className={cn("p-2 rounded-lg border transition-colors flex items-center justify-center", showFilters ? "bg-teal-50 border-teal-200 text-teal-700" : "bg-white border-gray-200 text-slate-600 hover:bg-gray-50")}>
                <SlidersHorizontal size={20} />
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="pt-4 space-y-4 border-t mt-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700">Search radius</label>
                        <span className="text-sm text-teal-600 font-medium">{radiusKm} km</span>
                      </div>
                      <input type="range" min="5" max="100" value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} className="w-full accent-teal-600" />
                    </div>
                    <div className="flex gap-2">
                      {[
                        ['all', 'All resources'],
                        ['verified', 'Verified only'],
                        ['external', 'External only'],
                      ].map(([value, label]) => (
                        <button key={value} onClick={() => setGroupFilter(value)} className={cn("flex-1 py-2 rounded-lg text-xs font-semibold border", groupFilter === value ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-600 border-slate-200 hover:border-teal-200")}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#F7F5EF]">
            {!center ? (
              <div className="text-center p-8 text-slate-500 text-sm">Choose a location above to see nearby help.</div>
            ) : loading ? (
              <div className="flex justify-center p-8"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" role="status" aria-label="Loading nearby help" /></div>
            ) : error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}. Please try again — no organisations are shown from stored or invented data.</div>
            ) : (
              <>
                {groupFilter !== 'external' && (
                  <section aria-label="Verified resources">
                    <h2 className="flex items-center gap-2 font-semibold text-[#183B35] mb-3"><Shield size={16} className="text-teal-600" /> Verified on Animal Lifeline ({filteredVerified.length})</h2>
                    {filteredVerified.length === 0 ? (
                      <p className="text-sm text-slate-500 bg-white border rounded-xl p-4">No verified NGOs or vets found within {radiusKm} km of this location.</p>
                    ) : (
                      <div className="space-y-4">
                        {filteredVerified.map((entry) => (
                          <ResourceCard key={entry.id || entry.osmId} entry={entry} isActive={activeId === (entry.id || entry.osmId)} onSelect={selectEntry} center={center} />
                        ))}
                      </div>
                    )}
                  </section>
                )}
                {groupFilter !== 'verified' && (
                  <section aria-label="External resources">
                    <h2 className="flex items-center gap-2 font-semibold text-slate-800 mb-3"><Building2 size={16} className="text-amber-700" /> Not registered on Animal Lifeline ({filteredExternal.length})</h2>
                    <p className="text-xs text-slate-500 mb-3">External NGOs, veterinary clinics and animal shelters from OpenStreetMap. These are not verified by Animal Lifeline and cannot accept rescues through the platform.</p>
                    {osmStatus === 'unavailable' && (
                      <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">External listings are currently unavailable, so only verified resources are shown.</p>
                    )}
                    {filteredExternal.length === 0 ? (
                      <p className="text-sm text-slate-500 bg-white border rounded-xl p-4">No external listings found within {radiusKm} km of this location.</p>
                    ) : (
                      <div className="space-y-4">
                        {filteredExternal.map((entry) => (
                          <ResourceCard key={entry.id || entry.osmId} entry={entry} isActive={activeId === (entry.id || entry.osmId)} onSelect={selectEntry} center={center} />
                        ))}
                      </div>
                    )}
                  </section>
                )}
                {attribution && <p className="text-xs text-slate-400">{attribution}</p>}
              </>
            )}
          </div>
        </div>

        <div className={cn("w-full lg:w-[58%] h-full relative", isMobile && viewMode === 'list' ? "hidden" : "block")}>
          {center ? (
            <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
              <ChangeView center={mapFocus} zoom={12} />
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={center}>
                <Popup><div className="font-semibold text-slate-900">Your search location</div></Popup>
              </Marker>
              {allWithCoords.map((entry) => (
                <Marker
                  key={entry.id || entry.osmId}
                  position={[entry.latitude, entry.longitude]}
                  icon={entry.source === 'animal_lifeline' ? tealIcon : coralIcon}
                  eventHandlers={{ click: () => setActiveId(entry.id || entry.osmId) }}
                >
                  <Popup>
                    <div className="p-1 min-w-[200px]">
                      <h4 className="font-bold text-slate-900 mb-1">{entry.name}</h4>
                      <p className="text-xs text-slate-500 mb-1">{entry.source === 'animal_lifeline' ? 'Verified on Animal Lifeline' : 'Not registered on Animal Lifeline'}</p>
                      <p className="text-xs text-slate-500 mb-2">{distanceText(entry)}</p>
                      {entry.contact?.phone && <a href={`tel:${entry.contact.phone}`} className="block text-center bg-teal-600 text-white text-xs font-medium py-1.5 rounded hover:bg-teal-700">Call</a>}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-[#DDE9DF] p-8 text-center text-sm text-slate-600">
              The map appears once you choose a location, so it never points at a place you did not ask about.
            </div>
          )}
          <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
            <button onClick={() => { if (center) setActiveId(null); }} aria-label="Back to search location" className="p-3 bg-white text-slate-700 rounded-full shadow-lg border border-gray-100 hover:text-teal-600 transition-colors">
              <Navigation size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

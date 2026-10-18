import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from 'react-router';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNearbyNGOs } from '@/hooks/useNearbyNGOs';
import { useSelector, useDispatch } from 'react-redux';
import { updateFilters, resetFilters } from '@/store/slices/ngoSlice';
import { calculateDistance } from '@/lib/utils';
import { ANIMAL_TYPES, NGO_SERVICES } from '@/lib/constants';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, SlidersHorizontal, MapPin, Filter, List, Map as MapIcon, Star, Shield, ExternalLink, X, Navigation } from 'lucide-react';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom teal marker icon
const tealIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-teal.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to center map
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function NearbyNGOs() {
  const [viewMode, setViewMode] = useState('both'); // 'list', 'map', 'both'
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNgoId, setActiveNgoId] = useState(null);

  const dispatch = useDispatch();
  const filters = useSelector((state) => state.ngo?.filters) || {
    distance: 50,
    animalTypes: [],
    services: [],
    verifiedOnly: false
  };

  const { location, error: geoError, loading: geoLoading } = useGeolocation();
  const center = location ? [location.latitude, location.longitude] : [20.5937, 78.9629];
  
  const { ngos, loading, error } = useNearbyNGOs(center, filters);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setViewMode('list');
      } else {
        setViewMode('both');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFilterChange = (key, value) => {
    dispatch(updateFilters({ [key]: value }));
  };

  const toggleArrayFilter = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    handleFilterChange(key, updated);
  };

  const filteredNgos = (ngos || []).filter(ngo => 
    ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ngo.city && ngo.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 pt-16">
      {/* Mobile Toggle */}
      {isMobile && (
        <div className="flex p-4 bg-white border-b sticky top-16 z-20 shadow-sm">
          <div className="flex w-full bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={cn("flex-1 py-2 flex items-center justify-center gap-2 rounded-md transition-colors text-sm font-medium", viewMode === 'list' ? "bg-white shadow text-teal-700" : "text-slate-600")}
            >
              <List size={16} /> List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={cn("flex-1 py-2 flex items-center justify-center gap-2 rounded-md transition-colors text-sm font-medium", viewMode === 'map' ? "bg-white shadow text-teal-700" : "text-slate-600")}
            >
              <MapIcon size={16} /> Map View
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Panel - List */}
        <div className={cn(
          "w-full lg:w-[40%] flex flex-col h-full bg-white border-r z-10 transition-transform duration-300",
          isMobile && viewMode === 'map' ? "hidden" : "flex"
        )}>
          {/* Header & Search */}
          <div className="p-4 border-b space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">Nearby NGOs</h1>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search NGOs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn("p-2 rounded-lg border transition-colors flex items-center justify-center", showFilters ? "bg-teal-50 border-teal-200 text-teal-700" : "bg-white border-gray-200 text-slate-600 hover:bg-gray-50")}
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-4 border-t mt-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700">Distance</label>
                        <span className="text-sm text-teal-600 font-medium">{filters.distance} km</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={filters.distance}
                        onChange={(e) => handleFilterChange('distance', Number(e.target.value))}
                        className="w-full accent-teal-600"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="verified" 
                        checked={filters.verifiedOnly}
                        onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="verified" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Shield size={14} className="text-teal-600" /> Verified NGOs Only
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <button 
                        onClick={() => dispatch(resetFilters())}
                        className="text-xs text-rose-500 font-medium hover:underline"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
              </div>
            ) : filteredNgos.length === 0 ? (
              <div className="text-center p-8 text-slate-500">
                <p>No NGOs found nearby matching your filters.</p>
              </div>
            ) : (
              filteredNgos.map(ngo => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={ngo.id}
                  onMouseEnter={() => setActiveNgoId(ngo.id)}
                  onMouseLeave={() => setActiveNgoId(null)}
                  className={cn(
                    "bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 cursor-pointer",
                    activeNgoId === ngo.id ? "border-teal-400 shadow-md ring-1 ring-teal-400" : "border-gray-200 hover:border-teal-200"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        {ngo.name}
                        {ngo.isVerified && <Shield size={16} className="text-teal-600" fill="currentColor" />}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} /> {ngo.city} • {ngo.distance?.toFixed(1) || '?'} km away
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-md text-xs font-medium">
                      <Star size={12} fill="currentColor" /> {ngo.rating || '4.5'}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4 mt-3">
                    {ngo.services?.slice(0, 3).map((service, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 bg-gray-100 text-slate-600 rounded-full font-medium">
                        {service}
                      </span>
                    ))}
                    {ngo.services?.length > 3 && (
                      <span className="text-[10px] px-2 py-1 bg-gray-100 text-slate-600 rounded-full font-medium">
                        +{ngo.services.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <Link
                    to={`/ngo/${ngo.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors"
                  >
                    View Profile <ExternalLink size={14} />
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className={cn(
          "w-full lg:w-[60%] h-full relative",
          isMobile && viewMode === 'list' ? "hidden" : "block"
        )}>
          {!geoLoading && (
            <MapContainer 
              center={center} 
              zoom={12} 
              style={{ height: '100%', width: '100%', zIndex: 0 }}
              zoomControl={false}
            >
              <ChangeView center={center} zoom={12} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* User Location Marker */}
              {location && (
                <Marker position={[location.latitude, location.longitude]}>
                  <Popup>
                    <div className="font-semibold text-slate-900">Your Location</div>
                  </Popup>
                </Marker>
              )}

              {/* NGO Markers */}
              {filteredNgos.map(ngo => {
                if (!ngo.location?.coordinates) return null;
                const isSelected = activeNgoId === ngo.id;
                
                return (
                  <Marker
                    key={ngo.id}
                    position={[ngo.location.coordinates[1], ngo.location.coordinates[0]]}
                    icon={tealIcon}
                    eventHandlers={{
                      click: () => setActiveNgoId(ngo.id),
                    }}
                  >
                    <Popup>
                      <div className="p-1 min-w-[200px]">
                        <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                          {ngo.name} {ngo.isVerified && <Shield size={12} className="text-teal-600" />}
                        </h4>
                        <p className="text-xs text-slate-500 mb-2">{ngo.address}</p>
                        <Link
                          to={`/ngo/${ngo.id}`}
                          className="block w-full text-center bg-teal-600 text-white text-xs font-medium py-1.5 rounded hover:bg-teal-700 transition-colors"
                        >
                          View Profile
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}

          {/* Map floating controls */}
          <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
            <button 
              onClick={() => {
                if (location) {
                  // Re-center logic would go here if we had map instance ref
                }
              }}
              className="p-3 bg-white text-slate-700 rounded-full shadow-lg border border-gray-100 hover:text-teal-600 transition-colors"
            >
              <Navigation size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

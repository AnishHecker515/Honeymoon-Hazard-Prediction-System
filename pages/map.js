'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { MapPin, AlertTriangle, Info, Filter } from 'lucide-react';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Static incident data
const incidentData = [
  {
    id: 1,
    lat: 45.5762,
    lng: -122.1158,
    location: "Multnomah Falls, Oregon",
    type: "Missing Person",
    date: "2023-08-15",
    description: "Tourist reported missing during hiking trip, found safe after 3 days",
    severity: "HIGH",
    verified: true
  },
  {
    id: 2,
    lat: 36.8619,
    lng: -111.3743,
    location: "Antelope Canyon, Arizona",
    type: "Domestic Incident",
    date: "2023-06-22",
    description: "Reported domestic disturbance at tourist location",
    severity: "HIGH",
    verified: true
  },
  {
    id: 3,
    lat: 47.8021,
    lng: -123.9348,
    location: "Hoh Rainforest, Washington",
    type: "Safety Concern",
    date: "2023-07-10",
    description: "Visitor reported feeling unsafe due to isolated conditions",
    severity: "MODERATE",
    verified: false
  },
  {
    id: 4,
    lat: 36.5054,
    lng: -117.0794,
    location: "Death Valley, California",
    type: "Emergency Rescue",
    date: "2023-09-03",
    description: "Multiple rescues due to extreme conditions and poor preparation",
    severity: "HIGH",
    verified: true
  },
  {
    id: 5,
    lat: 48.7596,
    lng: -113.7870,
    location: "Glacier National Park, Montana",
    type: "Safety Incident",
    date: "2023-07-28",
    description: "Backcountry safety incident reported by park services",
    severity: "MODERATE",
    verified: true
  },
  {
    id: 6,
    lat: 36.2704,
    lng: -121.8081,
    location: "Big Sur, California",
    type: "Missing Person",
    date: "2023-05-17",
    description: "Hiker went missing on coastal trail, search ongoing",
    severity: "HIGH",
    verified: true
  },
  {
    id: 7,
    lat: 44.4280,
    lng: -110.5885,
    location: "Yellowstone National Park, Wyoming",
    type: "Safety Concern",
    date: "2023-08-01",
    description: "Tourist safety concerns reported in remote thermal areas",
    severity: "MODERATE",
    verified: true
  },
  {
    id: 8,
    lat: 36.1069,
    lng: -112.1129,
    location: "Grand Canyon, Arizona",
    type: "Emergency Rescue",
    date: "2023-06-15",
    description: "Multiple rescue operations on remote canyon trails",
    severity: "HIGH",
    verified: true
  }
];

export default function Map() {
  const [filteredIncidents, setFilteredIncidents] = useState(incidentData);
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [leafletReady, setLeafletReady] = useState(false);

  useEffect(() => {
    setMapLoaded(true);
    
    // Check if Leaflet is available and wait for it to be ready
    const checkLeaflet = () => {
      if (typeof window !== 'undefined' && window.L) {
        setLeafletReady(true);
      } else {
        setTimeout(checkLeaflet, 100);
      }
    };
    
    checkLeaflet();
  }, []);

  useEffect(() => {
    let filtered = incidentData;
    
    if (selectedSeverity !== 'ALL') {
      filtered = filtered.filter(incident => incident.severity === selectedSeverity);
    }
    
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(incident => incident.type === selectedType);
    }
    
    setFilteredIncidents(filtered);
  }, [selectedSeverity, selectedType]);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'HIGH': return '#EF4444';
      case 'MODERATE': return '#F97316';
      case 'LOW': return '#EAB308';
      default: return '#6B7280';
    }
  };

  const getIncidentTypes = () => {
    const types = new Set(incidentData.map(incident => incident.type));
    return Array.from(types);
  };

  // Custom icon creation function - only create when Leaflet is ready
  const getCustomIcon = (color) => {
    if (typeof window !== 'undefined' && window.L && leafletReady) {
      try {
        return window.L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
      } catch (error) {
        console.warn('Error creating custom icon:', error);
        return null;
      }
    }
    return null;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-indigo-100 rounded-full">
                <MapPin className="w-12 h-12 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Incident Case Map
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Interactive map showing reported safety incidents and high-risk locations
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <Filter className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Filter Incidents</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level
                </label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="ALL">All Severities</option>
                  <option value="HIGH">High Risk</option>
                  <option value="MODERATE">Moderate Risk</option>
                  <option value="LOW">Low Risk</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="ALL">All Types</option>
                  {getIncidentTypes().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredIncidents.length} of {incidentData.length} incidents
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span>High Risk</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                  <span>Moderate Risk</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Low Risk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="h-96 relative">
              {mapLoaded ? (
                <MapContainer
                  center={[39.8283, -98.5795]}
                  zoom={4}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {leafletReady && filteredIncidents.map((incident) => {
                    const customIcon = getCustomIcon(getSeverityColor(incident.severity));
                    
                    // Only render marker if we have a valid icon
                    if (customIcon) {
                      return (
                        <Marker
                          key={incident.id}
                          position={[incident.lat, incident.lng]}
                          icon={customIcon}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold text-gray-900 mb-2">
                                {incident.location}
                              </h3>
                              <div className="space-y-1 text-sm">
                                <p><strong>Type:</strong> {incident.type}</p>
                                <p><strong>Date:</strong> {incident.date}</p>
                                <p><strong>Severity:</strong> 
                                  <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                                    incident.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                                    incident.severity === 'MODERATE' ? 'bg-orange-100 text-orange-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {incident.severity}
                                  </span>
                                </p>
                                <p><strong>Verified:</strong> {incident.verified ? '✅ Yes' : '❌ No'}</p>
                                <p className="mt-2 text-gray-600">{incident.description}</p>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    }
                    return null;
                  })}
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Incident List */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Incident Details
            </h2>
            
            <div className="space-y-4">
              {filteredIncidents.map((incident) => (
                <div key={incident.id} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {incident.location}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          incident.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                          incident.severity === 'MODERATE' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {incident.severity}
                        </span>
                        {incident.verified && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Type:</span> {incident.type}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {incident.date}
                        </div>
                        <div>
                          <span className="font-medium">Coordinates:</span> {incident.lat.toFixed(4)}, {incident.lng.toFixed(4)}
                        </div>
                      </div>
                      
                      <p className="text-gray-700">{incident.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Data Disclaimer
                </h3>
                <p className="text-yellow-800 text-sm">
                  This map displays publicly reported incidents and safety concerns compiled from various sources 
                  including news reports, park services, and safety organizations. Data should be used for 
                  awareness purposes only. Always check current local conditions and official sources before traveling. 
                  Not all incidents may be represented, and this should not be considered a comprehensive safety database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
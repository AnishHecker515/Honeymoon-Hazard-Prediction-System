'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { MapPin, AlertTriangle, Shield, Loader, CheckCircle } from 'lucide-react';

// Static risk zones data
const riskZones = [
  {
    id: 1,
    name: "Multnomah Falls, Oregon",
    lat: 45.5762,
    lng: -122.1158,
    radius: 5, // km
    riskLevel: "HIGH",
    description: "Remote waterfall location with limited cell service and few witnesses",
    incidents: 3
  },
  {
    id: 2,
    name: "Antelope Canyon, Arizona",
    lat: 36.8619,
    lng: -111.3743,
    radius: 10,
    riskLevel: "HIGH",
    description: "Isolated slot canyon requiring guided tours, easy to become separated",
    incidents: 2
  },
  {
    id: 3,
    name: "Hoh Rainforest, Washington",
    lat: 47.8021,
    lng: -123.9348,
    radius: 15,
    riskLevel: "MODERATE",
    description: "Dense forest with limited visibility and cell service",
    incidents: 1
  },
  {
    id: 4,
    name: "Death Valley, California",
    lat: 36.5054,
    lng: -117.0794,
    radius: 50,
    riskLevel: "HIGH",
    description: "Extremely remote desert location with dangerous conditions",
    incidents: 4
  },
  {
    id: 5,
    name: "Glacier National Park Remote Areas, Montana",
    lat: 48.7596,
    lng: -113.7870,
    radius: 25,
    riskLevel: "MODERATE",
    description: "Backcountry areas with wildlife and limited rescue access",
    incidents: 2
  },
  {
    id: 6,
    name: "Big Sur Coastline, California",
    lat: 36.2704,
    lng: -121.8081,
    radius: 20,
    riskLevel: "MODERATE",
    description: "Rugged coastline with steep cliffs and isolated beaches",
    incidents: 3
  }
];

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function Location() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nearbyRisks, setNearbyRisks] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        
        setLocation(userLocation);
        checkNearbyRisks(userLocation);
        setLoading(false);
        setPermissionStatus('granted');
      },
      (error) => {
        setLoading(false);
        setPermissionStatus('denied');
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location services and try again.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while retrieving location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const checkNearbyRisks = (userLocation) => {
    const nearby = riskZones.filter(zone => {
      const distance = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        zone.lat, 
        zone.lng
      );
      
      return distance <= zone.radius;
    }).map(zone => ({
      ...zone,
      distance: calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        zone.lat, 
        zone.lng
      )
    }));

    setNearbyRisks(nearby.sort((a, b) => a.distance - b.distance));
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      case 'MODERATE': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'LOW': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level) => {
    switch(level) {
      case 'HIGH': return <AlertTriangle className="w-5 h-5" />;
      case 'MODERATE': return <AlertTriangle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-orange-100 rounded-full">
                <MapPin className="w-12 h-12 text-orange-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Location Risk Assessment
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Check for high-risk locations and known danger zones in your area
            </p>
          </div>

          {/* Location Access */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Check Your Current Location
              </h2>
              
              {!location && !loading && !locationError && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Allow location access to check for nearby risk zones
                  </p>
                  <button
                    onClick={getCurrentLocation}
                    className="inline-flex items-center px-8 py-4 bg-orange-600 text-white rounded-full text-lg font-medium hover:bg-orange-700 transition-colors"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Check My Location
                  </button>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center">
                  <Loader className="w-8 h-8 text-orange-600 animate-spin mb-4" />
                  <p className="text-gray-600">Getting your location...</p>
                </div>
              )}

              {locationError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
                  <p className="text-red-700 mb-4">{locationError}</p>
                  <button
                    onClick={getCurrentLocation}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {location && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-4" />
                  <p className="text-green-700 mb-2">Location detected successfully</p>
                  <p className="text-sm text-gray-600">
                    Accuracy: ±{Math.round(location.accuracy)} meters
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Risk Warnings */}
          {nearbyRisks.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">
                  ⚠️ Risk Zones Detected Nearby
                </h2>
              </div>

              <div className="space-y-4">
                {nearbyRisks.map((risk) => (
                  <div key={risk.id} className={`border rounded-xl p-6 ${getRiskColor(risk.riskLevel)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          {getRiskIcon(risk.riskLevel)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{risk.name}</h3>
                          <p className="mb-3">{risk.description}</p>
                          <div className="flex items-center text-sm space-x-4">
                            <span>Distance: {risk.distance.toFixed(1)} km</span>
                            <span>Risk Level: {risk.riskLevel}</span>
                            <span>Reported Incidents: {risk.incidents}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h4 className="font-semibold text-yellow-800 mb-2">Safety Recommendations:</h4>
                <ul className="text-yellow-700 space-y-1 text-sm">
                  <li>• Inform multiple trusted contacts of your exact location and return time</li>
                  <li>• Carry a fully charged phone and portable charger</li>
                  <li>• Share your live location with trusted contacts</li>
                  <li>• Consider postponing travel to high-risk areas</li>
                  <li>• If you must visit, go with a group and inform local authorities</li>
                </ul>
              </div>
            </div>
          )}

          {location && nearbyRisks.length === 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No High-Risk Zones Detected
                </h2>
                <p className="text-gray-600 mb-6">
                  Your current location is not near any known risk zones in our database.
                </p>
                <p className="text-sm text-gray-500">
                  Remember to always stay alert and trust your instincts, regardless of location data.
                </p>
              </div>
            </div>
          )}

          {/* All Risk Zones */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Known Risk Zones Database
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {riskZones.map((zone) => (
                <div key={zone.id} className={`border rounded-xl p-6 ${getRiskColor(zone.riskLevel)}`}>
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      {getRiskIcon(zone.riskLevel)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{zone.name}</h3>
                      <p className="mb-3">{zone.description}</p>
                      <div className="flex items-center text-sm space-x-4">
                        <span>Risk Level: {zone.riskLevel}</span>
                        <span>Incidents: {zone.incidents}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-2">About This Data:</h4>
              <p className="text-blue-800 text-sm">
                This database includes locations with reported safety concerns, limited cell service, 
                isolation factors, or historical incidents. Data is compiled from public safety reports, 
                news sources, and safety organizations. Always check current conditions and local advisories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
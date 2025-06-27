// Dashboard.js
import React, { useState, useEffect } from 'react';
import './Dashboard.css';

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet marker icon issue in React environment
const stationIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const stations = [
  // Tamil Nadu (8)
  { id: 1, name: "Chennai Central", lat: 13.0827, lon: 80.2707 },
  { id: 2, name: "Coimbatore Junction", lat: 11.0168, lon: 76.9558 },
  { id: 3, name: "Madurai Junction", lat: 9.9252, lon: 78.1198 },
  { id: 4, name: "Tiruchirappalli Junction", lat: 10.7905, lon: 78.7047 },
  { id: 5, name: "Salem Junction", lat: 11.6544, lon: 78.1460 },
  { id: 6, name: "Erode Junction", lat: 11.3410, lon: 77.7172 },
  { id: 7, name: "Tirunelveli Junction", lat: 8.7139, lon: 77.7567 },
  { id: 8, name: "Vellore Cantonment", lat: 12.9165, lon: 79.1325 },

  // Andhra Pradesh (7)
  { id: 9, name: "Vijayawada Junction", lat: 16.5062, lon: 80.6480 },
  { id: 10, name: "Visakhapatnam Junction", lat: 17.6868, lon: 83.2185 },
  { id: 11, name: "Guntur Junction", lat: 16.3067, lon: 80.4365 },
  { id: 12, name: "Tirupati", lat: 13.6288, lon: 79.4192 },
  { id: 13, name: "Kurnool City", lat: 15.8281, lon: 78.0373 },
  { id: 14, name: "Rajahmundry", lat: 16.9891, lon: 81.7718 },
  { id: 15, name: "Nellore", lat: 14.4426, lon: 79.9865 },

  // Mumbai (5)
  { id: 16, name: "Mumbai CST", lat: 18.9402, lon: 72.8356 },
  { id: 17, name: "Dadar", lat: 19.0183, lon: 72.8479 },
  { id: 18, name: "Bandra Terminus", lat: 19.0544, lon: 72.8407 },
  { id: 19, name: "Thane", lat: 19.2183, lon: 72.9781 },
  { id: 20, name: "Vasai Road", lat: 19.3915, lon: 72.8397 },

  // Bihar (5)
  { id: 21, name: "Patna Junction", lat: 25.5941, lon: 85.1376 },
  { id: 22, name: "Gaya Junction", lat: 24.7958, lon: 85.0006 },
  { id: 23, name: "Bhagalpur Junction", lat: 25.2415, lon: 86.9842 },
  { id: 24, name: "Muzaffarpur Junction", lat: 26.1209, lon: 85.3900 },
  { id: 25, name: "Darbhanga Junction", lat: 26.1545, lon: 85.8896 },

  // Kolkata (West Bengal) (3)
  { id: 26, name: "Kolkata Howrah", lat: 22.5958, lon: 88.2636 },
  { id: 27, name: "Sealdah", lat: 22.5726, lon: 88.3639 },
  { id: 28, name: "Kalyani", lat: 22.9756, lon: 88.4342 },

  // Haryana (2)
  { id: 29, name: "Gurgaon", lat: 28.4595, lon: 77.0266 },
  { id: 30, name: "Ambala Cantt", lat: 30.3782, lon: 76.7767 },

  // Delhi (5)
  { id: 31, name: "New Delhi", lat: 28.6139, lon: 77.2090 },
  { id: 32, name: "Hazrat Nizamuddin", lat: 28.5711, lon: 77.2508 },
  { id: 33, name: "Anand Vihar Terminal", lat: 28.6465, lon: 77.3157 },
  { id: 34, name: "Delhi Sarai Rohilla", lat: 28.6665, lon: 77.1740 },
  { id: 35, name: "Delhi Cantt", lat: 28.6196, lon: 77.1286 },

  // Bangalore (Karnataka) (6)
  { id: 36, name: "Bangalore City", lat: 12.9716, lon: 77.5946 },
  { id: 37, name: "Yeshvantpur", lat: 13.0101, lon: 77.5556 },
  { id: 38, name: "KSR Bengaluru Terminal", lat: 12.9507, lon: 77.5722 },
  { id: 39, name: "Mysore Junction", lat: 12.2958, lon: 76.6394 },
  { id: 40, name: "Krishnarajapuram", lat: 13.0456, lon: 77.6700 },
];


function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const Dashboard = () => {
  const [stationId, setStationId] = useState(1);
  const [forecastData, setForecastData] = useState([]);
  const [insights, setInsights] = useState({});
  const [sustainability, setSustainability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [suggestedStation, setSuggestedStation] = useState(null);
  const [congestion, setCongestion] = useState(null);
  const [reserveTime, setReserveTime] = useState('');
  const [reserveMsg, setReserveMsg] = useState('');
  const [reserving, setReserving] = useState(false);
  const [co2Saved, setCo2Saved] = useState(null);

  const API_BASE = 'https://smartchargex.onrender.com';

  const formatDate = (ts) => {
    try {
      return new Date(ts).toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return ts;
    }
  };

  const totalPredictedDemand = forecastData.reduce((sum, item) => sum + item.predicted_kwh, 0);
  const avg = forecastData.length > 0 ? (totalPredictedDemand / forecastData.length).toFixed(2) : 0;
  const max = forecastData.length > 0 ? Math.max(...forecastData.map(d => d.predicted_kwh)) : 0;
  const min = forecastData.length > 0 ? Math.min(...forecastData.map(d => d.predicted_kwh)) : 0;

  async function fetchForecastForStation(id) {
    try {
      const response = fetch(`https://smartchargex-backend.onrender.com/api/forecast/station/${stationId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Error fetching forecast for station ${id}:`, err);
      return null;
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        setUserLocation({ lat: userLat, lon: userLon });

        const stationsWithDist = stations.map(station => ({
          ...station,
          distance: getDistanceFromLatLonInKm(userLat, userLon, station.lat, station.lon)
        }));

        const NEARBY_RADIUS = 50;
        const nearbyStations = stationsWithDist.filter(s => s.distance <= NEARBY_RADIUS);
        const candidates = nearbyStations.length > 0 ? nearbyStations : stationsWithDist;

        let bestStation = candidates[0];
        let minDemand = Infinity;

        for (const station of candidates) {
          const data = await fetchForecastForStation(station.id);
          if (!data) continue;
          const totalDemand = data.forecast.reduce((acc, f) => acc + f.predicted_kwh, 0);
          if (totalDemand < minDemand) {
            minDemand = totalDemand;
            bestStation = station;
          }
        }

        setStationId(bestStation.id);
        setSuggestedStation(bestStation);
      }, (error) => {
        console.error("Error getting location:", error);
      });
    } else {
      console.error("Geolocation not supported");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const forecastRes = await fetch(`https://smartchargex-backend.onrender.com/api/forecast/station/${stationId}`);
        if (!forecastRes.ok) throw new Error('Failed to fetch forecast data');
        const forecastDataJson = await forecastRes.json();

        const congestionRes = fetch(`https://smartchargex-backend.onrender.com/api/forecast/station/${stationId}/congestion`);
        if (!congestionRes.ok) throw new Error('Failed to fetch congestion data');
        const congestionDataJson = await congestionRes.json();

        setForecastData(forecastDataJson.forecast);
        setInsights(forecastDataJson.insights || {});
        setSustainability(forecastDataJson.sustainability || null);
        setCongestion(congestionDataJson);
      } catch (err) {
        setError(err.message);
        setForecastData([]);
        setInsights({});
        setSustainability(null);
        setCongestion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stationId]);

  useEffect(() => {
    if (reserveMsg) {
      const timer = setTimeout(() => {
        setReserveMsg('');
        setCo2Saved(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [reserveMsg]);

  const handleReserve = async () => {
    if (!reserveTime) {
      alert("Please select a time to reserve.");
      return;
    }

    const selectedDate = new Date(reserveTime);
    const now = new Date();
    if (selectedDate <= now) {
      alert("Please select a future date/time.");
      return;
    }

    const timestamps = forecastData.map(f => new Date(f.timestamp));
    if (timestamps.length === 0) {
      alert("No forecast data available to validate reservation time.");
      return;
    }

    const minTimestamp = new Date(Math.min(...timestamps));
    const maxTimestamp = new Date(Math.max(...timestamps));
    if (selectedDate < minTimestamp || selectedDate > maxTimestamp) {
      alert(`Please select a time between ${minTimestamp.toLocaleString()} and ${maxTimestamp.toLocaleString()}`);
      return;
    }

    setReserving(true);
    setReserveMsg('');
    setCo2Saved(null);

    try {
      const isoTime = selectedDate.toISOString();

      const res = await fetch(`${API_BASE}/api/forecast/station/${stationId}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time: isoTime }),
      });

      const data = await res.json();

      if (res.ok) {
        setReserveMsg("Slot reserved successfully!");
        if (data.co2_saved_this_session !== undefined) {
          setCo2Saved(data.co2_saved_this_session);
        }
      } else {
        setReserveMsg(data.detail || "Failed to reserve slot.");
      }
    } catch (err) {
      setReserveMsg("Error reserving slot.");
    } finally {
      setReserving(false);
    }
  };

   return (
    <div className="dashboard-container">
      <h1>SmartCharge AI Dashboard</h1>
      <p>Welcome to your EV Charging Demand Forecast Dashboard.</p>

      <div className="station-select-container">
        <label htmlFor="station-select" className="station-label">Select Station:</label>
        <select
          id="station-select"
          value={stationId}
          onChange={(e) => setStationId(Number(e.target.value))}
          className="station-select"
        >
          {stations.map(station => (
            <option key={station.id} value={station.id}>{station.name}</option>
          ))}
        </select>

        {userLocation && (
          <p className="user-location-text">
            Your detected location: Lat {userLocation.lat.toFixed(4)}, Lon {userLocation.lon.toFixed(4)}
          </p>
        )}

        {suggestedStation && suggestedStation.id !== stationId && (
          <p className="suggestion-text" style={{
            marginTop: 10,
            padding: 10,
            backgroundColor: '#fff3cd',
            color: '#856404',
            borderRadius: 5,
            border: '1px solid #ffeeba',
          }}>
            📍 Suggestion: The optimal station near you is <strong>{suggestedStation.name}</strong><br />
            📏 Distance: <strong>{suggestedStation.distance?.toFixed(1)} km</strong><br />
            ⚡ Load optimized for availability
          </p>
        )}
      </div>

      {/* Map showing stations and user */}
      <div style={{ height: 400, marginTop: 20 }}>
        <MapContainer
          center={
            userLocation
              ? [userLocation.lat, userLocation.lon]
              : [stations[0].lat, stations[0].lon]
          }
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {stations.map(station => (
            <Marker
              key={station.id}
              position={[station.lat, station.lon]}
              icon={stationIcon}
            >
              <Popup>
                <b>{station.name}</b><br />
                {station.id === stationId && <span>Selected Station</span>}
              </Popup>
            </Marker>
          ))}

          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lon]}
              icon={userIcon}
            >
              <Popup>Your Location</Popup>
            </Marker>
          )}

          {userLocation && (
            <Circle
              center={[userLocation.lat, userLocation.lon]}
              radius={50000} // 50 km radius
              pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
            />
          )}
        </MapContainer>
      </div>

      {loading && <p className="loading-text">Loading forecast data...</p>}

      {error && (
        <div className="error-container">
          <p>Error loading data: {error}</p>
          <button onClick={() => setStationId(stationId)}>Retry</button>
        </div>
      )}

      {!loading && !error && forecastData.length === 0 && (
        <p className="no-data-text">No forecast data available for this station.</p>
      )}

      {!loading && !error && forecastData.length > 0 && (
        <>
          <div className="total-demand-card">
            <h2>Total Predicted Demand (Next 7 Days)</h2>
            <p className="total-demand-value">
              {totalPredictedDemand.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} kWh
            </p>
          </div>

          <div className="kpi-cards-container">
            {[
              { title: 'Max kWh', value: max.toFixed(2), color: '#ff6347' },
              { title: 'Min kWh', value: min.toFixed(2), color: '#4caf50' },
              { title: 'Average kWh', value: avg, color: '#2196f3' },
            ].map(({ title, value, color }) => (
              <div
                key={title}
                className="kpi-card"
                style={{ backgroundColor: color }}
                title={`${title} of predicted demand`}
              >
                <h3>{title}</h3>
                <p>{value}</p>
              </div>
            ))}
          </div>

          <div className="forecast-chart-container">
            <h2>7-Day Demand Forecast</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={forecastData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatDate}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  label={{ value: "kWh", angle: -90, position: "insideLeft" }}
                />
                <Tooltip labelFormatter={formatDate} />
                <Line
                  type="monotone"
                  dataKey="predicted_kwh"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Insights Section */}
          <div className="insights-container">
            <h2>Insights</h2>
            <div className="insight-box peak-hours">
              <h4>Peak Hours</h4>
              {insights.peak_hours && insights.peak_hours.length > 0 ? (
                <ul>
                  {insights.peak_hours.map((hour, idx) => (
                    <li key={idx}>{formatDate(hour)}</li>
                  ))}
                </ul>
              ) : (
                <p>No peak hour data available.</p>
              )}
            </div>

            <div className="insight-box green-hours">
              <h4>Green Hours</h4>
              {insights.green_hours && insights.green_hours.length > 0 ? (
                <ul>
                  {insights.green_hours.map((hour, idx) => (
                    <li key={idx}>{formatDate(hour)}</li>
                  ))}
                </ul>
              ) : (
                <p>No green hour data available.</p>
              )}
            </div>

            {/* Correlation Analysis */}
            {insights.analysis && (
              <div className="insight-box analysis">
                <h4>Demand Correlations</h4>
                <p>Temperature vs Demand: {insights.analysis.correlation_temperature_demand}</p>
                <p>Traffic vs Demand: {insights.analysis.correlation_traffic_demand}</p>
                <p><em>{insights.analysis.interpretation}</em></p>
              </div>
            )}
          </div>

          {/* Congestion Info */}
          {congestion && (
            <div className="congestion-info">
              <h2>Congestion Info</h2>
              <p><strong>Congestion Level:</strong> {congestion.congestion_level}</p>
              <p><strong>Estimated Wait Time:</strong> {congestion.estimated_wait_minutes} minutes</p>
            </div>
          )}

          {/* Sustainability Info */}
          {sustainability && (
            <div className="sustainability-info">
              <h2>Sustainability</h2>
              <p>{sustainability.sustainability_explanation}</p>
              <p><strong>Badge:</strong> {sustainability.badge}</p>
              <p><strong>Estimated CO₂ Saved per Charging Session:</strong> {sustainability.co2_saved_per_session} kg</p>
              <p><strong>Sustainability Score:</strong> {sustainability.sustainability_score}% (lower is better)</p>
            </div>
          )}

          {/* Reservation Section */}
          <div className="reservation-container">
            <h2>Reserve a Charging Slot</h2>
            <input
              type="datetime-local"
              value={reserveTime}
              onChange={e => setReserveTime(e.target.value)}
              className="datetime-input"
            />
            <button
              className="reserve-button"
              onClick={handleReserve}
              disabled={reserving}
              title="Select a valid date and time within forecast"
            >
              {reserving ? 'Reserving...' : 'Reserve Slot'}
            </button>

            {reserveMsg && (
              <p className={`reserve-message ${reserveMsg.includes("successfully") ? "success" : "error"}`}>
                {reserveMsg}
                {co2Saved !== null && reserveMsg.includes("successfully") && (
                  <><br />Estimated CO₂ saved this session: <strong>{co2Saved} kg</strong></>
                )}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import RouteDetails from '../RouteDetails';
import './style.css';

const Sidebar = ({ routes, selectedRoute, onRouteSelect, setOptimizeRoute, showOptimizeRoute, setShowComparison,showComparison }) => {
  const handleRouteChange = async (event) => {
    const route_number = event.target.value;
    setOptimizeRoute(false)
    onRouteSelect(route_number)
  };


  return (
    <div className="sidebar">
      <h2>Select Route</h2>
      <select value={selectedRoute} onChange={handleRouteChange}>
        <option value="">Select Route</option>
        {routes?.map((route, index) => (
          <option key={index} value={route.route_number}>
            {route.route_number}
          </option>
        ))}
      </select>
      {selectedRoute && <RouteDetails routeId={selectedRoute} setOptimizeRoute={setOptimizeRoute} showOptimizeRoute={showOptimizeRoute} setShowComparison={setShowComparison} showComparison={showComparison} />}
    </div>
  );
};

export default Sidebar;

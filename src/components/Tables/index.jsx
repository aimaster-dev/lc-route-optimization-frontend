import React, { useEffect, useState } from 'react';
import { getComparisonData } from '../../services/routeService';
import './style.css'; 

const RouteSegmentsTable = ({ route_id }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTableData = async () => {
      if (route_id) {
        try {
          const data = await getComparisonData(route_id);
          console.log("Fetched table data:", data);
          if (data.success) {
            setTableData(data.route.sequence || []);
          } else {
            setError(data.error);
          }
        } catch (err) {
          setError('Failed to fetch table data.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTableData();
  }, [route_id]);

  if (loading) {
    return <p>Loading table data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!tableData.length) {
    return <p>No table data available.</p>;
  }

  const optimalSegments = tableData.filter(row => row.Route_Type === "Optimal");
  const manualSegments = tableData.filter(row => row.Route_Type === "Manual");

  const calculateTotalTime = (segments) => {
    const baseTime = segments.reduce((acc, row) => acc + Number(row["Time (min)"] || 0), 0);
    return baseTime
    // const additionalTime = segments.length; // Adding 10 minutes after each stop (adjust if needed)
    // return baseTime + additionalTime;
  };

  const totalManualTime = calculateTotalTime(manualSegments) / 60;
  const totalManualDistance = manualSegments.reduce((acc, row) => acc + Number(row["Distance (km)"] || 0), 0);

  const totalOptimalTime = calculateTotalTime(optimalSegments) / 60;
  const totalOptimalDistance = optimalSegments.reduce((acc, row) => acc + Number(row["Distance (km)"] || 0), 0);

  return (
    <div className="table-container">
      <h3>Route Segments</h3>
      <div className="segments-tables-container">
        {/* Actual Segments Table */}
        <div className="segments-table manual-table">
          <h4>Actual Segments</h4>
          <table className="results-table">
            <thead>
              <tr>
                <th>Segment</th>
                <th>Time (min)</th>
                <th>Distance (Mile)</th>
              </tr>
            </thead>
            <tbody>
              {manualSegments.map((row, index) => (
                <tr key={index}>
                  <td>{row.Segment}</td>
                  <td>{row["Time (min)"]}</td>
                  <td>{row["Distance (km)"]}</td>
                </tr>
              ))}
              <tr className="totals-row">
                <td><strong>Total</strong></td>
                <td><strong>{totalManualTime.toFixed(2)} hours</strong></td>
                <td><strong>{totalManualDistance.toFixed(1)}</strong></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          {/* Actual PERM Notes Table */}
          <div className="notes-table">
            <h5>Actual Segment Service Time</h5>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Segment</th>
                  <th>Service Time</th>
                </tr>
              </thead>
              <tbody>
                {manualSegments.map((row, index) => (
                  <tr key={index}>
                    <td>{row.Segment}</td>
                    <td>{Math.round(row["Service Time"] * 100) / 100 || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Optimal Segments Table */}
        <div className="segments-table optimal-table">
          <h4>Optimal Segments</h4>
          <table className="results-table">
            <thead>
              <tr>
                <th>Segment</th>
                <th>Time (min)</th>
                <th>Distance (Mile)</th>
              </tr>
            </thead>
            <tbody>
              {optimalSegments.map((row, index) => (
                <tr key={index}>
                  <td>{row.Segment}</td>
                  <td>{row["Time (min)"]}</td>
                  <td>{row["Distance (km)"]}</td>
                </tr>
              ))}
              <tr className="totals-row">
                <td><strong>Total</strong></td>
                <td><strong>{totalOptimalTime.toFixed(2)} hours</strong></td>
                <td><strong>{totalOptimalDistance.toFixed(1)}</strong></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          {/* Optimal PERM Notes Table */}
          <div className="notes-table">
            <h5>Optimal Segment Service Time</h5>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Segment</th>
                  <th>Service Time</th>
                </tr>
              </thead>
              <tbody>
                {optimalSegments.map((row, index) => (
                  <tr key={index}>
                    <td>{row.Segment}</td>
                    <td>{Math.round(row["Service Time"] * 100) / 100 || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteSegmentsTable;

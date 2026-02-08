import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from "../api.js";

const CompareTrips = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialTrips = location.state?.trips || [];

    const [detailedTrips, setDetailedTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllDetails = async () => {
            // We use Promise.all to fetch all hotel data in parallel
            const promises = initialTrips.map(trip =>
                api.post('/tripDetails', {
                    location: trip.destination,
                    transportCost: trip.transport_cost,
                    transportType: trip.transport_type,
                    depart: trip.depart_date,
                    ret: trip.return_date,
                    budget: trip.budget
                })
                    .then(res => ({ ...res.data, status: 'success' }))
                    .catch(err => ({ ...trip, status: 'error' }))
            );

            const results = await Promise.all(promises);
            setDetailedTrips(results);
            setLoading(false);
        };

        if (initialTrips.length > 0) {
            fetchAllDetails();
        }
    }, []);

    if (loading) return <h2>Calculating Hotel Costs for {initialTrips.length} trips...</h2>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)}>← Back to Search</button>
            <h1>Trip Comparison</h1>

            <div style={styles.comparisonGrid}>
                {detailedTrips.map((trip, index) => (
                    <div key={index} style={styles.summaryCard}>
                        <h2 style={{ color: '#1976d2' }}>{trip.destination}</h2>
                        <span style={styles.badge}>{trip.transport_type}</span>

                        <div style={styles.costSection}>
                            <p>Transport: <strong>${trip.transport_cost}</strong></p>

                            {trip.hotel_options && trip.hotel_options.length > 0 ? (
                                trip.hotel_options.map((hotel, index) => (

                                    <div key={index} className="hotel-item" style={{
                                        border: '1px solid #ddd',
                                        padding: '10px',
                                        marginBottom: '10px',
                                        borderRadius: '5px'
                                    }}>

                                        <h4 style={{ margin: '0 0 5px 0' }}>{hotel.name}</h4>


                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>
                                                {hotel.price ? `${hotel.price}` : 'Price N/A'} / night
                                            </span>


                                            {hotel.rating && (
                                                <span>⭐ {hotel.rating}</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'red' }}>No hotels found within remaining budget.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    comparisonGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    },
    summaryCard: {
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    badge: {
        backgroundColor: '#e3f2fd',
        color: '#1565c0',
        padding: '5px 10px',
        borderRadius: '15px',
        fontSize: '0.8rem',
        fontWeight: 'bold'
    },
    costSection: {
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid #eee'
    },
    totalPrice: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        color: '#2e7d32',
        marginTop: '10px'
    }
};

export default CompareTrips;
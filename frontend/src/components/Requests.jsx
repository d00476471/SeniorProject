import React, { useEffect, useState } from 'react';
import api from "../api.js";
import AddRequestForm from './AddRequestForm';

const Requests = () => {
    const [flights, setFlights] = useState([]);
    const [drives, setDrives] = useState([]);

    const fetchRequests = async () => {
        api.get('/drives').then(response => {
            setDrives(response.data);
        });

        api.get('/flights').then(response => {
            setFlights(response.data);
        });
    };

    const addRequest = async (newRequestData) => {
        try {
            await api.post('/requests', newRequestData);
            // get the new lists after submission
            fetchRequests();
        } catch (error) {
            console.error("Error adding request", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const formatDuration = (minutes) => {
        if (!minutes) return "N/A";
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    return (
        <div>
            <h2>Flight Search Results</h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <AddRequestForm addRequest={addRequest} />
            </div>

            <div style={styles.mainLayout}>

                {/* drive results */}
                <div style={styles.column}>
                    <h3 style={styles.columnHeader}>Drives</h3>
                    <div style={styles.grid}>

                        {drives.map((drive, index) => (
                            <div key={index} style={styles.card}>
                                <h3>{drive.city_name}</h3>
                                <div style={styles.row}>
                                    <span style={styles.driveTime}>{drive.drive_time_hours} Hours</span>
                                    <span style={styles.airline}>{drive.distance_km} km</span>
                                </div>
                                <div style={styles.details}>
                                    <p><strong>Country:</strong> {drive.country}</p>
                                    <p><strong>Mode:</strong> {drive.transport_mode}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* flight results */}
                <div style={styles.column}>
                    <h3 style={styles.columnHeader}>Flights</h3>
                    <div style={styles.grid}>

                        {flights.map((flight, index) => {
                            if (!flight.price && !flight.flight_price) return null;
                            const price = flight.price || flight.flight_price;
                            const airline = flight.airline || (flight.segments && flight.segments[0]?.airline) || "N/A";

                            return (
                                <div key={index} style={styles.card}>
                                    <h3>{flight.city_name || flight.segments?.[0]?.arrival_city}</h3>

                                    {flight.image && <img src={flight.image} alt="loc" style={styles.image} />}

                                    <div style={styles.row}>
                                        <span style={styles.price}>${price}</span>
                                        <span style={styles.airline}>{airline}</span>
                                    </div>

                                    <div style={styles.details}>
                                        <p><strong>Duration:</strong> {formatDuration(flight.duration_minutes)}</p>
                                        <p><strong>Stops:</strong> {flight.stops === 0 ? "Non-stop" : flight.stops}</p>

                                        {/* hotel cost estimation */}
                                        {flight.hotel_estimate && (
                                            <div style={styles.hotelBox}>
                                                <span>+ ${flight.hotel_estimate.total_stay} Hotel</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    mainLayout: {
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap'
    },
    column: {
        flex: 1,
        minWidth: '300px'
    },
    columnHeader: {
        borderBottom: '2px solid #eee',
        paddingBottom: '10px',
        marginBottom: '20px',
        color: '#444'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
    },
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },
    price: {
        fontSize: '1.5em',
        fontWeight: 'bold',
        color: '#2e7d32'
    },
    driveTime: {
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#e65100'
    },
    airline: {
        color: '#666',
        fontWeight: '500'
    },
    details: {
        fontSize: '0.9em',
        color: '#555',
        borderTop: '1px solid #eee',
        paddingTop: '10px'
    },
    image: {
        width: '100%',
        height: '120px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginBottom: '10px'
    },
    hotelBox: {
        marginTop: '8px',
        padding: '5px',
        backgroundColor: '#fff3e0',
        borderRadius: '4px',
        fontSize: '0.85em',
        color: '#ef6c00',
        fontWeight: 'bold'
    }
};

export default Requests;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api.js";
import AddRequestForm from './AddRequestForm';

const Requests = () => {
    const navigate = useNavigate();

    const [flights, setFlights] = useState([]);
    const [drives, setDrives] = useState([]);
    const [selectedTrips, setSelectedTrips] = useState([]);

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

    const toggleSelection = (trip, type) => {
        const tripId = `${type}-${trip.city_name}`;
        const isSelected = selectedTrips.some(t => t.id === tripId);
        if (isSelected) {
            //remove trip
            setSelectedTrips(selectedTrips.filter(t => t.id !== tripId));
        } else {
            //add it
            const newTrip = {
                id: tripId,
                destination: trip.city_name,
                country: trip.country || "USA",
                transport_type: type,
                transport_cost: type === 'flight' ? (trip.price || trip.flight_price) : 0,
                depart_date: "2026-06-01",
                return_date: "2026-06-06",
                budget: 1000
            };
            setSelectedTrips([...selectedTrips, newTrip]);
        }
    };

    const goToComparison = () => {
        navigate('/compare', { state: { trips: selectedTrips } });
    }

    return (
        <div>
            <h2>Trip Search Results</h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <AddRequestForm addRequest={addRequest} />
            </div>

            {selectedTrips.length > 0 && (
                <div style={styles.fabContainer}>
                    <button style={styles.fabButton} onClick={goToComparison}>
                        Compare {selectedTrips.length} Trips ➔
                    </button>
                </div>
            )}

            <div style={styles.mainLayout}>
                {/* drive results */}
                <div style={styles.column}>
                    <h3 style={styles.columnHeader}>Drives</h3>
                    <div style={styles.grid}>

                        {drives.map((drive, index) => {

                            // check if this specific drive is already in selectedTrips
                            const isSelected = selectedTrips.some(t => t.id === `drive-${drive.city_name}`);

                            return (
                                <div
                                    key={index}
                                    style={{
                                        ...styles.card,
                                        border: isSelected ? '2px solid #2196f3' : '1px solid #ddd'
                                    }}
                                    onClick={() => toggleSelection(drive, 'drive')}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h3>{drive.city_name}</h3>
                                        {/* Now 'isSelected' is defined and will work here */}
                                        <input type="checkbox" checked={isSelected} readOnly />
                                    </div>

                                    <div style={styles.row}>
                                        <span style={styles.driveTime}>{drive.drive_time_hours} Hours</span>
                                        <span style={styles.airline}>{drive.distance_km} km</span>
                                    </div>
                                    <div style={styles.details}>
                                        <p><strong>Country:</strong> {drive.country}</p>
                                        <p><strong>Mode:</strong> {drive.transport_mode}</p>
                                    </div>
                                </div>
                            );
                        })}
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
                            const isSelected = selectedTrips.some(t => t.id === `flight-${flight.city_name}`);

                            return (
                                <div key={index} style={{ ...styles.card, border: isSelected ? '2px solid #2196f3' : '1px solid #ddd' }} onClick={() => toggleSelection(flight, 'flight')}>
                                    <h3>{flight.city_name || flight.segments?.[0]?.arrival_city}</h3>
                                    <input type="checkbox" checked={isSelected} readOnly />


                                    <div style={styles.row}>
                                        <span style={styles.price}>${price}</span>
                                        <span style={styles.airline}>{airline}</span>
                                    </div>

                                    <div style={styles.details}>
                                        <p><strong>Duration:</strong> {formatDuration(flight.duration_minutes)}</p>
                                        <p><strong>Stops:</strong> {flight.stops === 0 ? "Non-stop" : flight.stops}</p>
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
    clickable: {
        cursor: 'pointer',
        transition: 'transform 0.1s, border 0.1s',
        ':hover': {
            transform: 'scale(1.02)',
            border: '2px solid #2196f3'
        }
    }
};

export default Requests;
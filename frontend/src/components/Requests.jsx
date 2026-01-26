import React, { useEffect, useState } from 'react';
import api from "../api.js";
import AddRequestForm from './AddRequestForm';

const Requests = () => {
    const [flights, setFlights] = useState([]);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/requests');
            setFlights(response.data);
        } catch (error) {
            console.error("Error fetching requests", error);
        }
    };

    const addRequest = async (newRequestData) => {
        try {
            await api.post('/requests', newRequestData);
            // get the new list of flights after one is added
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
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px'}}>
                <AddRequestForm addRequest={addRequest} />
            </div>

            <div style={styles.grid}>
                {flights.map((flight, index) => {
                    if (!flight.price) return null;

                    return (
                        <div key={index} style={styles.card}>
                            <h3>{flight.city_name}, {flight.country}</h3>
                            
                            <div style={styles.row}>
                                <span style={styles.price}>${flight.price}</span>
                                <span style={styles.airline}>{flight.airline}</span>
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
    );
};

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    },
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        fontFamily: 'Arial, sans-serif'
    },
    formContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px'
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
    airline: {
        color: '#666',
        fontWeight: '500'
    },
    details: {
        fontSize: '0.9em',
        color: '#555',
        borderTop: '1px solid #eee',
        paddingTop: '10px'
    }
};

export default Requests;
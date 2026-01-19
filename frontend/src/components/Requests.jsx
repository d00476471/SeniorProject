import React, { useEffect, useState } from 'react';
import api from "../api.js";
import AddRequestForm from './AddRequestForm';

const Requests = () => {
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/requests');
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching requests", error);
        }
    };

    const addRequest = async (newRequestData) => {
        try {
            // Sends location budget and date
            await api.post('/requests', newRequestData);

            fetchRequests(); // Refresh the list after adding
        } catch (error) {
            console.error("Error adding request", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div>
            <h2>Trip Requests List</h2>
            <ul>
                {requests.map((req, index) => (
                    <li key={index}>
                        {req.location} — ${req.budget} (Date: {req.date})
                    </li>
                ))}
            </ul>
            <AddRequestForm addRequest={addRequest} />
        </div>
    );
};

export default Requests;
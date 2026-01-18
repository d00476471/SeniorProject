import React, { useState } from 'react';

const AddRequestForm = ({ addRequest }) => {
    const [formData, setFormData] = useState({
        location: '',
        budget: '',
        date: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        // make sure form is filled out
        if (formData.location && formData.budget && formData.date) {

            // Convert strings to correct values
            const payload = {
                location: formData.location,
                budget: parseInt(formData.budget),
                date: parseInt(formData.date)
            };

            addRequest(payload);

            // Reset form after submitted
            setFormData({ location: '', budget: '', date: '' });
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <h3>Add New Trip Request</h3>

            {/* Location Input */}
            <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location (e.g. New York)"
                required
            />

            {/* Budget Input */}
            <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Budget (e.g. 1000)"
                required
            />

            {/* Date Input */}
            {/* Note: Using number type to match your 'date: int' backend model */}
            <input
                type="number"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="Date (e.g. 20230101)"
                required
            />

            <button type="submit">Add Request</button>
        </form>
    );
};

export default AddRequestForm;
import React, { useState } from 'react';

const AddRequestForm = ({ addRequest }) => {
    const [formData, setFormData] = useState({
        location: '',
        budget: '',
        depart: '',
        ret: ''
    });

    // Updates inputs with name being the field name and the value being the value in that field and the setFormData makes sure that 
    //previous data isnt cleared out when you update one part of the form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // make sure form is filled out
        if (formData.location && formData.budget && formData.depart && formData.ret) {

            // convert strings to correct values
            const payload = {
                location: formData.location,
                budget: parseInt(formData.budget),
                depart: parseInt(formData.depart),
                ret: parseInt(formData.ret)
            };

            addRequest(payload);

            // reset form after submitted
            setFormData({ location: '', budget: '', depart: '', ret: '' });
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px'}}>
            <h3>Add New Trip Request</h3>

            <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location (e.g. New York)"
                required
            />

            <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Budget (e.g. 1000)"
                required
            />

            <input
                type="number"
                name="depart"
                value={formData.depart}
                onChange={handleChange}
                placeholder="Departure Date (e.g. 20260101)"
                required
            />

            <input
                type="number"
                name="ret"
                value={formData.ret}
                onChange={handleChange}
                placeholder="Return Date (e.g. 20260101)"
                required
            />

            <button type="submit">Add Request</button>
        </form>
    );
};

export default AddRequestForm;
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Requests from './components/Requests';
import TripComparison from './components/TripComparison';

const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Requests />} />
                <Route path="/compare" element={<TripComparison />} />
            </Routes>
        </div >
    );
};

export default App;
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { CalculatorPage } from './pages/CalculatorPage';
import { InsightsPage } from './pages/InsightsPage';
import { HistoryPage } from './pages/HistoryPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<CalculatorPage />} />
                <Route path="insights" element={<InsightsPage />} />
                <Route path="history" element={<HistoryPage />} />
            </Route>
        </Routes>
    );
}

export default App;

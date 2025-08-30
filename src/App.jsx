import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import LayoutComponent from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Resources from './pages/Resources';
import Progress from './pages/Progress';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <LayoutComponent>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </LayoutComponent>
      </Router>
    </ConfigProvider>
  );
}

export default App

import { useState } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AlertsView } from './components/AlertsView';
import { ReportsView } from './components/ReportsView';
import { mockServices } from './components/mockData';
import type { Service } from './components/types';

export type TabType = 'dashboard' | 'servicios' | 'alertas' | 'reportes';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [services] = useState<Service[]>(mockServices);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(selectedService === serviceId ? null : serviceId);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Reset selected service when changing tabs
    setSelectedService(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'servicios':
        return (
          <DashboardView
            services={services}
            selectedService={selectedService}
            onServiceSelect={handleServiceSelect}
            showNetworkDiagram={activeTab === 'dashboard'}
          />
        );
      case 'alertas':
        return <AlertsView services={services} />;
      case 'reportes':
        return <ReportsView services={services} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="pt-16">
        {renderContent()}
      </main>
    </div>
  );
}
import { useState } from 'react';
import { useAccount } from 'wagmi';
import ChannelList from './ChannelList';
import CreateChannel from './CreateChannel';
import ChannelDetails from './ChannelDetails';

export default function Dashboard() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<'channels' | 'create' | 'details'>('channels');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  const handleViewChannel = (channelId: string) => {
    setSelectedChannelId(channelId);
    setActiveTab('details');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Channels Dashboard</h1>
        <p className="text-gray-600">Connected as: {address}</p>
      </div>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('channels')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'channels'
                ? 'border-somnia-primary text-somnia-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Channels
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'create'
                ? 'border-somnia-primary text-somnia-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Create Channel
          </button>
          {selectedChannelId && (
            <button
              onClick={() => setActiveTab('details')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-somnia-primary text-somnia-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Channel Details
            </button>
          )}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'channels' && (
          <ChannelList onViewChannel={handleViewChannel} />
        )}
        {activeTab === 'create' && (
          <CreateChannel onChannelCreated={() => setActiveTab('channels')} />
        )}
        {activeTab === 'details' && selectedChannelId && (
          <ChannelDetails channelId={selectedChannelId} />
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

interface ChannelListProps {
  onViewChannel: (channelId: string) => void;
}

interface Channel {
  id: string;
  participant1: string;
  participant2: string;
  balance1: bigint;
  balance2: bigint;
  isOpen: boolean;
  inDispute: boolean;
}

export default function ChannelList({ onViewChannel }: ChannelListProps) {
  const { address } = useAccount();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  // Get user's channel IDs
  const { data: channelIds, isLoading: loadingIds } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserChannels',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address, // Only call when address is defined
    },
  });

  // Get channel details for each channel ID
  const { data: channelData, isLoading: loadingChannels } = useReadContracts({
    contracts: (channelIds as bigint[] || []).map((id) => ({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'getChannel',
      args: [id],
    })),
    query: {
      enabled: !!address && !!channelIds && (channelIds as bigint[]).length > 0, // Only call when address and channelIds are available
    },
  });

  useEffect(() => {
    if (channelIds && channelData) {
      const formattedChannels = (channelIds as bigint[]).map((id, index) => {
        const channel = channelData[index].result as any;
        return {
          id: id.toString(),
          participant1: channel.participant1,
          participant2: channel.participant2,
          balance1: channel.balance1,
          balance2: channel.balance2,
          isOpen: channel.isOpen,
          inDispute: channel.inDispute,
        };
      });
      setChannels(formattedChannels);
      setLoading(false);
    }
  }, [channelIds, channelData]);

  // Early return if no address is connected - after all hooks
  if (!address) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600">Please connect your wallet to view your payment channels.</p>
      </div>
    );
  }

  const getChannelStatus = (channel: Channel) => {
    if (channel.inDispute) return { text: 'In Dispute', color: 'text-red-600 bg-red-100' };
    if (channel.isOpen) return { text: 'Open', color: 'text-green-600 bg-green-100' };
    return { text: 'Closed', color: 'text-gray-600 bg-gray-100' };
  };

  const getOtherParticipant = (channel: Channel) => {
    return channel.participant1.toLowerCase() === address?.toLowerCase() 
      ? channel.participant2 
      : channel.participant1;
  };

  const getMyBalance = (channel: Channel) => {
    return channel.participant1.toLowerCase() === address?.toLowerCase() 
      ? channel.balance1 
      : channel.balance2;
  };

  if (loadingIds || loadingChannels || loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-somnia-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading channels...</p>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Channels</h3>
        <p className="text-gray-600 mb-6">You haven&apos;t created or joined any payment channels yet.</p>
        <button className="btn btn-primary">Create Your First Channel</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Your Payment Channels</h2>
        <span className="text-sm text-gray-500">{channels.length} channel{channels.length !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="grid gap-4">
        {channels.map((channel) => {
          const status = getChannelStatus(channel);
          const otherParticipant = getOtherParticipant(channel);
          const myBalance = getMyBalance(channel);
          
          return (
            <div key={channel.id} className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewChannel(channel.id)}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">Channel #{channel.id}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Partner:</span> {otherParticipant.slice(0, 6)}...{otherParticipant.slice(-4)}
                    </p>
                    <p>
                      <span className="font-medium">My Balance:</span> {formatEther(myBalance)} STT
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatEther(channel.balance1 + channel.balance2)} STT
                    </div>
                    <div className="text-sm text-gray-500">Total Locked</div>
                  </div>
                  
                  <button className="text-somnia-primary hover:text-somnia-secondary text-sm font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
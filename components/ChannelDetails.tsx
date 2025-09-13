import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

interface ChannelDetailsProps {
  channelId: string;
}

interface Channel {
  participant1: string;
  participant2: string;
  balance1: bigint;
  balance2: bigint;
  nonce: bigint;
  challengePeriod: bigint;
  challengeEnd: bigint;
  isOpen: boolean;
  inDispute: boolean;
  challenger: string;
}

export default function ChannelDetails({ channelId }: ChannelDetailsProps) {
  const { address } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  // Get channel data
  const { data: channelData, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getChannel',
    args: [BigInt(channelId)],
  });

  const { writeContract, data: hash, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const channel = channelData as Channel;

  useEffect(() => {
    if (isSuccess) {
      refetch();
      setIsDepositing(false);
      setDepositAmount('');
    }
  }, [isSuccess, refetch]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid deposit amount');
      return;
    }

    try {
      setIsDepositing(true);
      
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'deposit',
        args: [BigInt(channelId)],
        value: parseEther(depositAmount),
      });
    } catch (err) {
      console.error('Error depositing:', err);
      setIsDepositing(false);
    }
  };

  const handleCloseChannel = () => {
    // This would typically involve getting signatures from both parties
    // For now, we'll show an alert
    alert('Cooperative channel closure requires both parties to sign. This feature will be implemented with off-chain signature collection.');
  };

  const handleStartDispute = () => {
    // This would involve submitting the latest signed state
    alert('Dispute resolution requires the latest signed payment state. This feature will be implemented with proper state management.');
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-somnia-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading channel details...</p>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Channel not found</p>
      </div>
    );
  }

  const isParticipant1 = channel.participant1.toLowerCase() === address?.toLowerCase();
  const otherParticipant = isParticipant1 ? channel.participant2 : channel.participant1;
  const myBalance = isParticipant1 ? channel.balance1 : channel.balance2;
  const otherBalance = isParticipant1 ? channel.balance2 : channel.balance1;

  const getChannelStatus = () => {
    if (channel.inDispute) return { text: 'In Dispute', color: 'text-red-600 bg-red-100' };
    if (channel.isOpen) return { text: 'Open', color: 'text-green-600 bg-green-100' };
    return { text: 'Closed', color: 'text-gray-600 bg-gray-100' };
  };

  const status = getChannelStatus();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Channel Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Channel #{channelId}</h2>
            <p className="text-gray-600">Payment Channel Details</p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${status.color}`}>
            {status.text}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Channel Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Your Address:</span>
                <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Partner Address:</span>
                <span className="font-mono">{otherParticipant.slice(0, 6)}...{otherParticipant.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Nonce:</span>
                <span>{channel.nonce.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Challenge Period:</span>
                <span>{(Number(channel.challengePeriod) / 86400).toFixed(0)} days</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Balance Overview</h3>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">Your Balance</div>
                <div className="text-lg font-semibold text-blue-900">{formatEther(myBalance)} STT</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Partner Balance</div>
                <div className="text-lg font-semibold text-gray-900">{formatEther(otherBalance)} STT</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-green-600 mb-1">Total Locked</div>
                <div className="text-lg font-semibold text-green-900">{formatEther(channel.balance1 + channel.balance2)} STT</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {channel.isOpen && !channel.inDispute && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Deposit Funds */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Funds</h3>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount (STT)
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="0.1"
                  step="0.01"
                  min="0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isDepositing || isConfirming}
                className="btn btn-primary w-full disabled:opacity-50"
              >
                {isDepositing || isConfirming ? 'Processing...' : 'Deposit Funds'}
              </button>
            </form>
          </div>

          {/* Channel Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleCloseChannel}
                className="btn btn-secondary w-full"
              >
                Close Channel Cooperatively
              </button>
              <button
                onClick={handleStartDispute}
                className="btn w-full bg-orange-500 text-white hover:bg-orange-600"
              >
                Start Dispute Resolution
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Cooperative closure requires both parties to agree. Disputes are for uncooperative situations.
            </p>
          </div>
        </div>
      )}

      {/* Dispute Information */}
      {channel.inDispute && (
        <div className="card border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-red-900 mb-4">⚠️ Channel in Dispute</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Challenger:</span>
              <span className="font-mono">{channel.challenger.slice(0, 6)}...{channel.challenger.slice(-4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Challenge Ends:</span>
              <span>{new Date(Number(channel.challengeEnd) * 1000).toLocaleString()}</span>
            </div>
          </div>
          {Number(channel.challengeEnd) * 1000 < Date.now() && (
            <button className="btn btn-primary mt-4">
              Settle Dispute
            </button>
          )}
        </div>
      )}

      {/* Recent Activity Placeholder */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Payment history and channel events will be displayed here</p>
          <p className="text-sm mt-2">This feature will be implemented with event indexing</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            Error: {error.message}
          </p>
        </div>
      )}
    </div>
  );
}
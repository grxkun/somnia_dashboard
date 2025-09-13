import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

interface CreateChannelProps {
  onChannelCreated: () => void;
}

export default function CreateChannel({ onChannelCreated }: CreateChannelProps) {
  const [formData, setFormData] = useState({
    participant2: '',
    initialDeposit: '',
    challengePeriod: '7', // days
  });
  const [isCreating, setIsCreating] = useState(false);

  const { writeContract, data: hash, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.participant2 || !formData.initialDeposit) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsCreating(true);
      
      const challengePeriodInSeconds = BigInt(parseInt(formData.challengePeriod) * 24 * 60 * 60);
      
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'openChannel',
        args: [formData.participant2, challengePeriodInSeconds],
        value: parseEther(formData.initialDeposit),
      });
    } catch (err) {
      console.error('Error creating channel:', err);
      setIsCreating(false);
    }
  };

  // Handle successful transaction
  if (isSuccess) {
    setTimeout(() => {
      onChannelCreated();
      setFormData({ participant2: '', initialDeposit: '', challengePeriod: '7' });
      setIsCreating(false);
    }, 2000);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Payment Channel</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="participant2" className="block text-sm font-medium text-gray-700 mb-2">
              Partner Address *
            </label>
            <input
              type="text"
              id="participant2"
              className="input"
              placeholder="0x..."
              value={formData.participant2}
              onChange={(e) => setFormData({ ...formData, participant2: e.target.value })}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the Ethereum address of the person you want to create a channel with
            </p>
          </div>

          <div>
            <label htmlFor="initialDeposit" className="block text-sm font-medium text-gray-700 mb-2">
              Initial Deposit (STT) *
            </label>
            <input
              type="number"
              id="initialDeposit"
              className="input"
              placeholder="0.1"
              step="0.01"
              min="0"
              value={formData.initialDeposit}
              onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Amount of STT tokens to lock in the channel initially
            </p>
          </div>

          <div>
            <label htmlFor="challengePeriod" className="block text-sm font-medium text-gray-700 mb-2">
              Challenge Period (Days)
            </label>
            <select
              id="challengePeriod"
              className="input"
              value={formData.challengePeriod}
              onChange={(e) => setFormData({ ...formData, challengePeriod: e.target.value })}
            >
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days (Recommended)</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Time period for dispute resolution if channel closure is contested
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Channel Creation Summary</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You will deposit {formData.initialDeposit || '0'} STT tokens</li>
              <li>• Your partner can deposit additional funds after channel creation</li>
              <li>• Channel can be closed cooperatively at any time</li>
              <li>• Dispute resolution period: {formData.challengePeriod} days</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                Error: {error.message}
              </p>
            </div>
          )}

          {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                ✅ Channel created successfully! Redirecting to channels list...
              </p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isCreating || isConfirming}
              className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating || isConfirming ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isConfirming ? 'Confirming...' : 'Creating Channel...'}
                </div>
              ) : (
                'Create Channel'
              )}
            </button>
            
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFormData({ participant2: '', initialDeposit: '', challengePeriod: '7' })}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How Payment Channels Work</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>1. Channel Creation:</strong> You and your partner lock funds in a smart contract.
          </p>
          <p>
            <strong>2. Off-chain Payments:</strong> Exchange signed payment commitments instantly without blockchain transactions.
          </p>
          <p>
            <strong>3. Channel Closure:</strong> Settle final balances on-chain when you're done transacting.
          </p>
          <p>
            <strong>4. Dispute Resolution:</strong> If there's disagreement, the smart contract ensures fair resolution.
          </p>
        </div>
      </div>
    </div>
  );
}
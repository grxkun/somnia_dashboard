import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Landing() {
  return (
    <div className="text-center py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-somnia-primary">Somnia</span> Payment Channels
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Create instant, low-cost payment channels on the Somnia Network. 
          Send payments instantly without waiting for blockchain confirmations.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="card text-center">
            <div className="w-12 h-12 bg-somnia-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Payments</h3>
            <p className="text-gray-600">Send payments instantly within payment channels without blockchain delays.</p>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-somnia-secondary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Channels</h3>
            <p className="text-gray-600">All channels are secured by smart contracts with dispute resolution.</p>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-somnia-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Low Fees</h3>
            <p className="text-gray-600">Minimize transaction costs with off-chain payment processing.</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Get Started</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to start creating payment channels and making instant transactions.
          </p>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
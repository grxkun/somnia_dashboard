import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Dashboard from '@/components/Dashboard';
import Landing from '@/components/Landing';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <>
      <Head>
        <title>Somnia Dashboard - Payment Channels</title>
        <meta name="description" content="Payment channel DApp on Somnia Network" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-somnia-primary to-somnia-secondary rounded-lg"></div>
                <h1 className="text-2xl font-bold text-gray-900">Somnia Dashboard</h1>
              </div>
              <ConnectButton />
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isConnected ? <Dashboard /> : <Landing />}
        </main>
      </div>
    </>
  );
}
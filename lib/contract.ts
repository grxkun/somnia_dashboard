// Contract configuration
export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000' as const; // Will be updated after deployment

export const CONTRACT_ABI = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "DEFAULT_CHALLENGE_PERIOD",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_CHALLENGE_PERIOD",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MIN_CHALLENGE_PERIOD",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "channels",
    "inputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "outputs": [
      {"name": "participant1", "type": "address", "internalType": "address"},
      {"name": "participant2", "type": "address", "internalType": "address"},
      {"name": "balance1", "type": "uint256", "internalType": "uint256"},
      {"name": "balance2", "type": "uint256", "internalType": "uint256"},
      {"name": "nonce", "type": "uint256", "internalType": "uint256"},
      {"name": "challengePeriod", "type": "uint256", "internalType": "uint256"},
      {"name": "challengeEnd", "type": "uint256", "internalType": "uint256"},
      {"name": "isOpen", "type": "bool", "internalType": "bool"},
      {"name": "inDispute", "type": "bool", "internalType": "bool"},
      {"name": "challenger", "type": "address", "internalType": "address"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "closeChannel",
    "inputs": [
      {"name": "channelId", "type": "uint256", "internalType": "uint256"},
      {"name": "finalBalance1", "type": "uint256", "internalType": "uint256"},
      {"name": "finalBalance2", "type": "uint256", "internalType": "uint256"},
      {"name": "nonce", "type": "uint256", "internalType": "uint256"},
      {"name": "signature1", "type": "bytes", "internalType": "bytes"},
      {"name": "signature2", "type": "bytes", "internalType": "bytes"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deposit",
    "inputs": [{"name": "channelId", "type": "uint256", "internalType": "uint256"}],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getChannel",
    "inputs": [{"name": "channelId", "type": "uint256", "internalType": "uint256"}],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct MonkOfSomnia.Channel",
        "components": [
          {"name": "participant1", "type": "address", "internalType": "address"},
          {"name": "participant2", "type": "address", "internalType": "address"},
          {"name": "balance1", "type": "uint256", "internalType": "uint256"},
          {"name": "balance2", "type": "uint256", "internalType": "uint256"},
          {"name": "nonce", "type": "uint256", "internalType": "uint256"},
          {"name": "challengePeriod", "type": "uint256", "internalType": "uint256"},
          {"name": "challengeEnd", "type": "uint256", "internalType": "uint256"},
          {"name": "isOpen", "type": "bool", "internalType": "bool"},
          {"name": "inDispute", "type": "bool", "internalType": "bool"},
          {"name": "challenger", "type": "address", "internalType": "address"}
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMessageHash",
    "inputs": [
      {"name": "channelId", "type": "uint256", "internalType": "uint256"},
      {"name": "nonce", "type": "uint256", "internalType": "uint256"},
      {"name": "balance1", "type": "uint256", "internalType": "uint256"},
      {"name": "balance2", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [{"name": "", "type": "bytes32", "internalType": "bytes32"}],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getUserChannels",
    "inputs": [{"name": "user", "type": "address", "internalType": "address"}],
    "outputs": [{"name": "", "type": "uint256[]", "internalType": "uint256[]"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextChannelId",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "openChannel",
    "inputs": [
      {"name": "participant2", "type": "address", "internalType": "address"},
      {"name": "challengePeriod", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "settleDispute",
    "inputs": [{"name": "channelId", "type": "uint256", "internalType": "uint256"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "startDispute",
    "inputs": [
      {"name": "channelId", "type": "uint256", "internalType": "uint256"},
      {"name": "nonce", "type": "uint256", "internalType": "uint256"},
      {"name": "balance1", "type": "uint256", "internalType": "uint256"},
      {"name": "balance2", "type": "uint256", "internalType": "uint256"},
      {"name": "signature", "type": "bytes", "internalType": "bytes"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [{"name": "newOwner", "type": "address", "internalType": "address"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "userChannels",
    "inputs": [
      {"name": "", "type": "address", "internalType": "address"},
      {"name": "", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verifySignature",
    "inputs": [
      {"name": "messageHash", "type": "bytes32", "internalType": "bytes32"},
      {"name": "signature", "type": "bytes", "internalType": "bytes"},
      {"name": "signer", "type": "address", "internalType": "address"}
    ],
    "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "withdraw",
    "inputs": [{"name": "channelId", "type": "uint256", "internalType": "uint256"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "ChannelClosed",
    "inputs": [
      {"name": "channelId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "finalBalance1", "type": "uint256", "indexed": false, "internalType": "uint256"},
      {"name": "finalBalance2", "type": "uint256", "indexed": false, "internalType": "uint256"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ChannelOpened",
    "inputs": [
      {"name": "channelId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "participant1", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "participant2", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "amount1", "type": "uint256", "indexed": false, "internalType": "uint256"},
      {"name": "amount2", "type": "uint256", "indexed": false, "internalType": "uint256"},
      {"name": "challengePeriod", "type": "uint256", "indexed": false, "internalType": "uint256"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Deposit",
    "inputs": [
      {"name": "channelId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "participant", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DisputeSettled",
    "inputs": [
      {"name": "channelId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "finalBalance1", "type": "uint256", "indexed": false, "internalType": "uint256"},
      {"name": "finalBalance2", "type": "uint256", "indexed": false, "internalType": "uint256"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DisputeStarted",
    "inputs": [
      {"name": "channelId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "challenger", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "challengeEnd", "type": "uint256", "indexed": false, "internalType": "uint256"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {"name": "previousOwner", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "newOwner", "type": "address", "indexed": true, "internalType": "address"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Withdraw",
    "inputs": [
      {"name": "channelId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "participant", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256"}
    ],
    "anonymous": false
  }
] as const;
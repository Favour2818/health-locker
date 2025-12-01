Overview
Relevant source files
This document provides a high-level introduction to the Health Data Locker project, a privacy-preserving decentralized health records management system. The system uses Fully Homomorphic Encryption (FHE) via the FHEVM (Fully Homomorphic Encryption Virtual Machine) to enable encrypted storage and computation of sensitive health data on the Sepolia blockchain testnet.

For detailed information about specific subsystems:

Project structure and setup instructions: see Project Structure and Getting Started
Detailed architecture and data flow: see Architecture Overview
Frontend implementation details: see Frontend Application
FHEVM integration specifics: see FHEVM Integration
Blockchain connectivity: see Web3 Integration
What is Health Data Locker
Health Data Locker is a React-based web application that allows users to store and manage their health records on the blockchain while maintaining complete privacy through client-side encryption. The application ensures that sensitive health information never exists in plaintext on the blockchain or any centralized server.

Key Characteristics:

Privacy-First: All health data is encrypted in the user's browser before transmission
Decentralized: Records stored on Sepolia testnet (Chain ID: 11155111)
Zero-Knowledge: Smart contract operations on encrypted data without decryption
User-Controlled: Only the data owner can decrypt their records using EIP-712 signatures
Sources: 
frontend/src/App.tsx
1-24
 
frontend/index.html
1-16

Core Technologies
The application combines modern web development with cryptographic primitives and blockchain technology:

Technology	Version	Purpose
React	19.2.0	UI framework with functional components and hooks
TypeScript	5.9.3	Type-safe JavaScript for compile-time error detection
Vite	7.2.4	Fast build tool with ES module native support
FHEVM SDK	0.1.2	Fully Homomorphic Encryption operations
Zama RelayerSDK	0.3.0-5	External CDN-loaded SDK for FHE relayer operations
Wagmi	2.19.5	React hooks for Ethereum wallet interaction
Viem	2.39.3	TypeScript-first Ethereum client library
RainbowKit	2.2.9	Wallet connection UI components
React Router	7.9.6	Client-side routing and navigation
Framer Motion	12.23.24	Animation library for UI transitions
Sources: 
frontend/package.json
1-40

System Architecture
The following diagram illustrates the three-layer architecture with specific code entities:
































Architecture Layers:

Browser Environment: Entry point via index.html which loads the React application and Zama RelayerSDK from CDN
Frontend Layer: React application with routing, component hierarchy, custom hooks, and FHEVM integration
Web3 Integration: Wallet connection and blockchain interaction stack using RainbowKit → Wagmi → Viem
External Services: User's crypto wallet, Sepolia testnet, and deployed smart contract
Sources: 
frontend/index.html
1-16
 
frontend/src/App.tsx
1-24
 
frontend/package.json
12-23

Application Entry Points
The following diagram shows the precise initialization sequence with file paths and function names:

Initialization Steps:

HTML Bootstrap 
`index.html
1-16
: Mounts <div id="root"> and loads RelayerSDK from CDN at line 11-13
React Mount 
`main.tsx`
: Creates React root and renders <App /> component
FHEVM Setup 
`App.tsx
9-13
: Calls initializeFheInstance() in useEffect hook on component mount
Route Definition 
`App.tsx
14-21
: Defines two routes wrapped in <MainLayout>
/ → Home.tsx
/dashboard → Dashboard.tsx
Sources: 
frontend/index.html
10-14
 
frontend/src/App.tsx
1-24

Key Features
The application provides the following core functionality:

Feature	Description	Implementation
Wallet Connection	Connect Web3 wallet (MetaMask, WalletConnect, etc.)	RainbowKit UI + Wagmi hooks
Add Encrypted Record	Store health data with client-side encryption	Dashboard page with useHealthLocker.addHealthRecord()
View Records	Display list of encrypted health records	Dashboard table showing encrypted values
Decrypt Record	Decrypt specific record with EIP-712 signature	Dashboard decrypt button with decryptValue()
Network Validation	Ensure connection to Sepolia testnet	Chain ID check: 11155111
FHEVM Integration	Enable homomorphic encryption operations	lib/fhevm.js wrapper around FHEVM SDK
For detailed implementation of each feature, see:

Wallet connection: Wallet Connection
Record operations: Dashboard Page
FHEVM operations: FHEVM Integration
Sources: 
frontend/src/App.tsx
1-24
 
frontend/package.json
12-23

Repository Structure
health-locker/
├── frontend/                    # React application
│   ├── src/
│   │   ├── App.tsx             # Main app component with routing
│   │   ├── main.tsx            # React entry point
│   │   ├── pages/              # Route components (Home, Dashboard)
│   │   ├── components/         # Reusable UI components
│   │   ├── layouts/            # Layout wrappers (MainLayout)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility libraries (fhevm.js)
│   │   ├── config/             # Configuration files
│   │   └── styles/             # CSS stylesheets
│   ├── index.html              # HTML entry point with RelayerSDK script
│   ├── package.json            # Dependencies and scripts
│   ├── tsconfig.json           # TypeScript configuration
│   ├── vite.config.ts          # Vite build configuration
│   └── eslint.config.js        # ESLint rules
│
├── fhevm-sdk/                   # FHEVM SDK package (standalone)
│   ├── package.json            # SDK dependencies
│   ├── tsconfig.json           # SDK TypeScript config
│   └── src/                    # SDK source code
│
└── README.md                    # Project documentation
For detailed project structure breakdown, see Project Structure.

Sources: 
frontend/package.json
1-40
 
frontend/index.html
1-16
 
frontend/src/App.tsx
1-24

Technology Stack Overview
The following table maps each technology to its specific role and key code locations:

Layer	Technology	Primary Files	Key Exports/Functions
Entry	HTML5	index.html	<div id="root">, RelayerSDK script tag
Build	Vite	vite.config.ts	Development server, production builds
Build	TypeScript	tsconfig.json, tsconfig.app.json	Compiler options, type checking
Framework	React 19	main.tsx, App.tsx	Component tree, routing setup
Routing	React Router	App.tsx	<Routes>, <Route> components
Layout	Custom	layouts/MainLayout.tsx	Page wrapper with Sidebar + Navbar
State	Custom Hooks	hooks/ directory	useHealthLocker(), useFhevmSetup()
Encryption	FHEVM SDK	lib/fhevm.js, fhevm-sdk/	initializeFheInstance(), encryptValue()
Blockchain	Wagmi + Viem	Throughout components	useAccount(), useWriteContract()
Wallet UI	RainbowKit	components/ConnectWalletButton.tsx	<ConnectButton />
Styling	CSS	styles/*.css	Global styles, component styles
Animations	Framer Motion	Various components	Animation variants
Sources: 
frontend/package.json
12-23
 
frontend/src/App.tsx
1-24
 
frontend/index.html
1-16

Development Workflow
The application supports the following npm scripts defined in package.json:

Script	Command	Purpose
dev	vite	Start development server with hot module replacement
build	tsc -b && vite build	Type check with TypeScript, then build for production
lint	eslint .	Run ESLint to check code quality
preview	vite preview	Preview production build locally
Development Process:

Run npm run dev to start local development server
Edit source files in src/ directory
Vite automatically hot-reloads changes
Run npm run lint to check code quality
Run npm run build for production build
For detailed setup instructions, see Getting Started.

Sources: 
frontend/package.json
6-10

Network Configuration
The application is configured to interact with the Sepolia testnet:

Parameter	Value
Network Name	Sepolia
Chain ID	11155111
Network Type	Ethereum Testnet
FHEVM Support	Yes (via Zama)
Smart Contract	HealthLocker contract (address in config)
The application validates the connected network and prompts users to switch if they're on the wrong chain. For detailed network configuration, see Network Configuration.

Sources: 
frontend/src/App.tsx
1-24
 
frontend/index.html
11-13

How to Use This Wiki
This wiki is organized into the following major sections:

Section 1: Introduction

1.1 Project Structure: Directory layout and file organization
1.2 Getting Started: Installation and setup instructions
Section 2: Architecture

2 Architecture Overview: High-level system design
2.1 Data Flow: How data moves through the system
2.2 Security Model: Privacy and security guarantees
Section 3: Frontend

3 Frontend Application: React application overview
3.1 Build Configuration: TypeScript, Vite, ESLint setup
3.2 Routing and Navigation: Router configuration
3.3 Pages: Home and Dashboard pages
3.4 Components: Reusable UI components
3.5 Hooks and State Management: Custom React hooks
3.6 Styling and Theming: CSS architecture
Section 4: FHEVM Integration

4 FHEVM Integration: Privacy-preserving encryption system
4.1 FHEVM SDK Package: Standalone SDK details
4.2 Initialization and Setup: SDK bootstrapping process
4.3 Encryption Operations: Client-side encryption flow
4.4 Decryption Operations: Authorized decryption flow
Section 5: Web3 Integration

5 Web3 Integration: Blockchain connectivity
5.1 Wallet Connection: RainbowKit + Wagmi
5.2 Smart Contract Interaction: Contract calls and transactions
5.3 Network Configuration: Sepolia testnet setup
Section 6: Development

6 Development Guide: Contributing to the project
6.1 Code Quality and Linting: ESLint configuration
6.2 TypeScript Configuration: Type system setup
6.3 Testing Strategy: Test configuration
Section 7: API Reference

7 API Reference: Function and hook documentation
7.1 FHEVM Library Functions: lib/fhevm.js API
7.2 Custom Hooks API: Hook interfaces and usage
Sources: 
frontend/src/App.tsx
1-24
 
frontend/package.json
1-40

Dependencies Overview
The application has two categories of dependencies:

Production Dependencies
Core runtime dependencies for the application:

Package	Purpose	Used In
@rainbow-me/rainbowkit	Wallet connection UI	Components, Navbar
@tanstack/react-query	Async state management	Wagmi integration
fhevm-sdk	FHEVM operations	lib/fhevm.js, hooks
framer-motion	Animations	UI components
jspdf	PDF generation	Export functionality
react + react-dom	UI framework	Entire application
react-icons	Icon library	UI components
react-router-dom	Routing	App.tsx, navigation
viem	Ethereum client	Contract interactions
wagmi	React hooks for Ethereum	Blockchain operations
Development Dependencies
Build-time and development tooling:

Package	Purpose
@vitejs/plugin-react	React support for Vite
typescript	Type checking
eslint + plugins	Code quality
vite	Build tool
For the complete dependency list with versions, see package.json.

Sources: 
frontend/package.json
12-39

External Services
The application depends on the following external services:









Service Dependencies:

Zama RelayerSDK CDN 
`index.html
11-13
: External JavaScript library for FHE operations
Sepolia Testnet: Ethereum testnet with FHEVM support for smart contract deployment
HealthLocker Contract: On-chain smart contract for encrypted health record storage
Sources: 
frontend/index.html
11-13
 
frontend/src/App.tsx
1-24

Security Properties
The application implements the following security guarantees:

Property	Implementation	Code Location
Client-Side Encryption	Data encrypted in browser before transmission	lib/fhevm.js
Zero-Knowledge	Blockchain never sees plaintext	FHEVM SDK
User Authorization	EIP-712 signatures for decryption	Decryption flow
Network Validation	Chain ID check before operations	Wagmi hooks
Wallet Security	No private key exposure	RainbowKit + Wagmi
Homomorphic Operations	Compute on encrypted data	Smart contract + FHEVM
For detailed security architecture, see Security Model.

Sources: 
frontend/src/App.tsx
4
 
frontend/index.html
11-13
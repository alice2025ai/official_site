# AliceAI Frontend

Frontend application for AliceAI, an AI Agent for blockchain interactions.

## Project Overview

This repository contains the frontend application for AliceAI, a decentralized AI agent platform built on blockchain technology. The project is built using Next.js, React, and integrates with various Web3 technologies for blockchain interactions.


## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/alice2025ai/official_site.git
   cd official_site
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Configuration

Configure the application by modifying the configuration files:

1. Update API and blockchain settings in `app/config.ts`:
   - `SERVER_API`: Backend API URL
   - `WEB3_RPC`: Blockchain RPC endpoint


## Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000.

## Building for Production

Build the application for production:

```bash
npm run build
# or
yarn build
```

## Starting Production Server

Start the production server:

```bash
npm run start
# or
yarn start
```

## Testing

Run linting tests:

```bash
npm run lint
# or
yarn lint
```

## Project Structure

- `/app`: Main application code
  - `/components`: Reusable UI components
  - `/hooks`: Custom React hooks
  - `/context`: React context providers
  - `/services`: API and service integrations
  - `/shares`: Shared utilities and helpers
- `/contracts`: Smart contract ABIs and interfaces
- `/public`: Static assets

## Technologies

- Next.js
- React
- TypeScript
- TailwindCSS
- Three.js for 3D rendering
- Rainbow Kit and Wagmi for wallet integration
- Viem and Ethers.js for blockchain interactions

## License

[Specify license information here]

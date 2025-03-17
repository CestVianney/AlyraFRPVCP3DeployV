import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    sepolia
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Alyra Voting',
  projectId: '6Bb33867C1f51ccE93C9882dF01FAB32a209Fb54',
  chains: [
    sepolia,
  ],
  ssr: true,
});


import { ethers } from "ethers";

// Polygon Network Contract Addresses
const FILM_MINTER_ADDRESS = "0x61c6a87659a28faeff906ed86e7ab9cb";
const MARKETPLACE_ADDRESS = "0x2b75cbcea26c7d0eef8f35e929b2b381";
const SMART_WALLETS_ADDRESS = "0xaf669c351d4e94483c560bbc3241cc1357d22ce2";

// Polygon Chain ID
const POLYGON_CHAIN_ID = 137;

const FILM_MINTER_ABI = [
  "function mint(address to, uint256 tokenId, string memory uri) public payable",
  "function mintWithPrice(address to, uint256 tokenId, string memory uri, uint256 price) public payable",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function totalSupply() public view returns (uint256)"
];

const MARKETPLACE_ABI = [
  "function listFilm(uint256 tokenId, uint256 price) public",
  "function buyFilm(uint256 tokenId) public payable",
  "function getFilmPrice(uint256 tokenId) public view returns (uint256)",
  "function isFilmListed(uint256 tokenId) public view returns (bool)"
];

const SMART_WALLETS_ABI = [
  "function createWallet(address owner) public returns (address)",
  "function getWallet(address owner) public view returns (address)",
  "function isWalletCreated(address owner) public view returns (bool)"
];

export const switchToPolygon = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Ethereum provider not found");
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${POLYGON_CHAIN_ID.toString(16)}` }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${POLYGON_CHAIN_ID.toString(16)}`,
              chainName: 'Polygon Mainnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: ['https://polygon-rpc.com/'],
              blockExplorerUrls: ['https://polygonscan.com/'],
            },
          ],
        });
      } catch (addError) {
        throw new Error("Failed to add Polygon network");
      }
    } else {
      throw switchError;
    }
  }
};

export const getFilmMinterContract = (signer?: ethers.Signer) => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Ethereum provider not found");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  
  return new ethers.Contract(
    FILM_MINTER_ADDRESS,
    FILM_MINTER_ABI,
    signer || provider
  );
};

export const getMarketplaceContract = (signer?: ethers.Signer) => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Ethereum provider not found");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  
  return new ethers.Contract(
    MARKETPLACE_ADDRESS,
    MARKETPLACE_ABI,
    signer || provider
  );
};

export const getSmartWalletsContract = (signer?: ethers.Signer) => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Ethereum provider not found");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  
  return new ethers.Contract(
    SMART_WALLETS_ADDRESS,
    SMART_WALLETS_ABI,
    signer || provider
  );
};

// Legacy function for backward compatibility
export const getFilmNFTContract = getFilmMinterContract;

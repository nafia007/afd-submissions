import { useEffect, useState } from 'react';
import { calculateVoteResults, updateProposalNFT } from '@/integrations/supabase/voting';
import type { VoteResults, NFTMintResult } from '@/types/voting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Upload, CheckCircle, AlertCircle, Target } from 'lucide-react';

interface NFTMintingProps {
  proposalId: string;
}

export default function NFTMinting({ proposalId }: NFTMintingProps) {
  const [results, setResults] = useState<VoteResults | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [minting, setMinting] = useState(false);
  const [mintResult, setMintResult] = useState<NFTMintResult | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      const voteResults = await calculateVoteResults(proposalId);
      setResults(voteResults);
    };

    fetchResults();
  }, [proposalId]);

  const handleUploadToIPFS = async () => {
    if (!screenshot) return;

    setUploading(true);

    try {
      // In a real implementation, this would upload to IPFS (Pinata, NFT.Storage, etc.)
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIpfsHash('QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb');
      
      toast({
        title: 'Upload Successful',
        description: 'Screenshot uploaded to IPFS!',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload screenshot to IPFS.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleMintNFT = async () => {
    if (!ipfsHash || !results) return;

    setMinting(true);

    try {
      // In a real implementation, this would interact with the smart contract
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result: NFTMintResult = {
        tokenId: '12345',
        transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
        ipfsHash,
        metadataHash: 'QmXYZ123...',
      };

      // Update proposal with NFT info
      await updateProposalNFT(proposalId, {
        nft_minted: true,
        nft_token_id: result.tokenId,
        nft_ipfs_hash: result.ipfsHash,
        nft_transaction_hash: result.transactionHash,
        screenshot_url: `ipfs://${ipfsHash}`,
      });

      setMintResult(result);
      toast({
        title: 'NFT Minted Successfully!',
        description: `Token ID: ${result.tokenId}`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast({
        title: 'Minting Failed',
        description: 'Failed to mint NFT. Please try again.',
        variant: 'destructive',
      });
    }

    setMinting(false);
  };

  return (
    <Card className="max-w-4xl mx-auto backdrop-blur-xl bg-card/40 border-2 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Mint NFT Proof
        </CardTitle>
      </CardHeader>
      <CardContent>
        {results && (
          <div className="bg-card/60 p-6 rounded-lg mb-6 border border-border/50">
            <h3 className="text-xl mb-4 text-foreground">Vote Results</h3>
            <div className="space-y-3">
              {Object.entries(results.results).map(([choice, count]) => (
                <div key={choice} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">{choice}</span>
                    <span className="text-muted-foreground">
                      {count} ({results.percentages[choice]}%)
                    </span>
                  </div>
                  <Progress 
                    value={results.percentages[choice]} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
            <p className="mt-4 text-muted-foreground">Total Votes: {results.total}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">
              Upload Screenshot
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
              className="bg-card/60 border border-border/50 rounded-lg p-2 w-full"
            />
            {screenshot && (
              <div className="mt-2 text-sm text-muted-foreground">
                Selected: {screenshot.name}
              </div>
            )}
          </div>

          <Button
            onClick={handleUploadToIPFS}
            disabled={!screenshot || uploading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload to IPFS
              </>
            )}
          </Button>

          {ipfsHash && (
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-primary flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                IPFS Hash: {ipfsHash}
              </p>
            </div>
          )}

          <Button
            onClick={handleMintNFT}
            disabled={!ipfsHash || minting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {minting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Minting...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Mint NFT
              </>
            )}
          </Button>

          {mintResult && (
            <div className="bg-green-50/10 p-6 rounded-lg border border-green-500/20">
              <h4 className="font-semibold text-green-500 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                NFT Minted Successfully!
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Token ID:</span>
                  <span className="font-mono text-sm text-foreground">{mintResult.tokenId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Transaction Hash:</span>
                  <span className="font-mono text-sm text-foreground">{mintResult.transactionHash}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">IPFS Hash:</span>
                  <span className="font-mono text-sm text-foreground">{mintResult.ipfsHash}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

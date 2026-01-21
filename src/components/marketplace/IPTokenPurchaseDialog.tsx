import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { usePurchaseIPTokens } from "@/hooks/useFilmIPTokens";
import { Loader2, TrendingUp } from "lucide-react";
import { FilmIPToken } from "@/hooks/useFilmIPTokens";

interface IPTokenPurchaseDialogProps {
  filmTitle: string;
  filmId: string;
  ipToken: FilmIPToken;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IPTokenPurchaseDialog = ({ 
  filmTitle, 
  filmId, 
  ipToken, 
  open, 
  onOpenChange 
}: IPTokenPurchaseDialogProps) => {
  const [tokenAmount, setTokenAmount] = useState<string>("1");
  const purchaseTokens = usePurchaseIPTokens();

  const amount = parseInt(tokenAmount) || 0;
  const totalCost = amount * ipToken.token_price;
  const ownershipPercentage = ((amount / ipToken.total_supply) * 100).toFixed(2);

  const handlePurchase = async () => {
    if (amount <= 0 || amount > ipToken.available_tokens) return;

    await purchaseTokens.mutateAsync({
      filmId,
      tokenAmount: amount
    });

    onOpenChange(false);
    setTokenAmount("1");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invest in IP Tokens</DialogTitle>
          <DialogDescription>
            Purchase tokens for "{filmTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Number of Tokens</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              max={ipToken.available_tokens}
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <p className="text-sm text-muted-foreground">
              Available: {ipToken.available_tokens.toLocaleString()} tokens
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per token:</span>
              <span className="font-medium">${ipToken.token_price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tokens:</span>
              <span className="font-medium">{amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ownership:</span>
              <span className="font-medium">{ownershipPercentage}%</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between">
              <span className="font-semibold">Total Cost:</span>
              <span className="text-xl font-bold text-primary">
                ${totalCost.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Revenue Share</p>
              <p className="text-muted-foreground">
                Earn {ipToken.revenue_share_percentage}% of film revenues proportional to your ownership
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={purchaseTokens.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={
              amount <= 0 || 
              amount > ipToken.available_tokens || 
              purchaseTokens.isPending
            }
          >
            {purchaseTokens.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Invest $${totalCost.toFixed(2)}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IPTokenPurchaseDialog;

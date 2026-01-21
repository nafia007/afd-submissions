import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film } from "@/types/film";
import { usePurchaseFilm } from "@/hooks/useFilmPurchase";
import { Loader2, Play, ShoppingCart } from "lucide-react";

interface PurchaseDialogProps {
  film: Film;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PurchaseDialog = ({ film, open, onOpenChange }: PurchaseDialogProps) => {
  const [selectedType, setSelectedType] = useState<'rent' | 'buy' | null>(null);
  const purchaseFilm = usePurchaseFilm();

  const rentPrice = parseFloat(film.price) * 0.3; // 30% of full price for rental
  const buyPrice = parseFloat(film.price);

  const handlePurchase = async () => {
    if (!selectedType) return;

    const price = selectedType === 'rent' ? rentPrice : buyPrice;
    
    await purchaseFilm.mutateAsync({
      filmId: film.id,
      purchaseType: selectedType,
      price
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Options</DialogTitle>
          <DialogDescription>
            Choose how you'd like to access "{film.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedType === 'rent'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setSelectedType('rent')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Play className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="font-semibold">Rent</h4>
                  <p className="text-sm text-muted-foreground">48 hours access</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">${rentPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedType === 'buy'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setSelectedType('buy')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="font-semibold">Buy</h4>
                  <p className="text-sm text-muted-foreground">Unlimited access</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">${buyPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={purchaseFilm.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={!selectedType || purchaseFilm.isPending}
          >
            {purchaseFilm.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Purchase for $${selectedType === 'rent' ? rentPrice.toFixed(2) : buyPrice.toFixed(2)}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;

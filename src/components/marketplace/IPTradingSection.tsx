import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Coins, Film } from "lucide-react";
import { Link } from "react-router-dom";
import { useAllIPTokens } from "@/hooks/useFilmIPTokens";
import IPTokenPurchaseDialog from "./IPTokenPurchaseDialog";
import { Skeleton } from "@/components/ui/skeleton";

const IPTradingSection = () => {
  const { data: ipTokens, isLoading } = useAllIPTokens();
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleInvestClick = (token: any) => {
    setSelectedToken(token);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!ipTokens || ipTokens.length === 0) {
    return (
      <div className="text-center py-16">
        <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No IP Tokens Available</h3>
        <p className="text-muted-foreground">
          Check back later for investment opportunities in film IP tokens.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ipTokens.map((token) => {
          const circulatingPercentage = ((token.total_supply - token.available_tokens) / token.total_supply) * 100;
          const film = token.films;

          return (
            <Card key={token.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/film/${film.id}`}>
                      <CardTitle className="text-lg hover:text-primary transition-colors">
                        {film.title}
                      </CardTitle>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {token.token_symbol}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {token.available_tokens.toLocaleString()} available
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${token.token_price}</span>
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {token.total_supply.toLocaleString()} total
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sold</span>
                    <span className="font-medium">{circulatingPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={circulatingPercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-t">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="w-3 h-3" />
                      <span className="text-xs">Revenue Share</span>
                    </div>
                    <p className="text-lg font-semibold">{token.revenue_share_percentage}%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">Film Views</span>
                    </div>
                    <p className="text-lg font-semibold">{film.views || 0}</p>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleInvestClick(token)}
                >
                  Invest in IP
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedToken && (
        <IPTokenPurchaseDialog
          filmTitle={selectedToken.films.title}
          filmId={selectedToken.film_id}
          ipToken={selectedToken}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
};

export default IPTradingSection;
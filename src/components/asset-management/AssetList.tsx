
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, TrendingUp, DollarSign, Eye, Edit } from "lucide-react";

interface Asset {
  id: string;
  title: string;
  description: string;
  director: string;
  price: string;
  created_at: string;
}

interface AssetListProps {
  assets: Asset[];
  isLoading: boolean;
  onRefetch: () => void;
}

const AssetList = ({ assets, isLoading, onRefetch }: AssetListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getAssetType = (description: string) => {
    if (description.includes("Real Estate")) return "Real Estate";
    if (description.includes("Commodities")) return "Commodities";
    if (description.includes("Art")) return "Art & Collectibles";
    return "Film Asset";
  };

  const extractValue = (description: string) => {
    const match = description.match(/Total Value: \$([0-9,]+)/);
    return match ? match[1] : "N/A";
  };

  const extractYield = (description: string) => {
    const match = description.match(/Yield Rate: ([0-9.]+)%/);
    return match ? `${match[1]}%` : "N/A";
  };

  const extractLocation = (description: string) => {
    const match = description.match(/Location: ([^\n]+)/);
    return match ? match[1] : "N/A";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Asset Portfolio</h2>
        <Button variant="outline" onClick={onRefetch}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-6">
        {assets.map((asset) => (
          <Card key={asset.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 mb-2">
                    <Building className="w-5 h-5 text-primary" />
                    {asset.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">
                      {getAssetType(asset.description)}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {extractLocation(asset.description)}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Asset Value</p>
                  <p className="font-semibold flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${extractValue(asset.description)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Token Price</p>
                  <p className="font-semibold">{asset.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Yield</p>
                  <p className="font-semibold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    {extractYield(asset.description)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Custodian</p>
                  <p className="font-semibold">{asset.director}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {asset.description.split('\n')[0]}
              </p>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Manage Tokens
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {assets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Assets Found</h3>
            <p className="text-muted-foreground">
              Start by tokenizing your first real-world asset.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssetList;

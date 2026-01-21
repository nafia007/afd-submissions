
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { X, Upload, MapPin, DollarSign, FileText } from "lucide-react";

interface AssetCreationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface AssetFormData {
  name: string;
  description: string;
  assetType: string;
  location: string;
  totalValue: number;
  tokenSupply: number;
  pricePerToken: number;
  minimumInvestment: number;
  yieldRate: number;
  custodian: string;
  legalDocuments: string;
}

const AssetCreationForm = ({ onClose, onSuccess }: AssetCreationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<AssetFormData>();

  const totalValue = watch('totalValue');
  const tokenSupply = watch('tokenSupply');

  // Auto-calculate price per token
  const calculatePricePerToken = () => {
    if (totalValue && tokenSupply) {
      const price = totalValue / tokenSupply;
      setValue('pricePerToken', Number(price.toFixed(2)));
    }
  };

  const onSubmit = async (data: AssetFormData) => {
    setIsSubmitting(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to create an asset");
        return;
      }

      // For now, we'll store in the films table as a placeholder
      // In production, this would go to a dedicated RWA assets table
      const { error } = await supabase
        .from('films')
        .insert({
          title: data.name,
          description: `${data.description}\n\nAsset Type: ${data.assetType}\nLocation: ${data.location}\nTotal Value: $${data.totalValue.toLocaleString()}\nToken Supply: ${data.tokenSupply}\nYield Rate: ${data.yieldRate}%`,
          director: data.custodian,
          price: `$${data.pricePerToken}`,
          film_url: data.legalDocuments,
          user_id: user.id
        });

      if (error) throw error;

      toast.success("Asset tokenization initiated successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Error creating asset:", error);
      toast.error("Failed to create asset", {
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Tokenize New Asset
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div>
                <Label htmlFor="name">Asset Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Asset name is required" })}
                  placeholder="e.g., Manhattan Office Building"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="assetType">Asset Type</Label>
                <Select onValueChange={(value) => setValue("assetType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="commodities">Commodities</SelectItem>
                    <SelectItem value="art">Art & Collectibles</SelectItem>
                    <SelectItem value="securities">Securities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  {...register("location", { required: "Location is required" })}
                  placeholder="e.g., New York, NY"
                />
                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
              </div>

              <div>
                <Label htmlFor="custodian">Custodian/Manager</Label>
                <Input
                  id="custodian"
                  {...register("custodian", { required: "Custodian is required" })}
                  placeholder="e.g., ABC Property Management"
                />
                {errors.custodian && <p className="text-sm text-destructive">{errors.custodian.message}</p>}
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Financial Details
              </h3>

              <div>
                <Label htmlFor="totalValue">Total Asset Value ($)</Label>
                <Input
                  id="totalValue"
                  type="number"
                  {...register("totalValue", { 
                    required: "Total value is required",
                    min: { value: 1, message: "Value must be greater than 0" }
                  })}
                  placeholder="1000000"
                  onChange={(e) => {
                    setValue("totalValue", Number(e.target.value));
                    calculatePricePerToken();
                  }}
                />
                {errors.totalValue && <p className="text-sm text-destructive">{errors.totalValue.message}</p>}
              </div>

              <div>
                <Label htmlFor="tokenSupply">Total Token Supply</Label>
                <Input
                  id="tokenSupply"
                  type="number"
                  {...register("tokenSupply", { 
                    required: "Token supply is required",
                    min: { value: 1, message: "Supply must be greater than 0" }
                  })}
                  placeholder="1000"
                  onChange={(e) => {
                    setValue("tokenSupply", Number(e.target.value));
                    calculatePricePerToken();
                  }}
                />
                {errors.tokenSupply && <p className="text-sm text-destructive">{errors.tokenSupply.message}</p>}
              </div>

              <div>
                <Label htmlFor="pricePerToken">Price Per Token ($)</Label>
                <Input
                  id="pricePerToken"
                  type="number"
                  step="0.01"
                  {...register("pricePerToken", { 
                    required: "Price per token is required",
                    min: { value: 0.01, message: "Price must be greater than 0" }
                  })}
                  placeholder="1000"
                  readOnly
                />
                {errors.pricePerToken && <p className="text-sm text-destructive">{errors.pricePerToken.message}</p>}
              </div>

              <div>
                <Label htmlFor="minimumInvestment">Minimum Investment ($)</Label>
                <Input
                  id="minimumInvestment"
                  type="number"
                  {...register("minimumInvestment", { 
                    required: "Minimum investment is required",
                    min: { value: 1, message: "Minimum must be greater than 0" }
                  })}
                  placeholder="1000"
                />
                {errors.minimumInvestment && <p className="text-sm text-destructive">{errors.minimumInvestment.message}</p>}
              </div>

              <div>
                <Label htmlFor="yieldRate">Expected Annual Yield (%)</Label>
                <Input
                  id="yieldRate"
                  type="number"
                  step="0.01"
                  {...register("yieldRate", { 
                    required: "Yield rate is required",
                    min: { value: 0, message: "Yield must be non-negative" }
                  })}
                  placeholder="5.5"
                />
                {errors.yieldRate && <p className="text-sm text-destructive">{errors.yieldRate.message}</p>}
              </div>
            </div>
          </div>

          {/* Description and Documents */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Asset Description</Label>
              <Textarea
                id="description"
                {...register("description", { required: "Description is required" })}
                placeholder="Detailed description of the asset, its features, and investment potential..."
                rows={4}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div>
              <Label htmlFor="legalDocuments" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Legal Documents URL
              </Label>
              <Input
                id="legalDocuments"
                {...register("legalDocuments", { required: "Legal documents URL is required" })}
                placeholder="https://documents.example.com/asset-legal-docs"
              />
              {errors.legalDocuments && <p className="text-sm text-destructive">{errors.legalDocuments.message}</p>}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Creating Asset..." : "Tokenize Asset"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AssetCreationForm;

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface BrandAd {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
  description?: string;
  position: number;
}

export function BrandAdsSidebar() {
  const { data: ads = [] } = useQuery<BrandAd[]>({
    queryKey: ['brand-ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_ads')
        .select('*')
        .eq('active', true)
        .order('position', { ascending: true });
      if (error) throw error;
      return data as BrandAd[];
    },
  });

  if (ads.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        Sponsored
      </h3>
      
      {ads.map((ad) => (
        <Card key={ad.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            {ad.link_url ? (
              <a
                href={ad.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {ad.title}
                    </h4>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  {ad.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {ad.description}
                    </p>
                  )}
                </div>
              </a>
            ) : (
              <>
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 space-y-2">
                  <h4 className="font-medium text-sm">{ad.title}</h4>
                  {ad.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {ad.description}
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
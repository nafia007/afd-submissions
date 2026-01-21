import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Star, Clock, TrendingUp } from "lucide-react";
import StreamingFilmGrid from "./StreamingFilmGrid";
import IPTradingSection from "./IPTradingSection";
import { Film as FilmType } from "@/types/film";
interface MarketplaceTabsProps {
  films: FilmType[];
  isLoading: boolean;
  onDelete: (filmId: string) => Promise<void>;
  userProfile: {
    id: string;
    role: 'admin' | 'user';
  } | null;
}
const MarketplaceTabs = ({
  films,
  isLoading,
  onDelete,
  userProfile
}: MarketplaceTabsProps) => {
  return <Tabs defaultValue="all-films" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all-films" className="gap-2">
          <Film className="w-4 h-4" />
          Stream
        </TabsTrigger>
        <TabsTrigger value="ip-trading" className="gap-2">
          <TrendingUp className="w-4 h-4" />
          IP Trading
        </TabsTrigger>
        <TabsTrigger value="featured" className="gap-2">
          <Star className="w-4 h-4" />
          Featured
        </TabsTrigger>
        <TabsTrigger value="recently-added" className="gap-2">
          <Clock className="w-4 h-4" />
          Recent
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all-films" className="mt-6">
        <StreamingFilmGrid films={films} isLoading={isLoading} userProfile={userProfile} onDelete={onDelete} />
      </TabsContent>

      <TabsContent value="ip-trading" className="mt-6">
        <IPTradingSection />
      </TabsContent>

      <TabsContent value="featured" className="mt-6">
        <StreamingFilmGrid films={films.slice(0, 6)} isLoading={isLoading} userProfile={userProfile} onDelete={onDelete} />
      </TabsContent>

      <TabsContent value="recently-added" className="mt-6">
        <StreamingFilmGrid films={films.slice(0, 8)} isLoading={isLoading} userProfile={userProfile} onDelete={onDelete} />
      </TabsContent>
    </Tabs>;
};
export default MarketplaceTabs;
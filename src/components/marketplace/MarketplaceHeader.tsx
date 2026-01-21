import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
interface MarketplaceHeaderProps {
  onSubmitClick: () => void;
  showSubmissionForm: boolean;
  userProfile: {
    id: string;
    role: 'admin' | 'user';
  } | null;
}
const MarketplaceHeader = ({
  onSubmitClick,
  showSubmissionForm,
  userProfile
}: MarketplaceHeaderProps) => {
  return <div className="flex justify-between items-start">
      <div>
        
        <p className="text-foreground/70 max-w-2xl">
          Watch exclusive films curated by our community. Stream high-quality content 
          from emerging and established filmmakers around the world.
        </p>
      </div>
      {userProfile?.role === 'admin' && <Button onClick={onSubmitClick} className="gap-2">
          <Plus className="w-4 h-4" />
          {showSubmissionForm ? "Close Form" : "Add Film"}
        </Button>}
    </div>;
};
export default MarketplaceHeader;
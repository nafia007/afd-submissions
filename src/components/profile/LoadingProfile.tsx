
import { Loader2 } from "lucide-react";

const LoadingProfile = () => {
  return (
    <div className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-foreground/70">Loading profile...</p>
      </div>
    </div>
  );
};

export default LoadingProfile;

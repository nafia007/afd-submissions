
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface ProfileInfoProps {
  email: string | undefined;
  bio: string | null;
  profileImageUrl?: string | null;
}

const ProfileInfo = ({ email, bio, profileImageUrl }: ProfileInfoProps) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Filmmaker Info</CardTitle>
        <CardDescription>Your public profile information</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Avatar className="w-32 h-32">
          <AvatarImage src={profileImageUrl || ""} />
          <AvatarFallback className="bg-accent/10 text-accent">
            <User className="w-10 h-10" />
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="text-xl font-bold">{email || "Filmmaker"}</h3>
          <p className="text-sm text-foreground/70">
            {bio ? 
              (bio.length > 100 ? 
                bio.substring(0, 100) + "..." : 
                bio) : 
              "No bio yet"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;

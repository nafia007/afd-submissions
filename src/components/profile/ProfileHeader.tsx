
import { Button } from "@/components/ui/button";
import { Film as FilmIcon } from "lucide-react";

interface ProfileHeaderProps {
  showSubmissionForm: boolean;
  setShowSubmissionForm: (show: boolean) => void;
}

const ProfileHeader = ({ showSubmissionForm, setShowSubmissionForm }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-heading font-bold">Filmmaker Profile</h1>
        <p className="text-foreground/70 mt-2">Manage your profile and films</p>
      </div>
      <Button 
        onClick={() => setShowSubmissionForm(!showSubmissionForm)}
        className="gap-2"
      >
        <FilmIcon className="w-4 h-4" />
        {showSubmissionForm ? "Hide Submission Form" : "Submit New Film"}
      </Button>
    </div>
  );
};

export default ProfileHeader;

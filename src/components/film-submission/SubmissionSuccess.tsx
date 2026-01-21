
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

interface SubmissionSuccessProps {
  filmTitle: string
  onViewMarketplace: () => void
}

export const SubmissionSuccess = ({ filmTitle, onViewMarketplace }: SubmissionSuccessProps) => {
  const navigate = useNavigate()

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-xl">Submission Successful!</CardTitle>
        <CardDescription>
          "{filmTitle}" has been submitted to the marketplace
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          Your film is now available for viewing and investment in the marketplace.
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={onViewMarketplace} className="w-full">
            View in Marketplace
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/creator-dashboard")}
            className="w-full"
          >
            Go to Creator Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

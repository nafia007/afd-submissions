
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Upload, Link, Film } from "lucide-react"
import { FileSubmissionForm } from "@/components/film-submission/FileSubmissionForm"
import { UrlSubmissionForm } from "@/components/film-submission/UrlSubmissionForm"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const FilmSubmission = () => {
  const [activeTab, setActiveTab] = useState("url")
  const navigate = useNavigate()

  const handleSubmissionSuccess = () => {
    toast.success("Film submitted successfully!", {
      description: "Your film has been added to the marketplace.",
    })
    // Navigate to marketplace after successful submission
    setTimeout(() => {
      navigate("/marketplace")
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Submit Your Film</h1>
          <p className="text-lg text-muted-foreground">
            Share your creative work with the FilmChain community and turn your film into a tradeable digital asset
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="w-6 h-6" />
              Film Submission Portal
            </CardTitle>
            <CardDescription>
              Choose how you'd like to submit your film - either upload directly or provide a URL
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  URL Submission
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  File Upload
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="mt-6">
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">URL Submission</h3>
                    <p className="text-sm text-muted-foreground">
                      Perfect for films hosted on platforms like Vimeo, YouTube, or your own streaming service. 
                      Provide a direct link to your film for preview purposes.
                    </p>
                  </div>
                  <UrlSubmissionForm onSuccess={handleSubmissionSuccess} />
                </div>
              </TabsContent>
              
              <TabsContent value="file" className="mt-6">
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Direct File Upload</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload your film file directly to our secure storage. 
                      Supported formats: MP4, MOV, AVI (max 2GB per file).
                    </p>
                  </div>
                  <FileSubmissionForm onSuccess={handleSubmissionSuccess} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Security & Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your films are stored securely and you retain all intellectual property rights. 
                Create NFT tokens to represent ownership and enable trading.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Marketplace Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Once submitted, your film will be available in the marketplace for viewing and 
                potential investment opportunities.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Revenue Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set your price and participate in our decentralized revenue sharing model. 
                Earn from both direct sales and secondary market trades.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default FilmSubmission

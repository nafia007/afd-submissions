
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileUp } from "lucide-react";
import AFDSubmissions from "@/components/afd/AFDSubmissions";

const AFD = () => (
  <div className="min-h-screen bg-background pb-12">
    <div className="container mx-auto pt-20 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">AFD Submissions</h1>
      <div className="mb-8 max-w-2xl mx-auto text-center">
        <Card>
          <CardHeader>
            <CardTitle>For African Film DAO Filmmakers</CardTitle>
            <CardDescription>
              Submit your log-line and one page synopsis for projects across four development stages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Pitch deck including genre, format, duration, country of origin, country of production, one page synopsis, maximum one page director's motivation, core creative team, budget including finances already raised and all other relevant information.
            </p>
          </CardContent>
        </Card>
      </div>
      <AFDSubmissions />
    </div>
  </div>
);

export default AFD;

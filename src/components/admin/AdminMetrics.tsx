import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Upload, CheckCircle, XCircle, Clock } from "lucide-react";

interface AdminMetricsProps {
  users: any[];
  submissions: any[];
}

export const AdminMetrics = ({ users, submissions }: AdminMetricsProps) => {
  const totalUsers = users?.length || 0;
  const totalSubmissions = submissions?.length || 0;
  const pendingSubmissions = submissions?.filter(s => s.approval_status === 'pending').length || 0;
  const approvedSubmissions = submissions?.filter(s => s.approval_status === 'approved').length || 0;
  const rejectedSubmissions = submissions?.filter(s => s.approval_status === 'rejected').length || 0;

  const metrics = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Total Submissions",
      value: totalSubmissions,
      icon: Upload,
      color: "text-accent"
    },
    {
      title: "Pending Review",
      value: pendingSubmissions,
      icon: Clock,
      color: "text-muted-foreground"
    },
    {
      title: "Approved",
      value: approvedSubmissions,
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      title: "Rejected",
      value: rejectedSubmissions,
      icon: XCircle,
      color: "text-red-500"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
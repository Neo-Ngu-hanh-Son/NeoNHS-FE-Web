import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, FileText, Users, XCircle } from "lucide-react"
import { AdminTemplateStats } from "./templates/types"

interface TemplateStatsCardsProps {
  stats: AdminTemplateStats
}

export function TemplateStatsCards({ stats }: TemplateStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Templates</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <FileText className="w-8 h-8 text-primary" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <Clock className="w-8 h-8 text-amber-600" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-600" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <XCircle className="w-8 h-8 text-red-600" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Draft</p>
            <p className="text-2xl font-bold text-muted-foreground">{stats.draft}</p>
          </div>
          <Users className="w-8 h-8 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  )

}
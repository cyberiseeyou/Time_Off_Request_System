import { DashboardHeader } from "@/components/dashboard-header"
import { TimeOffTable } from "@/components/time-off-table"

// Sample data - in a real app, this would come from an API
const sampleRequests = [
  {
    id: 1,
    employeeName: "Jane Doe",
    startDate: "2025-10-01",
    endDate: "2025-10-03",
    reason: "Family vacation",
    submittedAt: "2025-09-19T10:00:00Z",
  },
  {
    id: 2,
    employeeName: "John Smith",
    startDate: "2025-10-15",
    endDate: "2025-10-15",
    reason: "Medical appointment",
    submittedAt: "2025-09-18T14:30:00Z",
  },
  {
    id: 3,
    employeeName: "Sarah Johnson",
    startDate: "2025-11-01",
    endDate: "2025-11-05",
    reason: "Personal time",
    submittedAt: "2025-09-17T09:15:00Z",
  },
  {
    id: 4,
    employeeName: "Mike Wilson",
    startDate: "2025-10-20",
    endDate: "2025-10-22",
    reason: "Wedding anniversary",
    submittedAt: "2025-09-16T16:45:00Z",
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground text-balance">Request Dashboard</h1>
        </div>

        <TimeOffTable requests={sampleRequests} />
      </main>
    </div>
  )
}
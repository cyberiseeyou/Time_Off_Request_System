import { format } from "date-fns"

interface TimeOffRequest {
  id: number
  employeeName: string
  startDate: string
  endDate: string
  reason: string
  submittedAt: string
}

interface TimeOffTableProps {
  requests: TimeOffRequest[]
}

export function TimeOffTable({ requests }: TimeOffTableProps) {
  if (requests.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground text-lg">You have no new time-off requests.</p>
      </div>
    )
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = format(new Date(startDate), "MMM d, yyyy")
    const end = format(new Date(endDate), "MMM d, yyyy")
    return startDate === endDate ? start : `${start} - ${end}`
  }

  const formatSubmittedDate = (submittedAt: string) => {
    return format(new Date(submittedAt), "MMM d, yyyy")
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Employee Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Dates Requested</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Reason</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Submitted On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.map((request, index) => (
              <tr key={request.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <td className="px-6 py-4 text-sm font-medium text-foreground">{request.employeeName}</td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {formatDateRange(request.startDate, request.endDate)}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{request.reason}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{formatSubmittedDate(request.submittedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

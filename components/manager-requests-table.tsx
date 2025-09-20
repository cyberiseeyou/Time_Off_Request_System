'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CalendarDays, User, Clock, Loader2 } from 'lucide-react'
import type { TimeOffRequest, ApiResponse } from '@time-off-system/shared-types'

interface ManagerRequestsTableProps {
  managerId?: number
}

export default function ManagerRequestsTable({ managerId }: ManagerRequestsTableProps) {
  const [requests, setRequests] = useState<TimeOffRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [managerId])

  const fetchRequests = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/manager/requests', {
        method: 'GET',
        credentials: 'include'
      })

      const result: ApiResponse<TimeOffRequest[]> = await response.json()

      if (result.success && result.data) {
        setRequests(result.data)
      } else {
        setError(result.error || 'Failed to load requests')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const startFormatted = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })

    const endFormatted = end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    if (startDate === endDate) {
      return endFormatted
    }

    return `${startFormatted} - ${endFormatted}`
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    return diffDays === 1 ? '1 day' : `${diffDays} days`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarDays className="h-5 w-5 mr-2" />
            Time-off Requests
          </CardTitle>
          <CardDescription>Loading your team's time-off requests...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarDays className="h-5 w-5 mr-2" />
            Time-off Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchRequests} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarDays className="h-5 w-5 mr-2" />
          Time-off Requests
        </CardTitle>
        <CardDescription>
          {requests.length === 0
            ? 'No requests found'
            : `${requests.length} request${requests.length !== 1 ? 's' : ''} from your team`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No time-off requests yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Requests from your team will appear here
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        {request.employee_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDateRange(request.start_date, request.end_date)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {calculateDuration(request.start_date, request.end_date)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {request.reason || 'No reason provided'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {request.created_at}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          Deny
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
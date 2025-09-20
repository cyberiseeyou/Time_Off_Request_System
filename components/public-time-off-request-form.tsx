"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { TimeOffRequestForm, Manager, ApiResponse } from "@time-off-system/shared-types"

interface FormData {
  employee_name: string
  start_date: string
  end_date: string
  reason: string
}

interface FormState {
  isLoading: boolean
  isSubmitted: boolean
  error: string | null
  manager: Manager | null
}

export function PublicTimeOffRequestForm() {
  const searchParams = useSearchParams()
  const managerId = searchParams.get("manager_id")

  const [formData, setFormData] = useState<FormData>({
    employee_name: "",
    start_date: "",
    end_date: "",
    reason: "",
  })

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    isSubmitted: false,
    error: null,
    manager: null,
  })

  // Validate manager on component mount
  useEffect(() => {
    const validateManager = async () => {
      if (!managerId) {
        setFormState(prev => ({
          ...prev,
          error: "Invalid QR code - no manager ID provided"
        }))
        return
      }

      try {
        setFormState(prev => ({ ...prev, isLoading: true }))

        // Validate manager exists (this would call the API)
        const response = await fetch(`/api/managers/${managerId}`)

        if (!response.ok) {
          throw new Error("Manager not found")
        }

        const managerData: Manager = await response.json()
        setFormState(prev => ({
          ...prev,
          manager: managerData,
          error: null,
          isLoading: false
        }))
      } catch (error) {
        setFormState(prev => ({
          ...prev,
          error: "Invalid QR code - manager not found",
          isLoading: false
        }))
      }
    }

    validateManager()
  }, [managerId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = (): string | null => {
    if (!formData.employee_name.trim()) {
      return "Employee name is required"
    }
    if (!formData.start_date) {
      return "Start date is required"
    }
    if (!formData.end_date) {
      return "End date is required"
    }
    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      return "Start date must be before end date"
    }
    if (new Date(formData.start_date) < new Date()) {
      return "Start date cannot be in the past"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    const validationError = validateForm()
    if (validationError) {
      setFormState(prev => ({ ...prev, error: validationError }))
      return
    }

    if (!managerId) {
      setFormState(prev => ({ ...prev, error: "Invalid manager ID" }))
      return
    }

    try {
      setFormState(prev => ({ ...prev, isLoading: true, error: null }))

      const requestData: TimeOffRequestForm = {
        ...formData,
        manager_id: parseInt(managerId)
      }

      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      const result: ApiResponse<any> = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit request")
      }

      setFormState(prev => ({
        ...prev,
        isLoading: false,
        isSubmitted: true,
        error: null
      }))
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An error occurred"
      }))
    }
  }

  // Loading state
  if (formState.isLoading && !formState.manager) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Validating QR code...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (formState.error && !formState.manager) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formState.error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Success state
  if (formState.isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-border bg-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                <h2 className="text-xl font-semibold text-foreground">Request Submitted!</h2>
                <p className="text-muted-foreground">
                  Your time-off request has been sent to {formState.manager?.name}.
                  You should receive a response soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Main form
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-border bg-card">
          <CardHeader className="text-center space-y-4 pb-6">
            {/* Product Connections Logo */}
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">PC</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl font-bold text-foreground text-balance">Time-Off Request</h1>

            {/* Manager name */}
            {formState.manager && (
              <p className="text-muted-foreground text-sm">
                Submitting to: {formState.manager.name}
              </p>
            )}
          </CardHeader>

          <CardContent>
            {formState.error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formState.error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Employee Name Field */}
              <div className="space-y-2">
                <Label htmlFor="employee_name" className="text-sm font-medium text-foreground">
                  Your Full Name *
                </Label>
                <Input
                  id="employee_name"
                  name="employee_name"
                  type="text"
                  required
                  value={formData.employee_name}
                  onChange={handleInputChange}
                  className="w-full bg-input border-border focus:ring-ring"
                  placeholder="Enter your full name"
                  disabled={formState.isLoading}
                />
              </div>

              {/* Start Date Field */}
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-sm font-medium text-foreground">
                  Start Date *
                </Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full bg-input border-border focus:ring-ring"
                  disabled={formState.isLoading}
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                />
              </div>

              {/* End Date Field */}
              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-sm font-medium text-foreground">
                  End Date *
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full bg-input border-border focus:ring-ring"
                  disabled={formState.isLoading}
                  min={formData.start_date || new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Reason Field */}
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium text-foreground">
                  Reason (Optional)
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full min-h-[100px] bg-input border-border focus:ring-ring resize-none"
                  placeholder="Optional: Provide additional details about your time-off request"
                  disabled={formState.isLoading}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium py-3 transition-colors"
                disabled={formState.isLoading}
              >
                {formState.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">CM</span>
            </div>
            <span>A Crossmark Agency</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
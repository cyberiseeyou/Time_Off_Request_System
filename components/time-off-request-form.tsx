"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function TimeOffRequestForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    startDate: "",
    endDate: "",
    reason: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

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

            {/* Sub-heading */}
            <p className="text-muted-foreground text-sm">Submitting to: Sarah Johnson</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Your Full Name *
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-input border-border focus:ring-ring"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Start Date Field */}
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium text-foreground">
                  Start Date *
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full bg-input border-border focus:ring-ring"
                />
              </div>

              {/* End Date Field */}
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium text-foreground">
                  End Date *
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full bg-input border-border focus:ring-ring"
                />
              </div>

              {/* Reason Field */}
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium text-foreground">
                  Reason
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full min-h-[100px] bg-input border-border focus:ring-ring resize-none"
                  placeholder="Optional: Provide additional details about your time-off request"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium py-3 transition-colors"
              >
                Submit Request
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

"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="space-y-6">
          {/* User Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your basic account details from the authentication provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                  <AvatarFallback className="text-lg">
                    {session.user?.name?.charAt(0)?.toUpperCase() || 
                     session.user?.email?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">
                    {session.user?.name || "No name provided"}
                  </h3>
                  <p className="text-gray-600">{session.user?.email}</p>
                  <p className="text-sm text-gray-500">
                    User ID: {session.user?.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research Preferences Card */}
          <Card>
            <CardHeader>
              <CardTitle>Research Preferences</CardTitle>
              <CardDescription>
                Customize your research experience (Coming soon)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Default Research Depth</span>
                  <span className="text-sm text-gray-500">Medium</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Preferred Citation Style</span>
                  <span className="text-sm text-gray-500">APA</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Auto-save to Notion</span>
                  <span className="text-sm text-gray-500">Enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Management Card */}
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>
                Manage your authentication session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Session Status</span>
                <span className="text-sm text-green-600">Active</span>
              </div>
              <Button 
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="outline"
                className="w-full"
              >
                Sign Out of All Sessions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
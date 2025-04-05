"use client"

import type React from "react"

import { ArrowLeft, Car } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { uploadVehicleImages } from "@/lib/storage"

export default function SellPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);

    // Generate local preview URLs for immediate display
    const localPreviews = files.map((file) => URL.createObjectURL(file));

    // Update state with local preview URLs
    setUploadedFiles((prev) => [...prev, ...localPreviews]);

    console.log("Local previews added:", localPreviews);

    setIsUploading(true);

    try {
      // Upload files to Firebase Storage
      const uploadedUrls = await uploadVehicleImages(files);

      console.log("Uploaded URLs:", uploadedUrls);

      // Replace local previews with uploaded URLs
      setUploadedFiles((prev) =>
        prev.map((file) => (localPreviews.includes(file) ? uploadedUrls.shift() || file : file))
      );
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Redirect to dashboard after success
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000)
    }, 2000)
  }

  // Display the files that have been selected
  const renderSelectedFiles = () => {
    console.log("Rendering selected files:", uploadedFiles);

    if (uploadedFiles.length === 0) return null;

    return (
      <div className="mt-4">
        <p className="text-sm font-medium mb-2">Selected Files ({uploadedFiles.length}):</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="relative rounded-md overflow-hidden border bg-gray-50">
              <div className="aspect-square relative">
                <img
                  src={file} // This will display the local preview or uploaded URL
                  alt={`Vehicle image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2 text-xs truncate">{file}</div>
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                onClick={() => {
                  const newFiles = [...uploadedFiles];
                  newFiles.splice(index, 1);
                  setUploadedFiles(newFiles);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
          <Car className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sell Your Vehicle</h1>
          <p className="text-gray-500">List your vehicle for auction and get the best market value</p>
        </div>
      </div>

      {isSuccess ? (
        <Card className="border-green-100 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Vehicle Listed Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your vehicle has been added to the auction. Redirecting to dashboard...
              </p>
              <div className="flex gap-4">
                <Link href="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
                <Link href="/vehicles">
                  <Button variant="outline">View All Auctions</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
              <CardDescription>Enter the details of your vehicle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select required>
                    <SelectTrigger id="brand">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="audi">Audi</SelectItem>
                      <SelectItem value="bmw">BMW</SelectItem>
                      <SelectItem value="ford">Ford</SelectItem>
                      <SelectItem value="honda">Honda</SelectItem>
                      <SelectItem value="mercedes">Mercedes</SelectItem>
                      <SelectItem value="tesla">Tesla</SelectItem>
                      <SelectItem value="toyota">Toyota</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" placeholder="e.g. Model 3, Civic" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select required>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => (
                        <SelectItem key={i} value={(new Date().getFullYear() - i).toString()}>
                          {new Date().getFullYear() - i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select required>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="coupe">Coupe</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="convertible">Convertible</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Select required>
                    <SelectTrigger id="color">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="black">Black</SelectItem>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gray">Gray</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input id="mileage" type="number" placeholder="e.g. 15000" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about your vehicle's condition, features, and history"
                    className="min-h-[120px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="starting-price">Starting Price ($)</Label>
                  <Input id="starting-price" type="number" placeholder="e.g. 25000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reserve-price">Reserve Price ($) (Optional)</Label>
                  <Input id="reserve-price" type="number" placeholder="e.g. 30000" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Vehicle Images</CardTitle>
              <CardDescription>Upload high-quality images of your vehicle (min. 3 images)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                    isUploading
                      ? "border-teal-300 bg-teal-50"
                      : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <div>
                      <p className="font-medium">{isUploading ? "Uploading..." : "Drag & drop your images here"}</p>
                      <p className="text-sm text-gray-500">
                        {isUploading
                          ? "Please wait while we upload your images"
                          : "PNG, JPG or JPEG (max. 5MB per image)"}
                      </p>
                    </div>
                    <label
                      htmlFor="file-upload"
                      className={`inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                        isUploading
                          ? "bg-teal-100 text-teal-700 hover:bg-teal-200"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      } h-10 px-4 py-2`}
                    >
                      {isUploading ? "Uploading..." : "Select Files"}
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
                {/* Render the selected files */}
                {renderSelectedFiles()}
                {/* Add a message if the user needs to select more files */}
                {uploadedFiles.length > 0 && uploadedFiles.length < 3 && (
                  <p className="text-amber-600 text-sm">Please select at least 3 images to continue.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auction Settings</CardTitle>
              <CardDescription>Configure your auction settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Auction Duration</Label>
                  <Select required defaultValue="7">
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="10">10 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="increment">Minimum Bid Increment ($)</Label>
                  <Input id="increment" type="number" placeholder="e.g. 500" defaultValue="500" required />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href="/">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700"
                disabled={isSubmitting || uploadedFiles.length < 3}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Creating Listing...
                  </>
                ) : (
                  "Create Auction Listing"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  )
}


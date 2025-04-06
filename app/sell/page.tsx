"use client";

import type React from "react";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { ArrowLeft, CalendarClock, Car } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AuctionCountdown from "@/components/auctions/auctionCountdown";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitNewVehicle } from "@/lib/api";
import { uploadVehicleImages } from "@/lib/storage";

export default function SellPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [previewEndDate, setPreviewEndDate] = useState<Date | null>(null);
  const router = useRouter();

  // Set default end date 7 days from now
  useEffect(() => {
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 7);
    setPreviewEndDate(defaultEndDate);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        // Redirect to login if not authenticated
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    if (!user) {
      console.error("User must be authenticated to upload files");
      return;
    }

    const files = Array.from(e.target.files);

    // Generate local preview URLs for immediate display
    const localPreviews = files.map((file) => URL.createObjectURL(file));

    // Update state with local preview URLs
    setUploadedFiles((prev) => [...prev, ...localPreviews]);

    setIsUploading(true);

    try {
      // Upload files to Firebase Storage
      const uploadedUrls = await uploadVehicleImages(files);

      // Replace local previews with uploaded URLs
      setUploadedFiles((prev) =>
        prev.map((file) =>
          localPreviews.includes(file) ? uploadedUrls.shift() || file : file
        )
      );
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const newEndDate = new Date(dateValue);
      setPreviewEndDate(newEndDate);
    } else {
      setPreviewEndDate(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      console.error("User must be authenticated to submit vehicle");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Get all form values
      const brand = formData.get("brand") as string;
      const model = formData.get("model") as string;
      const year = parseInt(formData.get("year") as string);
      const mileage = parseInt(formData.get("mileage") as string);
      const startingPrice = parseInt(formData.get("starting-price") as string);
      const reservePriceStr = formData.get("reserve-price") as string;
      const reservePrice = reservePriceStr
        ? parseInt(reservePriceStr)
        : undefined;
      const type = formData.get("type") as string;
      const color = formData.get("color") as string;
      const description = formData.get("description") as string;
      const auctionEndDateStr = formData.get("auction-end-date") as string;
      const auctionEndDate = new Date(auctionEndDateStr);

      // Validate required fields with specific messages
      const errors: string[] = [];

      if (!brand) errors.push("Brand is required");
      if (!model) errors.push("Model is required");
      if (!year || isNaN(year)) errors.push("Valid year is required");
      if (!mileage || isNaN(mileage)) errors.push("Valid mileage is required");
      if (!startingPrice || isNaN(startingPrice))
        errors.push("Valid starting price is required");
      if (!type) errors.push("Vehicle type is required");
      if (!color) errors.push("Color is required");
      if (!description) errors.push("Description is required");
      if (!auctionEndDateStr) errors.push("Auction end date is required");
      if (uploadedFiles.length === 0)
        errors.push("At least one image is required");

      // Validate that end date is in the future
      if (auctionEndDate <= new Date()) {
        errors.push("Auction end date must be in the future");
      }

      if (errors.length > 0) {
        throw new Error(errors.join("\n"));
      }

      const vehicleData = {
        brand,
        model,
        year,
        type,
        color,
        mileage,
        description,
        images: uploadedFiles,
        startingPrice,
        reservePrice,
        endTime: auctionEndDate.toISOString(),
        status: "active" as const,
        createdAt: new Date(),
        sellerId: user.uid,
      };

      console.log("Submitting vehicle data:", vehicleData);
      await submitNewVehicle(vehicleData, user.uid);
      setIsSuccess(true);

      // Redirect to dashboard after success
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to submit vehicle. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to format today's date for min attribute
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Helper function to format a date 30 days from now for max attribute
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  // Display the files that have been selected
  const renderSelectedFiles = () => {
    if (uploadedFiles.length === 0) return null;

    return (
      <div className="mt-4">
        <p className="text-sm font-medium mb-2">
          Selected Files ({uploadedFiles.length}):
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="relative rounded-md overflow-hidden border bg-gray-50"
            >
              <div className="aspect-square relative">
                <img
                  src={file}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
          <h1 className="text-2xl font-bold tracking-tight">
            Sell Your Vehicle
          </h1>
          <p className="text-gray-500">
            List your vehicle for auction and get the best market value
          </p>
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
              <h2 className="text-xl font-semibold mb-2">
                Vehicle Listed Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your vehicle has been added to the auction. Redirecting to
                dashboard...
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
              <CardDescription>
                Enter the details of your vehicle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Select required name="brand">
                    <SelectTrigger id="brand">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="audi">Audi</SelectItem>
                      <SelectItem value="bmw">BMW</SelectItem>
                      <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                      <SelectItem value="tesla">Tesla</SelectItem>
                      <SelectItem value="toyota">Toyota</SelectItem>
                      <SelectItem value="honda">Honda</SelectItem>
                      <SelectItem value="ford">Ford</SelectItem>
                      <SelectItem value="chevrolet">Chevrolet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    required
                    id="model"
                    name="model"
                    placeholder="Enter model name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Select required name="year">
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={(new Date().getFullYear() - i).toString()}
                        >
                          {new Date().getFullYear() - i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Vehicle Type *</Label>
                  <Select required name="type">
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="coupe">Coupe</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="SuperCar">SuperCar</SelectItem>
                      <SelectItem value="convertible">Convertible</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color *</Label>
                  <Select required name="color">
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
                  <Label htmlFor="mileage">Mileage *</Label>
                  <Input
                    required
                    id="mileage"
                    name="mileage"
                    type="number"
                    min="0"
                    placeholder="Enter mileage"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  required
                  id="description"
                  name="description"
                  placeholder="Enter vehicle description"
                  className="min-h-[50px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Vehicle Images</CardTitle>
              <CardDescription>
                Upload high-quality images of your vehicle (min. 3 images)
              </CardDescription>
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
                      <p className="font-medium">
                        {isUploading
                          ? "Uploading..."
                          : "Drag & drop your images here"}
                      </p>
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
                {renderSelectedFiles()}
                {uploadedFiles.length > 0 && uploadedFiles.length < 1 && (
                  <p className="text-amber-600 text-sm">
                    Please select at least 1 images to continue.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Auction Details</CardTitle>
              <CardDescription>
                Set the starting price, reserve price, and auction duration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="starting-price">Starting Price *</Label>
                  <Input
                    required
                    id="starting-price"
                    name="starting-price"
                    type="number"
                    min="0"
                    placeholder="Enter starting price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reserve-price">
                    Reserve Price (Optional)
                  </Label>
                  <Input
                    id="reserve-price"
                    name="reserve-price"
                    type="number"
                    min="0"
                    placeholder="Enter reserve price"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="auction-end-date"
                    className="flex items-center gap-2"
                  >
                    <CalendarClock className="h-4 w-4" />
                    Auction End Date *
                  </Label>
                  <Input
                    required
                    id="auction-end-date"
                    name="auction-end-date"
                    type="date"
                    min={getMinDate()}
                    max={getMaxDate()}
                    defaultValue={(() => {
                      const defaultDate = new Date();
                      defaultDate.setDate(defaultDate.getDate() + 7);
                      return defaultDate.toISOString().split("T")[0];
                    })()}
                    onChange={handleEndDateChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auction duration can be up to 30 days from today
                  </p>
                </div>
                {previewEndDate && (
                  <div className="md:col-span-2 p-4 border border-teal-100 bg-teal-50 rounded-md">
                    <AuctionCountdown endDate={previewEndDate} />
                    <p className="text-xs text-gray-500 mt-2">
                      Preview: This is how your auction countdown will appear to
                      buyers
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting || uploadedFiles.length < 1}
              className="bg-teal-600 hover:bg-teal-700"
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
          </div>
        </form>
      )}
    </div>
  );
}

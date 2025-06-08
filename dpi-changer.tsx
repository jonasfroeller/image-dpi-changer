"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, ImageIcon, Info, ZoomIn, FileText, Eye } from "lucide-react"
import { changeDpiDataUrl } from "changedpi"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

const paperFormats = [
  { name: "A4 Document", width: 8.27, height: 11.69, recommendedDpi: 150, description: "Standard document printing" },
  { name: "A4 Photo", width: 8.27, height: 11.69, recommendedDpi: 300, description: "High-quality photo printing" },
  {
    name: "US Letter Document",
    width: 8.5,
    height: 11,
    recommendedDpi: 150,
    description: "Standard document printing",
  },
  { name: "US Letter Photo", width: 8.5, height: 11, recommendedDpi: 300, description: "High-quality photo printing" },
  { name: "4×6 Photo", width: 6, height: 4, recommendedDpi: 300, description: "Standard photo print" },
  { name: "5×7 Photo", width: 7, height: 5, recommendedDpi: 300, description: "Standard photo print" },
  { name: "8×10 Photo", width: 10, height: 8, recommendedDpi: 300, description: "Large photo print" },
  { name: "Business Card", width: 3.5, height: 2, recommendedDpi: 600, description: "High-quality business printing" },
  { name: "Instagram Post", width: 5, height: 5, recommendedDpi: 150, description: "Social media printing" },
  { name: "Poster (11×17)", width: 17, height: 11, recommendedDpi: 150, description: "Large format printing" },
]

const DpiVisualizer = ({ imageDimensions }: { imageDimensions: { width: number; height: number } | null }) => {
  const [visualDpi, setVisualDpi] = useState([300])

  if (!imageDimensions) return null

  const dpiValues = [72, 150, 300, 600]
  const currentDpi = visualDpi[0]

  // Calculate print dimensions for each DPI
  const printSizes = dpiValues.map((dpi) => ({
    dpi,
    width: imageDimensions.width / dpi,
    height: imageDimensions.height / dpi,
    widthCm: (imageDimensions.width / dpi) * 2.54,
    heightCm: (imageDimensions.height / dpi) * 2.54,
  }))

  // Scale factor for visual representation (to fit in UI)
  const maxWidth = Math.max(...printSizes.map((p) => p.width))
  const scaleFactor = Math.min(100 / maxWidth, 50 / Math.max(...printSizes.map((p) => p.height))) // More conservative scaling

  return (
    <div className="space-y-6">
      {/* Interactive DPI Slider */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label>Interactive DPI: {currentDpi}</Label>
          <div className="flex-1 max-w-md">
            <Slider value={visualDpi} onValueChange={setVisualDpi} min={72} max={600} step={1} className="w-full" />
          </div>
        </div>

        {/* Current DPI visualization */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Your Image at {currentDpi} DPI</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-800">Print Size:</p>
              <p className="font-medium text-blue-900">
                {(imageDimensions.width / currentDpi).toFixed(2)}" × {(imageDimensions.height / currentDpi).toFixed(2)}"
              </p>
              <p className="text-xs text-blue-700">
                ({((imageDimensions.width / currentDpi) * 2.54).toFixed(1)} cm ×{" "}
                {((imageDimensions.height / currentDpi) * 2.54).toFixed(1)} cm)
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-800">Visual Size:</p>
              <div
                className="bg-blue-200 border-2 border-blue-400 rounded"
                style={{
                  width: `${(imageDimensions.width / currentDpi) * scaleFactor}px`,
                  height: `${(imageDimensions.height / currentDpi) * scaleFactor}px`,
                  minWidth: "20px",
                  minHeight: "20px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* DPI Comparison Grid */}
      <div className="space-y-4">
        <h4 className="font-medium">DPI Comparison</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {printSizes.map((size) => (
            <div key={size.dpi} className="bg-gray-50 border rounded-lg p-3 text-center">
              <div className="font-medium text-sm mb-2">{size.dpi} DPI</div>
              <div className="h-24 flex items-center justify-center">
                <div
                  className="bg-gray-300 border-2 border-gray-500 rounded"
                  style={{
                    width: `${Math.min(size.width * scaleFactor, 150)}px`,
                    height: `${Math.min(size.height * scaleFactor, 80)}px`,
                    maxWidth: "90%",
                    maxHeight: "90%",
                  }}
                />
              </div>
              <div className="text-xs text-gray-600 mt-2">
                <div>
                  {size.width.toFixed(1)}" × {size.height.toFixed(1)}"
                </div>
                <div>
                  {size.widthCm.toFixed(1)} × {size.heightCm.toFixed(1)} cm
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center">
          Rectangles show relative print sizes (scaled to fit). Same pixels, different DPI = different print sizes.
        </p>
      </div>

      {/* Pixel Density Visualization */}
      <div className="space-y-4">
        <h4 className="font-medium">How DPI Works: Pixel Density</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h5 className="font-medium text-red-900 mb-2">72 DPI (Low Density)</h5>
            <div className="grid grid-cols-6 gap-1 w-fit">
              {Array.from({ length: 36 }, (_, i) => (
                <div key={i} className="w-3 h-3 bg-red-300 border border-red-400 rounded-sm" />
              ))}
            </div>
            <p className="text-xs text-red-700 mt-2">72 pixels spread across 1 inch = Large pixels, lower quality</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 className="font-medium text-green-900 mb-2">300 DPI (High Density)</h5>
            <div className="grid grid-cols-12 gap-0.5 w-fit">
              {Array.from({ length: 144 }, (_, i) => (
                <div key={i} className="w-1 h-1 bg-green-400 border border-green-500 rounded-sm" />
              ))}
            </div>
            <p className="text-xs text-green-700 mt-2">
              300 pixels spread across 1 inch = Small pixels, higher quality
            </p>
          </div>
        </div>
      </div>

      {/* Key Concept */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Key Concept
        </h4>
        <div className="text-sm text-yellow-800 space-y-2">
          <p>
            <strong>Same pixels, different DPI = different print sizes</strong>
          </p>
          <p>• Higher DPI = pixels packed closer together = smaller print size, higher quality</p>
          <p>• Lower DPI = pixels spread further apart = larger print size, lower quality</p>
          <p>• The image file itself doesn't change, only how it's interpreted for printing</p>
        </div>
      </div>
    </div>
  )
}

export default function Component() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [dpi, setDpi] = useState<number>(300)
  const [currentDpi, setCurrentDpi] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    if (bytes < 1024) return `${bytes} Bytes`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const extractImageDpi = async (file: File): Promise<number | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const dataView = new DataView(arrayBuffer)

        try {
          // Check for JPEG
          if (dataView.getUint16(0) === 0xffd8) {
            let offset = 2
            while (offset < dataView.byteLength) {
              const marker = dataView.getUint16(offset)
              if (marker === 0xffe0) {
                // APP0 segment
                const length = dataView.getUint16(offset + 2)
                const identifier = String.fromCharCode(
                  dataView.getUint8(offset + 4),
                  dataView.getUint8(offset + 5),
                  dataView.getUint8(offset + 6),
                  dataView.getUint8(offset + 7),
                  dataView.getUint8(offset + 8),
                )
                if (identifier === "JFIF\0") {
                  const units = dataView.getUint8(offset + 9)
                  const xDensity = dataView.getUint16(offset + 10)
                  if (units === 1) {
                    // DPI
                    resolve(xDensity)
                    return
                  } else if (units === 2) {
                    // DPC (dots per cm)
                    resolve(Math.round(xDensity * 2.54))
                    return
                  }
                }
                offset += 2 + length
              } else {
                break
              }
            }
          }

          // Check for PNG
          if (dataView.getUint32(0) === 0x89504e47 && dataView.getUint32(4) === 0x0d0a1a0a) {
            let offset = 8
            while (offset < dataView.byteLength - 8) {
              const chunkLength = dataView.getUint32(offset)
              const chunkType = String.fromCharCode(
                dataView.getUint8(offset + 4),
                dataView.getUint8(offset + 5),
                dataView.getUint8(offset + 6),
                dataView.getUint8(offset + 7),
              )

              if (chunkType === "pHYs") {
                const pixelsPerUnitX = dataView.getUint32(offset + 8)
                const pixelsPerUnitY = dataView.getUint32(offset + 12)
                const unit = dataView.getUint8(offset + 16)

                if (unit === 1) {
                  const dpi = Math.round(pixelsPerUnitX / 39.3701) // Convert from pixels per meter to DPI
                  resolve(dpi)
                  return
                }
              }

              offset += 8 + chunkLength + 4 // chunk length + type + data + CRC
            }
          }

          // Default fallback
          resolve(72)
        } catch (error) {
          console.error("Error extracting DPI:", error)
          resolve(72)
        }
      }
      reader.readAsArrayBuffer(file)
    })
  }

  // Calculate print dimensions based on pixel dimensions and DPI
  const printDimensions = imageDimensions
    ? {
        width: (imageDimensions.width / dpi).toFixed(2),
        height: (imageDimensions.height / dpi).toFixed(2),
        widthCm: ((imageDimensions.width / dpi) * 2.54).toFixed(2),
        heightCm: ((imageDimensions.height / dpi) * 2.54).toFixed(2),
      }
    : null

  // Calculate current print dimensions based on current DPI
  const currentPrintDimensions =
    imageDimensions && currentDpi
      ? {
          width: (imageDimensions.width / currentDpi).toFixed(2),
          height: (imageDimensions.height / currentDpi).toFixed(2),
          widthCm: ((imageDimensions.width / currentDpi) * 2.54).toFixed(2),
          heightCm: ((imageDimensions.height / currentDpi) * 2.54).toFixed(2),
        }
      : null

  // Check if image will fit on selected paper format
  const selectedFormatData = paperFormats.find((f) => f.name === selectedFormat)
  const willFitOnPaper =
    selectedFormatData && printDimensions
      ? (Number.parseFloat(printDimensions.width) <= selectedFormatData.width &&
          Number.parseFloat(printDimensions.height) <= selectedFormatData.height) ||
        (Number.parseFloat(printDimensions.width) <= selectedFormatData.height &&
          Number.parseFloat(printDimensions.height) <= selectedFormatData.width)
      : true

  // Determine if the print might appear pixelated (rough estimate)
  const mightAppearPixelated = dpi < 150

  // Get image dimensions when image loads
  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setImageDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      })
    }
  }, [previewUrl])

  const handleFormatChange = (value: string) => {
    setSelectedFormat(value)
    if (value) {
      const format = paperFormats.find((f) => f.name === value)
      if (format) {
        setDpi(format.recommendedDpi)
      }
    }
  }

  const handleFileSelect = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setSelectedFormat("")

      const extractedDpi = await extractImageDpi(file)
      setCurrentDpi(extractedDpi)
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    })
  }

  const handleDownload = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    try {
      const dataUrl = await fileToDataUrl(selectedFile)

      const modifiedDataUrl = changeDpiDataUrl(dataUrl, dpi)

      console.log(`DPI metadata changed from ${currentDpi || 72} to ${dpi}`)

      // Create download link from the modified data URL
      const link = document.createElement("a")
      link.href = modifiedDataUrl
      const formatSuffix = selectedFormat ? `_${selectedFormat.replace(/\s+/g, "_")}` : ""
      link.download = `${selectedFile.name.split(".")[0]}${formatSuffix}_${dpi}dpi.${selectedFile.name.split(".").pop()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error processing image:", error)
      alert("Error processing image. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const dpiPresets = [72, 150, 300, 600]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            Image DPI/PPI Changer
          </CardTitle>
          <CardDescription>
            Upload an image and change its DPI/PPI resolution for printing or display purposes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Drop your image here or click to browse</p>
            <p className="text-sm text-gray-500">Supports JPG, PNG, and other common image formats</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Preview</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <img
                  ref={imageRef}
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-full max-h-96 mx-auto rounded-lg shadow-sm"
                  onLoad={handleImageLoad}
                />
                <div className="mt-4 text-sm text-gray-600 text-center space-y-1">
                  <p>File: {selectedFile?.name}</p>
                  <p>Size: {selectedFile ? formatFileSize(selectedFile.size) : "0 Bytes"}</p>
                  {imageDimensions && (
                    <p>
                      Dimensions: {imageDimensions.width} × {imageDimensions.height} pixels
                    </p>
                  )}
                  {currentDpi && (
                    <div className="flex items-center justify-center gap-2">
                      <p>Current DPI: {currentDpi}</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-4 w-4">
                              <Info className="h-3 w-3" />
                              <span className="sr-only">Current DPI information</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              This is the DPI value stored in the image metadata. Many cameras and phones set this to 72
                              by default, regardless of intended print size.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Visual DPI Explanation */}
          {imageDimensions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="w-5 h-5" />
                  Visual DPI Explanation
                </CardTitle>
                <CardDescription>See how DPI affects print size with your actual image dimensions</CardDescription>
              </CardHeader>
              <CardContent>
                <DpiVisualizer imageDimensions={imageDimensions} />
              </CardContent>
            </Card>
          )}

          {/* Current Print Size Information */}
          {currentPrintDimensions && currentDpi && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <span>Current Print Size (at {currentDpi} DPI)</span>
                <Badge variant="outline" className="bg-gray-100">
                  Original
                </Badge>
              </h4>
              <p className="text-sm text-gray-700">Based on the current DPI metadata, this image would print at:</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-white p-2 rounded">
                  <p className="text-sm font-medium text-gray-900">Inches</p>
                  <p className="text-sm text-gray-700">
                    <strong>
                      {currentPrintDimensions.width}" × {currentPrintDimensions.height}"
                    </strong>
                  </p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p className="text-sm font-medium text-gray-900">Centimeters</p>
                  <p className="text-sm text-gray-700">
                    <strong>
                      {currentPrintDimensions.widthCm} cm × {currentPrintDimensions.heightCm} cm
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Paper Format Selection */}
          {imageDimensions && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <Label>Target Print Format</Label>
              </div>
              <Select value={selectedFormat} onValueChange={handleFormatChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a standard print format" />
                </SelectTrigger>
                <SelectContent>
                  {paperFormats.map((format) => (
                    <SelectItem key={format.name} value={format.name}>
                      <div className="flex flex-col">
                        <span>
                          {format.name} ({format.width}" × {format.height}")
                        </span>
                        <span className="text-xs text-gray-500">
                          {format.description} - {format.recommendedDpi}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFormat && selectedFormatData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>{selectedFormat}</strong> format selected - DPI set to{" "}
                    <strong>{selectedFormatData.recommendedDpi}</strong> for{" "}
                    {selectedFormatData.description.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* DPI Settings */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="dpi">Output DPI/PPI</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">DPI information</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        DPI only changes metadata, not image quality or file size. It affects how large the image
                        prints.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {dpiPresets.map((presetDpi) => (
                  <Button
                    key={presetDpi}
                    variant={dpi === presetDpi ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setDpi(presetDpi)
                      setSelectedFormat("")
                    }}
                  >
                    {presetDpi} DPI
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="dpi"
                  type="number"
                  value={dpi}
                  onChange={(e) => {
                    setDpi(Number(e.target.value))
                    setSelectedFormat("")
                  }}
                  min="72"
                  max="2400"
                  step="1"
                  className="w-32"
                />
                <Badge variant="outline">Custom</Badge>
              </div>
              <p className="text-sm text-gray-500">
                Common values: 72 (web), 150 (draft print), 300 (standard print), 600+ (high quality print)
              </p>
            </div>

            {/* Print Size Information */}
            {printDimensions && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                  <span>New Print Size (at {dpi} DPI)</span>
                  <Badge variant="outline" className="bg-green-100">
                    Preview
                  </Badge>
                </h4>
                <p className="text-sm text-green-800">This image will print at approximately:</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-white bg-opacity-50 p-2 rounded">
                    <p className="text-sm font-medium text-green-900">Inches</p>
                    <p className="text-sm text-green-800">
                      <strong>
                        {printDimensions.width}" × {printDimensions.height}"
                      </strong>
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-50 p-2 rounded">
                    <p className="text-sm font-medium text-green-900">Centimeters</p>
                    <p className="text-sm text-green-800">
                      <strong>
                        {printDimensions.widthCm} cm × {printDimensions.heightCm} cm
                      </strong>
                    </p>
                  </div>
                </div>

                {/* Paper fit warning */}
                {selectedFormat && !willFitOnPaper && (
                  <Alert className="mt-3 bg-yellow-50 text-yellow-800 border-yellow-200">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Size Notice</AlertTitle>
                    <AlertDescription>
                      This image will print larger than the selected {selectedFormat} paper size. Consider using a
                      larger paper format or increasing the DPI to make the print smaller.
                    </AlertDescription>
                  </Alert>
                )}

                {selectedFormat && willFitOnPaper && (
                  <div className="mt-2 text-xs text-green-700">✓ Image will fit on {selectedFormat} paper</div>
                )}

                <p className="text-xs text-green-700 mt-2">
                  Note: The actual image quality and file size remain unchanged.
                </p>

                {/* Pixelation warning */}
                {mightAppearPixelated && (
                  <Alert variant="destructive" className="mt-3 bg-red-50 text-red-800 border-red-200">
                    <ZoomIn className="h-4 w-4" />
                    <AlertTitle>Potential Pixelation</AlertTitle>
                    <AlertDescription>
                      At {dpi} DPI, this image may appear pixelated when printed at this size. For best quality, use 300
                      DPI or higher for print.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>

          {/* DPI Explanation Tabs */}
          <Tabs defaultValue="what-is-dpi" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="what-is-dpi">What is DPI?</TabsTrigger>
              <TabsTrigger value="pixelation">DPI & Pixelation</TabsTrigger>
              <TabsTrigger value="metadata">Metadata vs. Resampling</TabsTrigger>
            </TabsList>
            <TabsContent value="what-is-dpi" className="p-4 border rounded-md mt-2">
              <h4 className="font-medium mb-2">What is DPI/PPI?</h4>
              <ul className="text-sm space-y-1">
                <li>
                  • <strong>DPI (Dots Per Inch)</strong>: How many ink dots a printer places in one inch
                </li>
                <li>
                  • <strong>PPI (Pixels Per Inch)</strong>: How many pixels are displayed in one inch on a screen
                </li>
                <li>• Higher DPI/PPI = more detail in the same physical space</li>
                <li>• Common values: 72 (web), 300 (print), 600+ (high-quality print)</li>
              </ul>
            </TabsContent>
            <TabsContent value="pixelation" className="p-4 border rounded-md mt-2">
              <h4 className="font-medium mb-2">DPI and Pixelation</h4>
              <p className="text-sm mb-2">
                Pixelation occurs when you have too few pixels spread over too large a physical area:
              </p>
              <ul className="text-sm space-y-1">
                <li>
                  • <strong>Low DPI</strong>: Same pixels spread over larger area = visible pixels (pixelation)
                </li>
                <li>
                  • <strong>High DPI</strong>: Same pixels packed into smaller area = sharper image
                </li>
                <li>• The image itself doesn't change, just how densely it's printed</li>
                <li>• For print, 300 DPI is typically the minimum for sharp results</li>
              </ul>
            </TabsContent>
            <TabsContent value="metadata" className="p-4 border rounded-md mt-2">
              <h4 className="font-medium mb-2">Metadata vs. Resampling</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Metadata Change (Our Tool)</p>
                  <ul className="space-y-1">
                    <li>• Only changes DPI value in file metadata</li>
                    <li>• No change to pixel count or dimensions</li>
                    <li>• No quality loss or pixelation in digital form</li>
                    <li>• Changes intended print size</li>
                    <li>• File size stays the same</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Resampling (Image Editors)</p>
                  <ul className="space-y-1">
                    <li>• Actually adds or removes pixels</li>
                    <li>• Changes pixel dimensions</li>
                    <li>• Can cause quality loss</li>
                    <li>• Maintains physical print size</li>
                    <li>• File size changes</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Download Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleDownload}
              disabled={!selectedFile || isProcessing}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isProcessing ? "Processing..." : `Download with ${dpi} DPI`}
            </Button>

            {selectedFile && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFile(null)
                  setPreviewUrl("")
                  setSelectedFormat("")
                  setCurrentDpi(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

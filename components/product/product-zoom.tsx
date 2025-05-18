"use client"

import { useState } from "react"
import Image from "next/image"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ProductZoomProps {
  images: string[]
  productName: string
}

export function ProductZoom({ images, productName }: ProductZoomProps) {
  const [activeImage, setActiveImage] = useState(0)

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="mb-6">
      <Dialog>
        <div className="space-y-3">
          <DialogTrigger asChild>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-dark-800 cursor-zoom-in">
              <Image
                src={images[activeImage] || "/placeholder.svg"}
                alt={productName}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-900/20"></div>
              <div className="absolute bottom-2 right-2 bg-dark-700 rounded-full p-2">
                <ZoomIn className="h-5 w-5 text-white" />
              </div>
            </div>
          </DialogTrigger>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    "relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0",
                    activeImage === index ? "ring-2 ring-white" : "opacity-70",
                  )}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${productName} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-dark-900">
          <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0} minScale={0.5} maxScale={3}>
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="flex justify-between items-center p-4 border-b border-dark-700">
                  <h3 className="text-xl font-bold text-white">{productName}</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => zoomIn()}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => zoomOut()}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => resetTransform()}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="relative h-[calc(90vh-120px)] bg-dark-800/60 overflow-hidden">
                  <TransformComponent wrapperClass="w-full h-full">
                    <Image
                      src={images[activeImage] || "/placeholder.svg"}
                      alt={productName}
                      width={1200}
                      height={1200}
                      className="object-contain w-full h-full"
                    />
                  </TransformComponent>
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar border-t border-dark-700">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        className={cn(
                          "relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0",
                          activeImage === index ? "ring-2 ring-white" : "opacity-70",
                        )}
                        onClick={() => setActiveImage(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${productName} view ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </TransformWrapper>
        </DialogContent>
      </Dialog>
    </div>
  )
}

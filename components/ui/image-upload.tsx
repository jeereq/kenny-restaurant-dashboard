"use client"

import { useState, useRef } from "react"
import { Button } from "./button"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onChange: (file: File | null) => void
  value?: string
  className?: string
}

export function ImageUpload({ onChange, value, className = "" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onChange(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onChange(null)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="Restaurant preview"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full aspect-video"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-6 w-6 mr-2" />
          Ajouter une image
        </Button>
      )}
    </div>
  )
}
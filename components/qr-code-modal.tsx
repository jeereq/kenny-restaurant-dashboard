"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { QrCode } from "lucide-react"

interface QRCodeModalProps {
  menuId: string
  menuName: string
}

export function QRCodeModal({ menuId, menuName }: QRCodeModalProps) {
  const [open, setOpen] = useState(false)
  const menuUrl = `${window.location.origin}/menu/${menuId}`

  const handleDownload = () => {
    const svg = document.getElementById("menu-qr-code")
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = `menu-qr-${menuName.toLowerCase().replace(/\s+/g, "-")}`
        downloadLink.href = pngFile
        downloadLink.click()
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <QrCode className="mr-2 h-4 w-4" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>QR Code du Menu</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 p-4">
          <QRCodeSVG
            id="menu-qr-code"
            value={menuUrl}
            size={250}
            level="H"
            includeMargin
          />
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Scannez ce QR code pour accéder au menu
            </p>
            <Button onClick={handleDownload}>
              Télécharger le QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
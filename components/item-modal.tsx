"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import { Plus } from "lucide-react"
import { uploadChunk } from "@/lib/utils"
import { useFetchData } from "@/hooks/use-data"
import useToast from "@/hooks/use-toast"

interface ItemModalProps {
  type: string
  onSave: (item: any) => void
  item?: {
    id: string
    name: string
    description: string
    price: number
    picture?: string
  }
}

export function ItemModal({ type, onSave, item }: ItemModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const { fetch: actionsFlat } = useFetchData({ uri: "flats" })
  const { success: successMessage, error: errorMessage } = useToast()
  const [formData, setFormData] = useState(
    item || {
      name: "",
      description: "",
      price: 0,
      picture: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop",
      type
    }
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const method = item ? "put" : "post"
    const imageResponse: any = image ? await uploadChunk(image) : null
    console.log(formData)
    const { data: dataResponse, error } = await actionsFlat({
      ...formData,
      picture: imageResponse ? imageResponse.url : formData.picture
    }, method)
    if (error) {
      errorMessage(item ? "Une erreur s'est produite lors de la mise à jour du plat !" : "Une erreur s'est produite lors de la création du plat !")
    } else {
      successMessage(item ? "Le plat a été mis à jour avec succès !" : "Le plat a été créé")
    }
    setLoading(false)
    setOpen(false)
    if (dataResponse) {
      const { data }: any = dataResponse
      onSave(data)
    }

  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {item ? "Modifier le plat" : "Ajouter un plat"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{item ? "Modifier le plat" : "Nouveau plat"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Image du plat</Label>
            <ImageUpload
              onChange={setImage}
              value={formData.picture}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nom du plat *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Prix *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
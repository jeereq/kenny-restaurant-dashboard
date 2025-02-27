"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useFetchData } from "@/hooks/use-data"
import { useParams } from "next/navigation"
import useToast from "@/hooks/use-toast"

interface MenuModalProps {
  onSave: (menu: any) => void
}

export function MenuModal({ onSave }: MenuModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const { error: errorMessage, success: succesMessage } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })
  const { fetch: fetchMenu } = useFetchData({ uri: `menus` })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const restaurant = params.id
    setLoading(true)
    const { data: { data } } = await fetchMenu({ ...formData, restaurant }, "post")
    if (data) {
      onSave(data)
      succesMessage("Le menu a été créé avec succès !")
      setOpen(false)
    } else {
      errorMessage("Une erreur s'est produite lors de la création du menu !")
    }

    // Simulation de sauvegarde

  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Menu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouveau Menu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du menu *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Menu du Midi"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Disponible du lundi au vendredi, de 12h à 14h30"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer le menu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
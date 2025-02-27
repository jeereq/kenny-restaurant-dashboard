"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit } from "lucide-react"
import { useFetchData } from "@/hooks/use-data"
import useToast from "@/hooks/use-toast"

interface MenuEditModalProps {
  menu: {
    id?: string
    name: string
    description: string
    documentId?: string,
    categories?: any[]
    items?: any[]
  }
  onSave: (menu: any) => void
}

export function MenuEditModal({ menu, onSave }: MenuEditModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(menu)
  const { error: errorMessage, success: successMessage } = useToast()
  const { fetch: actionsMenu, loading } = useFetchData({ uri: `menus/${menu.documentId}` })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const updatedItem: any = { name: "", description: "" }
    updatedItem.description = formData.description
    updatedItem.name = formData.name
    const { data: { data } } = await actionsMenu(updatedItem, "put");
    if (data) {
      onSave(data)
      successMessage("Le menu a été mis à jour avec succès !")
      setOpen(false)
    } else {
      errorMessage("Une erreur s'est produite lors de la mise à jour du menu !")
    }

  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le menu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du menu *</Label>
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
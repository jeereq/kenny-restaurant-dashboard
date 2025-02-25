"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { ArrowLeft, Utensils } from "lucide-react";
import Link from "next/link";
import { useFetchData } from "@/hooks/use-data";
import useApp from "@/hooks/use-app";
import useToast from "@/hooks/use-toast";
import { uploadChunk } from "@/lib/utils";

export default function NewRestaurantPage() {
  const router = useRouter();
  const { app: { user } } = useApp()
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false)
  const { fetch: newRestaurant } = useFetchData({ uri: "restaurants" })
  const { success: successMessage, error: errorMessage } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData(e.currentTarget);
    const imageResponse: any = await uploadChunk(image) || null
    const restaurant = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      address: formData.get("address") as string,
      phoneNumber: formData.get("phone") as string,
      picture: imageResponse ? imageResponse.url : "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop",
      owner: user?.id
    };
    if (!user?.id) delete restaurant.owner
    const { error } = await newRestaurant(restaurant, "post")
    setLoading(false)
    if (!error) {
      successMessage("Le restaurant a été créé !")
      router.push("/dashboard")
    }
    else errorMessage("La création du restaurant a échoué !")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Utensils className="h-6 w-6" />
            <h1 className="text-2xl font-bold">MenuQR</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Nouveau Restaurant</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Image du restaurant</Label>
                <ImageUpload
                  onChange={setImage}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom du restaurant *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Le Bistrot Parisien"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Une courte description de votre restaurant"
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  name="address"
                  required
                  placeholder="123 rue de la Paix, 75000 Paris"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  type="tel"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" type="button">
                    Annuler
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? "Création..." : "Créer le restaurant"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Trash2, Utensils } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFetchData } from "@/hooks/use-data";
import useToast from "@/hooks/use-toast";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
}

export default function RestaurantSettingsPage({
  params,
  searchParams
}: {
  params: { id: string };

  searchParams: { docId: string }

}) {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const { fetch: fetchRestaurants } = useFetchData({ uri: `restaurants?filters[id][$eq]=${params.id}` })
  const { fetch: actionsRestaurant, loading } = useFetchData({ uri: `restaurants/${searchParams.docId}` })
  const { success: successMessage } = useToast()

  useEffect(() => {
    (async function () {
      const { data: { data: [data] } } = await fetchRestaurants()
      if (data) {
        setRestaurant({ ...data, phone: data.phoneNumber })
      }
    })()
  }, [params.id]);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const updatedRestaurant = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      address: formData.get("address") as string,
      phoneNumber: formData.get("phone") as string,
    };

    const { data } = await actionsRestaurant(updatedRestaurant, "put")
    if (data) {
      successMessage("Votre restaurant a été modifier !")
    }
  }

  function handleDelete() {
    // Simulation de suppression
    (async function () {
      const { error } = await actionsRestaurant({}, "delete")
      if (!error) {
        successMessage("Votre restaurant a été supprimer !")
        router.push("/dashboard");
      }
    })()

  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Utensils className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Chill lounge</h1>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Paramètres du Restaurant</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Cela supprimera définitivement
                    votre restaurant et tous les menus associés.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du restaurant *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={restaurant.name}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={restaurant.description}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  name="address"
                  rows={2}
                  defaultValue={restaurant.address}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={restaurant.phone}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" type="button">
                    Annuler
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
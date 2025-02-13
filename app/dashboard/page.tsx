"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, QrCode, Settings, Utensils } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Le Bistrot Parisien",
    description: "Cuisine française traditionnelle",
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: "2",
    name: "Sushi Master",
    description: "Restaurant japonais authentique",
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [restaurants] = useState<Restaurant[]>(mockRestaurants);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Utensils className="h-6 w-6" />
            <h1 className="text-2xl font-bold">MenuQR</h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/auth/login")}>
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Mes Restaurants</h2>
          <Link href="/dashboard/restaurants/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Restaurant
            </Button>
          </Link>
        </div>

        {restaurants.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-medium text-center mb-4">
                Vous n&apos;avez pas encore de restaurant
              </p>
              <Link href="/dashboard/restaurants/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un Restaurant
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden">
                <div className="relative w-full aspect-video">
                  {restaurant.imageUrl ? (
                    <Image
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Utensils className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{restaurant.name}</CardTitle>
                  <CardDescription>{restaurant.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/restaurants/${restaurant.id}/menus`} className="flex-1">
                      <Button variant="secondary" className="w-full">
                        <QrCode className="mr-2 h-4 w-4" />
                        Menus
                      </Button>
                    </Link>
                    <Link href={`/dashboard/restaurants/${restaurant.id}/settings`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
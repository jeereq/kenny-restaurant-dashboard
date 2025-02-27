"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, QrCode, Utensils } from "lucide-react";
import Link from "next/link";
import { MenuModal } from "@/components/menu-modal";
import { QRCodeModal } from "@/components/qr-code-modal";
import { useFetchData } from "@/hooks/use-data";

interface Menu {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export default function RestaurantMenusPage({
  params,
}: {
  params: { id: string };
}) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const { fetch: fetchMenus, loading } = useFetchData({ uri: `menus?filters[restaurant][id][$eq]=${params.id}` })

  useEffect(() => {
    // Simulation de chargement des données
    (async function () {
      const { data: { data } } = await fetchMenus()
      if (data.length != 0) {
        setMenus(data);
      }
    })()
  }, [params.id]);

  const handleSaveMenu = (menu: Menu) => {
    const newMenu = {
      ...menu,
    };
    setMenus([...menus, newMenu]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
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

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Menus</h2>
          <MenuModal onSave={handleSaveMenu} />
        </div>

        {menus.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-medium text-center mb-4">
                Vous n&apos;avez pas encore de menu
              </p>
              <MenuModal onSave={handleSaveMenu} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menus.map((menu) => (
              <Card key={menu.id}>
                <CardHeader>
                  <CardTitle>{menu.name}</CardTitle>
                  <CardDescription>{menu.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/restaurants/${params.id}/menus/${menu.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full">
                        <QrCode className="mr-2 h-4 w-4" />
                        Voir le Menu
                      </Button>
                    </Link>
                    <QRCodeModal menuId={menu.id} menuName={menu.name} />
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
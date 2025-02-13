"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Plus, QrCode, Utensils } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MenuEditModal } from "@/components/menu-edit-modal";
import { ItemModal } from "@/components/item-modal";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  description?: string;
  orderIndex: number;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  categoryId: string;
}

interface Menu {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  categories: Category[];
  items: MenuItem[];
}

const mockMenu: Menu = {
  id: "1",
  name: "Menu du Midi",
  description: "Disponible du lundi au vendredi, de 12h à 14h30",
  isActive: true,
  categories: [
    {
      id: "1",
      name: "Entrées",
      description: "Nos entrées fraîches et de saison",
      orderIndex: 0
    },
    {
      id: "2",
      name: "Plats",
      description: "Nos plats principaux",
      orderIndex: 1
    },
    {
      id: "3",
      name: "Desserts",
      description: "Pour terminer en douceur",
      orderIndex: 2
    }
  ],
  items: [
    {
      id: "1",
      name: "Salade César",
      description: "Laitue romaine, croûtons, parmesan, sauce César maison",
      price: 12.50,
      imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop&q=60",
      isAvailable: true,
      categoryId: "1"
    },
    {
      id: "2",
      name: "Steak Frites",
      description: "Steak de bœuf, frites maison, sauce au poivre",
      price: 24.90,
      imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&auto=format&fit=crop&q=60",
      isAvailable: true,
      categoryId: "2"
    },
    {
      id: "3",
      name: "Crème Brûlée",
      description: "Crème vanille, caramel croustillant",
      price: 8.50,
      imageUrl: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=800&auto=format&fit=crop&q=60",
      isAvailable: true,
      categoryId: "3"
    }
  ]
};

function MenuPage({
  params,
}: {
  params: { id: string; menuId: string };
}) {
  const router = useRouter();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de chargement des données
    setTimeout(() => {
      setMenu(mockMenu);
      setLoading(false);
    }, 500);
  }, [params.menuId]);

  const handleMenuUpdate = (updatedMenu: Partial<Menu>) => {
    if (menu) {
      setMenu({ ...menu, ...updatedMenu });
    }
  };

  const handleItemSave = (categoryId: string, item: MenuItem) => {
    if (menu) {
      const updatedItems = item.id
        ? menu.items.map((i) => (i.id === item.id ? item : i))
        : [...menu.items, { ...item, id: Math.random().toString(), isAvailable: true }];

      setMenu({ ...menu, items: updatedItems });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-xl font-medium text-center mb-4">
              Menu introuvable
            </p>
            <Link href={`/dashboard/restaurants/${params.id}/menus`}>
              <Button variant="secondary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux menus
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
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
          <Link href={`/dashboard/restaurants/${params.id}/menus`}>
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux menus
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">{menu.name}</h2>
            <p className="text-muted-foreground mt-1">{menu.description}</p>
          </div>
          <div className="flex space-x-4">
            <Link href={`/menu/${menu.id}`} target="_blank">
              <Button variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                Voir le Menu Public
              </Button>
            </Link>
            <MenuEditModal menu={menu} onSave={handleMenuUpdate} />
          </div>
        </div>

        <div className="space-y-8">
          {menu.categories.map((category) => {
            const categoryItems = menu.items.filter(
              (item) => item.categoryId === category.id
            );

            return (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{category.name}</CardTitle>
                      {category.description && (
                        <CardDescription>{category.description}</CardDescription>
                      )}
                    </div>
                    <ItemModal
                      categoryId={category.id}
                      onSave={(item) => handleItemSave(category.id, item)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start p-4 hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        <div className="flex gap-4 flex-1">
                          {item.imageUrl && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="font-medium">{item.price.toFixed(2)} €</p>
                            </div>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            )}
                            {!item.isAvailable && (
                              <span className="text-sm text-destructive">
                                Non disponible
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <ItemModal
                            categoryId={category.id}
                            item={item}
                            onSave={(updatedItem) => handleItemSave(category.id, updatedItem)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default MenuPage;
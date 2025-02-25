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
import { useFetchData } from "@/hooks/use-data";

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
  type?: string;
}

interface Menu {
  id: string;
  documentId: string;
  name: string;
  description: string;
  isActive: boolean;
  categories: Category[];
  items: MenuItem[];
}

function MenuPage({
  params,
}: {
  params: { id: string; menuId: string };
}) {
  const router = useRouter();
  const [menu, setMenu] = useState<Menu | null>(null);
  const { fetch: fetchMenus, loading } = useFetchData({ uri: `api-infos/flat/get` })

  useEffect(() => {
    // Simulation de chargement des données
    (async function () {
      const { data: { data } } = await fetchMenus({ menuId: params.menuId }, "post")
      if (data) {
        setMenu(data);
      }
    })()
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
              (item) => item.type === category.id
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
                      type={category.id}
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
                          {item.picture && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                              <Image
                                src={item.picture}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="font-medium">{item.price.toFixed(2)} $</p>
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
                            type={category.id}
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
"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils } from "lucide-react";
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
    },
    {
      id: "4",
      name: "Accompagnements",
      description: "Pour terminer en douceur",
      orderIndex: 3
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

export default function PublicMenuPage({
  params,
}: {
  params: { menuId: string };
}) {
  const [menu, setMenu] = useState<any | null>(null);
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("");
  const { fetch: fetchMenus } = useFetchData({ uri: `api-infos/flat/get` })
  const { fetch: fetchListOfMenus } = useFetchData({ uri: `menus` })
  useEffect(() => {
    // Simulation de chargement des données
    (async function () {
      setLoading(true)
      const { data: { data } } = await fetchMenus({ menuId: params.menuId }, "post")
      const { data: { data: dataMenus } } = await fetchListOfMenus({ menuId: params.menuId }, "get")

      if (dataMenus) {
        setMenus(dataMenus)
      }
      if (data) {
        setMenu(data);
        if (mockMenu.categories.length > 0) {
          setActiveCategory(mockMenu.categories[0].id);
        }
      }
      setLoading(false)
    })()
  }, [params.menuId]);

  useEffect(() => {
    const handleScroll = () => {
      if (menu) {
        const categories = menu.categories;
        for (let i = categories.length - 1; i >= 0; i--) {
          const element = document.getElementById(categories[i].id);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 200) {
              setActiveCategory(categories[i].id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menu]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-xl font-medium text-center">
              Menu introuvable
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center justify-center space-x-3">
              <Utensils className="h-8 w-8" />
              <h1 className="text-3xl font-bold tracking-tight">Chill lounge</h1>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight">{menu.name}</h2>
              <p className="text-muted-foreground mt-1">{menu.description}</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="sticky top-[120px] bg-background/80 backdrop-blur-md z-[5] border-b">
        <div className="container mx-auto px-4 py-2 overflow-x-auto">
          <div className="flex space-x-6 justify-start md:justify-center min-w-max px-4  border-b">
            {menus.map((category: any) => (
              <a
                key={category.id}
                href={`/menu/${category.id}`}
                className={`text-sm uppercase font-medium transition-colors whitespace-nowrap py-2 border-b-2 ${params.menuId == category.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
              >
                {category.name}
              </a>
            ))}
          </div>
          <div className="flex space-x-6 justify-start md:justify-center min-w-max px-4">
            {menu.categories.map((category: any) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className={`text-xs font-medium uppercase transition-colors whitespace-nowrap py-2 border-b-2 ${activeCategory === category.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-16">
          {menu.categories.map((category: any) => {
            const categoryItems = menu.items.filter(
              (item: any) => item.type === category.id
            );

            if (categoryItems.length === 0) return null;

            return (
              <section key={category.id} className="scroll-mt-48" id={category.id}>
                <div className="relative">
                  <h3 className="text-2xl font-semibold tracking-tight mb-6 pb-2 border-b">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-muted-foreground mb-6 italic">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="grid gap-8 sm:gap-6">
                  {categoryItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="group relative flex flex-col sm:flex-row gap-6 items-start p-4 rounded-xl hover:bg-accent/50 transition-all duration-300"
                    >
                      {item.picture && (
                        <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden shadow-md transition-transform group-hover:scale-105 duration-300">
                          <Image
                            src={item.picture}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-xl font-medium tracking-tight group-hover:text-primary transition-colors">
                            {item.name}
                          </h4>
                          <p className="font-medium text-lg whitespace-nowrap">
                            {item.price.toFixed(2)} Fc
                          </p>
                        </div>
                        {item.description && (
                          <p className="text-muted-foreground mt-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="border-t py-6 mt-16 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Propulsé par Chill lounge</p>
        </div>
      </footer>
    </div>
  );
}
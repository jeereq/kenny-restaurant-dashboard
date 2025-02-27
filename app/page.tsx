import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="flex items-center space-x-2">
            <Utensils className="h-12 w-12" />
            <h1 className="text-4xl font-bold">Chill lounge</h1>
          </div>
          
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Gestion de Menu Digital</CardTitle>
              <CardDescription>
                Créez et gérez vos menus numériques avec des codes QR
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <Link href="/auth/login" className="w-full">
                <Button className="w-full" size="lg">
                  Connexion
                </Button>
              </Link>
              <Link href="/auth/register" className="w-full">
                <Button variant="outline" className="w-full" size="lg">
                  Inscription
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
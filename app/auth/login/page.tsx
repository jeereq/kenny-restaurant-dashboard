"use client"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useFetchData } from "@/hooks/use-data";
import useApp from "@/hooks/use-app";
import useToast from "@/hooks/use-toast";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useApp()
  const { error: errorMessage } = useToast()
  const { fetch: fetchLogin, loading } = useFetchData({ uri: "auth/login" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Simulation de connexion
    (async function () {
      const { data, error } = await fetchLogin({ email, password }, "post");
      if (!error && data) {
        setAuth(data)
        router.push("/dashboard");
      } else {
        errorMessage(error || DEFAULT_ERROR_MESSAGE)
      }
    })()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous pour gérer vos menus de restaurant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
            <div className="text-center text-sm">
              <Link href="/auth/register" className="text-primary hover:underline">
                Pas encore de compte ? S&apos;inscrire
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
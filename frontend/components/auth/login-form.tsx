"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth-service";

const formSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(1, { message: "Senha obrigatória." }),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { access_token, user } = await authService.login(values);

      Cookies.set("cocobambu_token", access_token, { expires: 1 });
      Cookies.set("cocobambu_user", JSON.stringify(user), { expires: 1 });

      toast.success(`Bem-vindo, ${user.nome}!`);

      setTimeout(() => router.push("/dashboard"), 800);
    } catch (error) {
      toast.error("Acesso Negado", {
        description: "E-mail ou senha incorretos.",
        style: { background: "#ef4444", color: "#fff", border: "none" },
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-coco-dark/60">
                  E-mail Corporativo
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="nome@cocobambu.com"
                    {...field}
                    className="h-12 bg-gray-50/50 border-gray-200 focus-visible:ring-coco-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-coco-dark/60">
                  Senha
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      className="h-12 bg-gray-50/50 border-gray-200 focus-visible:ring-coco-primary/50 pr-10"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-coco-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-coco-dark to-[#5e2c22] hover:from-coco-primary hover:to-coco-light text-white font-bold tracking-wide transition-all duration-300 shadow-lg shadow-coco-dark/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "ACESSAR SISTEMA"
            )}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
          <span className="bg-white px-2 text-gray-400 font-semibold">
            Desafio - Felipe Rocha
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  X,
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  UserPlus,
  UserCog,
} from "lucide-react";
import { User } from "@/types/user";
import { cn } from "@/lib/utils";

// Schema de Validação
const userSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().optional(),
  is_superuser: z.boolean(),
  password: z.string().optional().or(z.literal("")),
});

type UserFormSchema = z.infer<typeof userSchema>;

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormSchema) => Promise<void>;
  userToEdit?: User | null;
  isLoading: boolean;
}

export function UserFormDialog({
  isOpen,
  onClose,
  onSave,
  userToEdit,
  isLoading,
}: UserFormDialogProps) {
  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      is_superuser: false,
      password: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        form.reset({
          nome: userToEdit.nome,
          email: userToEdit.email,
          telefone: userToEdit.telefone || "",
          is_superuser: userToEdit.is_superuser,
          password: "",
        });
      } else {
        form.reset({
          nome: "",
          email: "",
          telefone: "",
          is_superuser: false,
          password: "",
        });
      }
    }
  }, [userToEdit, form, isOpen]);

  const onSubmit: SubmitHandler<UserFormSchema> = async (data) => {
    await onSave(data);
  };

  const handleCheckboxChange = (checked: boolean | string) => {
    form.setValue("is_superuser", checked === true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] p-0 border-none rounded-lg shadow-2xl overflow-hidden bg-white [&>button]:hidden">
        <div className="bg-gradient-to-r from-[#472017] to-[#2a100b] p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3 text-white">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                {userToEdit ? (
                  <UserCog className="w-6 h-6 text-[#eea13e]" />
                ) : (
                  <UserPlus className="w-6 h-6 text-[#eea13e]" />
                )}
              </div>
              {userToEdit ? "Editar Cliente" : "Novo Cliente"}
            </DialogTitle>
            <p className="text-white/60 text-sm mt-1 ml-14">
              {userToEdit
                ? "Atualize as informações de acesso."
                : "Cadastre um novo usuário no sistema."}
            </p>
          </DialogHeader>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 grid gap-5">
          <div className="space-y-2">
            <Label
              htmlFor="nome"
              className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
            >
              Nome Fantasia
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="nome"
                placeholder="Ex: Coco Bambu"
                className="pl-10 h-11 bg-gray-50 border-transparent focus:bg-white focus:border-[#eea13e]/50 focus:ring-2 focus:ring-[#eea13e]/20 transition-all rounded-lg"
                {...form.register("nome")}
              />
            </div>
            {form.formState.errors.nome && (
              <span className="text-xs text-red-500 font-medium ml-1">
                {form.formState.errors.nome.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
              >
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="cliente@email.com"
                  className="pl-10 h-11 bg-gray-50 border-transparent focus:bg-white focus:border-[#eea13e]/50 focus:ring-2 focus:ring-[#eea13e]/20 transition-all rounded-lg"
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <span className="text-xs text-red-500 font-medium ml-1">
                  {form.formState.errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="telefone"
                className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
              >
                Telefone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  className="pl-10 h-11 bg-gray-50 border-transparent focus:bg-white focus:border-[#eea13e]/50 focus:ring-2 focus:ring-[#eea13e]/20 transition-all rounded-lg"
                  {...form.register("telefone")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="password"
                className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
              >
                Senha
              </Label>
              {userToEdit && (
                <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Opcional na edição
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder={userToEdit ? "••••••••" : "Crie uma senha segura"}
                className="pl-10 h-11 bg-gray-50 border-transparent focus:bg-white focus:border-[#eea13e]/50 focus:ring-2 focus:ring-[#eea13e]/20 transition-all rounded-lg"
                {...form.register("password")}
              />
            </div>
          </div>

          <div className="pt-2">
            <div
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer",
                form.watch("is_superuser")
                  ? "bg-[#472017]/5 border-[#472017]/20"
                  : "bg-gray-50 border-transparent hover:bg-gray-100",
              )}
            >
              <Checkbox
                id="is_superuser"
                className="mt-1 data-[state=checked]:bg-[#472017] data-[state=checked]:border-[#472017]"
                checked={form.watch("is_superuser")}
                onCheckedChange={handleCheckboxChange}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="is_superuser"
                  className="text-sm font-bold text-gray-700 cursor-pointer"
                >
                  Acesso Administrativo
                </Label>
                <p className="text-xs text-gray-500">
                  Permite gerenciar outros usuários, unidades e configurações do
                  sistema.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg h-12 px-6"
              disabled={isLoading}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#eea13e] to-[#d68b2d] text-[#472017] font-black hover:brightness-110 shadow-lg shadow-orange-500/20 rounded-lg h-12 px-8 transition-transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : (
                "Salvar Cliente"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

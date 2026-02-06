"use client";

import React, { useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  ShieldCheck,
  Loader2,
  Send,
  LogOut,
  Camera,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface UserProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  avatarUrl: string | null;
  onLogout: () => void;
  onPhotoSelect: (file: File) => void;
}

export function UserProfileSheet({
  open,
  onOpenChange,
  user,
  avatarUrl,
  onLogout,
  onPhotoSelect,
}: UserProfileSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resetLoading, setResetLoading] = React.useState(false);

  const handleResetPasswordLink = () => {
    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      toast.info("Funcionalidade em desenvolvimento (Fluxo de E-mail)");
    }, 1500);
  };

  const initials = user?.nome ? user.nome.substring(0, 2).toUpperCase() : "CB";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 border-l border-gray-200 bg-white shadow-2xl sm:rounded-l-2xl overflow-hidden"
      >
        <SheetHeader className="hidden">
          <SheetTitle>Perfil</SheetTitle>
          <SheetDescription>Gerenciar Perfil</SheetDescription>
        </SheetHeader>

        <div className="h-full flex flex-col">
          <div className="relative pt-12 pb-8 px-6 bg-gradient-to-r from-[#472017] to-[#2a100b] border-b border-white/10">
            <SheetClose className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm z-50">
              <X className="h-4 w-4" />
            </SheetClose>

            <div className="flex items-center gap-6">
              <div className="relative group shrink-0">
                <Avatar className="h-24 w-24 border-[4px] border-white/20 shadow-xl">
                  <AvatarImage src={avatarUrl || ""} className="object-cover" />
                  <AvatarFallback className="text-3xl font-bold bg-[#3a1a13] text-[#eea13e]">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {user?.is_superuser && (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 bg-[#eea13e] text-[#472017] p-2 rounded-full shadow-lg hover:brightness-110 transition-all cursor-pointer border-[3px] border-[#2a100b]"
                      title="Alterar foto"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0])
                          onPhotoSelect(e.target.files[0]);
                        e.target.value = "";
                      }}
                    />
                  </>
                )}
              </div>

              <div className="flex flex-col items-start space-y-1.5 overflow-hidden">
                <h2 className="text-xl font-black text-white tracking-tight truncate w-full">
                  {user?.nome}
                </h2>
                <p className="text-sm text-white/80 font-medium truncate w-full">
                  {user?.email}
                </p>
                <span className="inline-flex items-center rounded-md bg-white/10 border border-white/10 px-2.5 py-0.5 text-[11px] font-bold text-[#eea13e] uppercase tracking-widest backdrop-blur-md mt-1">
                  {user?.is_superuser ? "Administrador" : "Cliente"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-[#eea13e] pl-2 mb-3">
                Informações Pessoais
              </h3>
              <div className="space-y-3">
                <InfoItem icon={Mail} label="E-mail" value={user?.email} />
                <InfoItem
                  icon={Phone}
                  label="Telefone"
                  value={user?.telefone || "Não cadastrado"}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-[#eea13e] pl-2 mb-3">
                Segurança da Conta
              </h3>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-[#472017]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-800">
                      Redefinição de Senha
                    </p>
                    <p className="text-[10px] text-gray-500 leading-tight mt-1">
                      Enviaremos um link seguro para {user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleResetPasswordLink}
                  disabled={resetLoading}
                  className="w-full h-9 bg-[#472017] hover:bg-[#2a100b] text-white text-xs font-bold rounded-lg shadow-md transition-all"
                >
                  {resetLoading ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-3 w-3" />
                  )}
                  Solicitar Link
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <Button
              variant="outline"
              className="w-full h-10 border-red-200/50 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all font-bold text-xs rounded-lg"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-3.5 w-3.5" /> Sair do Sistema
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-4 border border-gray-100">
      <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400">
        <Icon size={16} />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  );
}

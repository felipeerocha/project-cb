"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { userService } from "@/services/user-service";

import { UserProfileSheet } from "@/components/profile/user-profile-sheet";
import { PhotoCropDialog } from "@/components/profile/photo-crop-dialog";

export function Header() {
  const { user, logout } = useAuth();

  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isCropOpen, setCropOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (user?.foto_url) setAvatarUrl(user.foto_url);
  }, [user]);

  const initials = user?.nome ? user.nome.substring(0, 2).toUpperCase() : "CB";

  const handlePhotoSelect = (file: File) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string);
      setCropOpen(true);
    });
    reader.readAsDataURL(file);
  };

  const handleSaveCroppedPhoto = async (croppedBlob: Blob) => {
    if (!user) return;
    setLoading(true);

    try {
      const fileToSend = new File([croppedBlob], "profile.jpg", {
        type: "image/jpeg",
      });

      const updatedUser = await userService.updatePhoto(user.id, fileToSend);

      if (updatedUser.foto_url) {
        setAvatarUrl(`${updatedUser.foto_url}?t=${new Date().getTime()}`);
      }

      setCropOpen(false);
      toast.success("Foto atualizada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar foto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30 border-b border-gray-100">
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar..."
            className="pl-10 h-11 rounded-full bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus-visible:ring-0 transition-all"
          />
        </div>

        <div className="flex items-center gap-6 ml-auto">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer group outline-none">
                <div className="text-right hidden md:block transition-opacity group-hover:opacity-80">
                  <p className="text-sm font-bold text-[#472017] leading-none">
                    {user?.nome || "Carregando..."}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">
                    {user?.is_superuser ? "Administrador" : "Cliente"}
                  </p>
                </div>
                <Avatar className="h-11 w-11 border-[3px] border-white shadow-sm ring-2 ring-transparent group-hover:ring-gray-100 transition-all">
                  <AvatarImage src={avatarUrl || user?.foto_url || ""} />
                  <AvatarFallback className="bg-[#472017] text-[#eea13e] font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown
                  size={16}
                  className="text-gray-400 group-hover:text-[#eea13e] transition-colors"
                />
              </div>
            </SheetTrigger>

            <UserProfileSheet
              open={isSheetOpen}
              onOpenChange={setSheetOpen}
              user={user}
              avatarUrl={avatarUrl}
              onLogout={logout}
              onPhotoSelect={handlePhotoSelect}
            />
          </Sheet>
        </div>
      </header>

      <PhotoCropDialog
        open={isCropOpen}
        onOpenChange={setCropOpen}
        imageSrc={imageSrc}
        loading={loading}
        onSave={handleSaveCroppedPhoto}
      />
    </>
  );
}

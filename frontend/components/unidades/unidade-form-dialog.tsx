"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import dynamic from "next/dynamic";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  X,
  Store,
  Navigation,
  Search,
  Camera,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Unidade } from "@/types/unidade";
import { toast } from "sonner";
import { unidadeService } from "@/services/unidade-service";

const LocationPicker = dynamic(
  () => import("@/components/ui/location-picker"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[300px] bg-gray-100 flex items-center justify-center text-gray-400 animate-pulse rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin mr-2" /> Carregando mapa...
      </div>
    ),
  },
);

const unidadeSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  cep: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
  regiao: z.string().min(2, "Informe a cidade/estado"),
  endereco: z.string().min(5, "Informe o endereço completo"),
  foto_url: z.string().min(1, "A foto da fachada é obrigatória"),
  latitude: z.custom<number>((val) => typeof val === "number", {
    message: "Você precisa marcar o local no mapa",
  }),
  longitude: z.custom<number>((val) => typeof val === "number", {
    message: "Você precisa marcar o local no mapa",
  }),
});

type UnidadeFormSchema = z.infer<typeof unidadeSchema>;

interface UnidadeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UnidadeFormSchema) => Promise<void>;
  unidadeToEdit?: Unidade | null;
  isLoading: boolean;
}

export function UnidadeFormDialog({
  isOpen,
  onClose,
  onSave,
  unidadeToEdit,
  isLoading,
}: UnidadeFormDialogProps) {
  const [loadingCep, setLoadingCep] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UnidadeFormSchema>({
    resolver: zodResolver(unidadeSchema),
    defaultValues: {
      nome: "",
      cep: "",
      regiao: "",
      endereco: "",
      foto_url: "",
      latitude: undefined as unknown as number,
      longitude: undefined as unknown as number,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (unidadeToEdit) {
        form.reset({
          nome: unidadeToEdit.nome,
          cep: unidadeToEdit.cep || "",
          regiao: unidadeToEdit.regiao,
          endereco: unidadeToEdit.endereco,
          foto_url: unidadeToEdit.foto_url || "",
          latitude: unidadeToEdit.latitude || (undefined as unknown as number),
          longitude:
            unidadeToEdit.longitude || (undefined as unknown as number),
        });
      } else {
        form.reset({
          nome: "",
          cep: "",
          regiao: "",
          endereco: "",
          foto_url: "",
          latitude: undefined as unknown as number,
          longitude: undefined as unknown as number,
        });
      }
    }
  }, [unidadeToEdit, form, isOpen]);

  const onSubmit: SubmitHandler<UnidadeFormSchema> = async (data) => {
    await onSave(data);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    form.setValue("latitude", lat, { shouldValidate: true });
    form.setValue("longitude", lng, { shouldValidate: true });
  };

  const handleBuscarCep = async () => {
    const cep = form.getValues("cep")?.replace(/\D/g, "");
    if (!cep || cep.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        toast.error("CEP não encontrado.");
        return;
      }

      form.setValue("endereco", `${data.logradouro}, ${data.bairro}`, {
        shouldValidate: true,
      });
      form.setValue("regiao", `${data.localidade} - ${data.uf}`, {
        shouldValidate: true,
      });

      const query = `${data.logradouro}, ${data.localidade}, ${data.uf}, Brazil`;
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      );
      const geoData = await geoResponse.json();

      if (geoData && geoData.length > 0) {
        handleLocationSelect(
          parseFloat(geoData[0].lat),
          parseFloat(geoData[0].lon),
        );
        toast.success("Endereço e localização encontrados!");
      } else {
        toast.info("Endereço preenchido. Ajuste o pino no mapa.");
      }
    } catch (error) {
      toast.error("Erro ao buscar CEP.");
    } finally {
      setLoadingCep(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await unidadeService.uploadImage(file);
      form.setValue("foto_url", url, { shouldValidate: true });
      toast.success("Foto enviada com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer upload da imagem.");
    } finally {
      setUploading(false);
    }
  };

  const getImageUrl = (url: string | undefined | null) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return `${baseURL}${url}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "sm:max-w-[1000px] p-0 border-none rounded-2xl shadow-2xl overflow-hidden bg-white",
          "[&>button]:hidden",
        )}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <div className="bg-gradient-to-r from-[#472017] to-[#2a100b] px-6 py-4 text-white relative shrink-0 flex items-center justify-between shadow-md z-20">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                <Store className="w-5 h-5 text-[#eea13e]" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black tracking-tight text-white leading-none">
                  {unidadeToEdit ? "Editar Unidade" : "Nova Unidade"}
                </DialogTitle>
                <p className="text-white/60 text-[10px] font-medium mt-0.5">
                  Preencha os dados obrigatórios.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 min-h-0">
            <div className="md:col-span-2 flex flex-col border-r border-gray-100 bg-white z-10 shadow-sm">
              <div className="p-6 flex flex-col gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">
                    Foto da Fachada *
                  </Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "relative w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-100 group overflow-hidden",
                      form.formState.errors.foto_url
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-gray-50 hover:border-[#eea13e]/50",
                      form.watch("foto_url") && "border-solid",
                    )}
                  >
                    {form.watch("foto_url") ? (
                      <>
                        <img
                          src={getImageUrl(form.watch("foto_url"))}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/600x400?text=Erro+Imagem";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="text-white w-8 h-8" />
                        </div>
                      </>
                    ) : (
                      <>
                        {uploading ? (
                          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                        ) : (
                          <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-[#eea13e] transition-colors" />
                        )}
                        <span className="text-xs font-medium text-gray-500 mt-2">
                          Clique para enviar
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  {form.formState.errors.foto_url && (
                    <span className="text-[10px] text-red-500 font-bold">
                      {form.formState.errors.foto_url.message}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label
                      htmlFor="nome"
                      className="text-[10px] font-bold text-gray-500 uppercase leading-none"
                    >
                      Nome da Unidade *
                    </Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Coco Bambu Meireles"
                      className={cn(
                        "h-10 bg-gray-50 focus:bg-white",
                        form.formState.errors.nome && "border-red-500",
                      )}
                      {...form.register("nome")}
                    />
                    {form.formState.errors.nome && (
                      <span className="text-[10px] text-red-500 font-bold">
                        {form.formState.errors.nome.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor="cep"
                      className="text-[10px] font-bold text-gray-500 uppercase leading-none"
                    >
                      CEP *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="cep"
                        placeholder="00000-000"
                        maxLength={9}
                        className={cn(
                          "h-10 bg-gray-50 focus:bg-white",
                          form.formState.errors.cep && "border-red-500",
                        )}
                        {...form.register("cep")}
                        onBlur={handleBuscarCep}
                      />
                      <Button
                        type="button"
                        onClick={handleBuscarCep}
                        disabled={loadingCep}
                        className="h-10 w-10 p-0 bg-[#eea13e] text-[#472017] shrink-0 hover:bg-[#d68b2d]"
                      >
                        {loadingCep ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {form.formState.errors.cep && (
                      <span className="text-[10px] text-red-500 font-bold">
                        {form.formState.errors.cep.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor="endereco"
                      className="text-[10px] font-bold text-gray-500 uppercase leading-none"
                    >
                      Endereço *
                    </Label>
                    <Input
                      id="endereco"
                      placeholder="Rua Canuto de Aguiar, 123 - Bairro"
                      className={cn(
                        "h-10 bg-gray-50 focus:bg-white",
                        form.formState.errors.endereco && "border-red-500",
                      )}
                      {...form.register("endereco")}
                    />
                    {form.formState.errors.endereco && (
                      <span className="text-[10px] text-red-500 font-bold">
                        {form.formState.errors.endereco.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor="regiao"
                      className="text-[10px] font-bold text-gray-500 uppercase leading-none"
                    >
                      Cidade / UF *
                    </Label>
                    <Input
                      id="regiao"
                      placeholder="Fortaleza - CE"
                      className={cn(
                        "h-10 bg-gray-50 focus:bg-white",
                        form.formState.errors.regiao && "border-red-500",
                      )}
                      {...form.register("regiao")}
                    />
                    {form.formState.errors.regiao && (
                      <span className="text-[10px] text-red-500 font-bold">
                        {form.formState.errors.regiao.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 mt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="text-gray-500 hover:bg-gray-100"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || uploading}
                    className="bg-gradient-to-r from-[#eea13e] to-[#d68b2d] text-[#472017] font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Salvar Unidade"
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 min-h-[450px] relative bg-slate-50 border-l border-gray-100">
              <LocationPicker
                initialLat={form.watch("latitude")}
                initialLng={form.watch("longitude")}
                onLocationSelect={handleLocationSelect}
              />
              {(form.formState.errors.latitude ||
                form.formState.errors.longitude) && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-bold shadow-xl flex items-center gap-2 whitespace-nowrap animate-bounce">
                  <X className="w-3 h-3" />{" "}
                  {form.formState.errors.latitude?.message}
                </div>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useMemo, useState, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Loader2,
  MapPin,
  Users,
  Utensils,
  X,
  CalendarDays,
  CheckCircle2,
  Clock,
  Map as MapIcon,
  UserIcon,
  ChefHat,
  Coffee,
  Building2,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { useReservaFlow } from "@/hooks/use-reserva-flow";
import { Unidade } from "@/types/unidade";
import { MENU_ITEMS, ReservaFormValues } from "../reservas/schema";

const ReservaMap = dynamic(() => import("@/components/reservas/reserva-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-50 flex flex-col items-center justify-center text-gray-400 gap-2">
      <Loader2 className="w-8 h-8 animate-spin text-[#eea13e]" />
      <span className="text-xs font-medium">Carregando mapa...</span>
    </div>
  ),
});

interface ReservaFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isLoading: boolean;
  isAdmin?: boolean;
  reservaToEdit?: any;
}

export function ReservaFormDialog({
  isOpen,
  onClose,
  onSave,
  isLoading,
  isAdmin,
  reservaToEdit,
}: ReservaFormDialogProps) {
  const {
    step,
    setStep,
    unidades,
    clientes = [],
    regiaoSelecionada,
    setRegiaoSelecionada,
    unidadeSelecionada,
    setUnidadeSelecionada,
    form,
  } = useReservaFlow(isOpen, isAdmin);

  const [entrada, setEntrada] = useState<string>("");
  const [prato, setPrato] = useState<string>("");
  const [sobremesa, setSobremesa] = useState<string>("");

  const listaUnidades = useMemo(() => {
    if (!unidades) return [];
    if (Array.isArray(unidades)) return unidades;
    if ((unidades as any).data && Array.isArray((unidades as any).data)) {
      return (unidades as any).data as Unidade[];
    }
    return [];
  }, [unidades]);

  const isReadOnly = reservaToEdit && reservaToEdit.status !== "EM_ANALISE";

  useEffect(() => {
    if (isOpen) {
      if (reservaToEdit) {
        setStep(3);
        const unidade =
          listaUnidades.find((u) => u.id === reservaToEdit.unidade_id) || null;
        setUnidadeSelecionada(unidade);
        form.setValue("unidade_id", reservaToEdit.unidade_id);
        form.setValue("data_reserva", new Date(reservaToEdit.data_reserva));
        form.setValue("horario_reserva", reservaToEdit.horario_reserva);
        form.setValue("qtd_pessoas", reservaToEdit.qtd_pessoas);
        if (isAdmin && reservaToEdit.user_id) {
          form.setValue("user_id", reservaToEdit.user_id);
        }

        const itens = reservaToEdit.itens_cardapio || [];
        // Helpers de cardápio...
        const findCategory = (itemName: string) => {
          const cat =
            MENU_ITEMS.find((c) => c.items.includes(itemName))?.category || "";
          if (cat.includes("Entradas")) return "entrada";
          if (cat.includes("Sobremesas")) return "sobremesa";
          return "prato";
        };

        let foundEntrada = "";
        let foundPrato = "";
        let foundSobremesa = "";

        itens.forEach((item: string) => {
          const type = findCategory(item);
          if (type === "entrada") foundEntrada = item;
          if (type === "prato") foundPrato = item;
          if (type === "sobremesa") foundSobremesa = item;
        });

        setEntrada(foundEntrada);
        setPrato(foundPrato);
        setSobremesa(foundSobremesa);
      } else {
        if (step !== 1) setStep(1);
        setEntrada("");
        setPrato("");
        setSobremesa("");
        form.reset();
      }
    }
  }, [isOpen, reservaToEdit, listaUnidades]);

  const unidadesPorRegiao = useMemo(() => {
    const grupos: Record<string, Unidade[]> = {};
    listaUnidades.forEach((u) => {
      if (!grupos[u.regiao]) grupos[u.regiao] = [];
      grupos[u.regiao].push(u);
    });
    return grupos;
  }, [listaUnidades]);

  const regioesUnicas = useMemo(
    () => Array.from(new Set(listaUnidades.map((u) => u.regiao))),
    [listaUnidades],
  );

  const unidadesFiltradas = listaUnidades.filter(
    (u) => u.regiao === regiaoSelecionada,
  );

  const entradasOptions =
    MENU_ITEMS.find((c) => c.category.includes("Entradas"))?.items || [];
  const sobremesasOptions =
    MENU_ITEMS.find((c) => c.category.includes("Sobremesas"))?.items || [];
  const pratosPrincipaisCategories = MENU_ITEMS.filter(
    (c) =>
      c.category.includes("Camarões") ||
      c.category.includes("Carnes") ||
      c.category.includes("Massas"),
  );

  const onSubmit: SubmitHandler<ReservaFormValues> = async (data) => {
    if (isReadOnly) return;

    const itensEscolhidos = [entrada, prato, sobremesa].filter(
      (item) => item !== "",
    );
    const dataFinal = `${format(data.data_reserva, "yyyy-MM-dd")}T${data.horario_reserva}`;

    await onSave({
      ...data,
      data_reserva: dataFinal,
      itens_cardapio: itensEscolhidos,
    });
  };

  const getImageUrl = (url: string | undefined | null) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return `${baseURL}${url}`;
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setEntrada("");
      setPrato("");
      setSobremesa("");
      setUnidadeSelecionada(null);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className={cn(
          "sm:max-w-[1100px] h-[90vh] p-0 border-none rounded-2xl shadow-2xl overflow-hidden bg-white flex flex-col",
          "[&>button]:hidden",
        )}
      >
        <div className="bg-gradient-to-r from-[#472017] to-[#2a100b] px-6 py-4 text-white relative shrink-0 flex items-center justify-between shadow-md z-20 min-h-[80px]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
              {isReadOnly ? (
                <Eye className="w-5 h-5 text-white/90" />
              ) : (
                <Utensils className="w-5 h-5 text-[#eea13e]" />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-black tracking-tight text-white leading-none flex items-center gap-2">
                {isReadOnly
                  ? "Detalhes da Reserva"
                  : reservaToEdit
                    ? "Editar Reserva"
                    : "Nova Reserva"}
                {isReadOnly && (
                  <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded text-white font-normal">
                    Apenas Leitura
                  </span>
                )}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-white/60 text-[10px] font-medium">
                  {reservaToEdit
                    ? "Visualizando informações completas"
                    : `Passo ${step} de 3`}
                </p>
                {!reservaToEdit && !isReadOnly && (
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 w-4 rounded-full transition-all",
                          step >= i ? "bg-[#eea13e]" : "bg-white/20",
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative bg-white flex flex-col">
          {step === 1 && !reservaToEdit && (
            <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-8 bg-slate-50/50 animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center space-y-2">
                <div className="bg-[#eea13e]/10 p-6 rounded-full w-fit mx-auto border border-[#eea13e]/20 mb-4">
                  <MapPin className="w-12 h-12 text-[#eea13e]" />
                </div>
                <h2 className="text-2xl font-bold text-[#472017] tracking-tight">
                  Onde será a experiência?
                </h2>
                <p className="text-sm text-gray-500">
                  Selecione a região para encontrar a unidade mais próxima.
                </p>
              </div>

              <div className="w-full max-w-md space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-500 uppercase ml-1">
                  Região / Cidade
                </Label>
                <Select
                  onValueChange={(val) => {
                    setRegiaoSelecionada(val);
                    setStep(2);
                  }}
                >
                  <SelectTrigger className="h-12 bg-white border-gray-200 text-base shadow-sm hover:border-[#eea13e]/50 focus:ring-2 focus:ring-[#eea13e]/20 transition-all">
                    <SelectValue placeholder="Selecione a região..." />
                  </SelectTrigger>
                  <SelectContent>
                    {regioesUnicas.map((r) => (
                      <SelectItem
                        key={r}
                        value={r}
                        className="py-3 cursor-pointer"
                      >
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && !reservaToEdit && (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-5 overflow-hidden h-full">
              <div className="md:col-span-2 border-r border-gray-100 bg-white flex flex-col h-full z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] min-h-0">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#eea13e]" />
                    <span className="font-bold text-[#472017] text-sm uppercase">
                      {regiaoSelecionada}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(1)}
                    className="text-[10px] h-7 text-gray-500 hover:text-[#472017]"
                  >
                    Trocar
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto w-full">
                  <div className="p-4 space-y-3">
                    {unidadesFiltradas.map((u: Unidade) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          setUnidadeSelecionada(u);
                          form.setValue("unidade_id", u.id);
                          setStep(3);
                        }}
                        className={cn(
                          "group relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer",
                          unidadeSelecionada?.id === u.id
                            ? "border-[#eea13e] shadow-md ring-1 ring-[#eea13e]/20"
                            : "border-gray-100 hover:border-gray-200 hover:shadow-sm",
                        )}
                      >
                        <div className="aspect-[21/9] w-full bg-gray-100 relative overflow-hidden">
                          {u.foto_url ? (
                            <img
                              src={getImageUrl(u.foto_url)}
                              alt={u.nome}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Utensils className="w-8 h-8" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                          <div className="absolute bottom-0 left-0 p-3 w-full">
                            <h4 className="font-bold text-white text-sm leading-tight shadow-black drop-shadow-md">
                              {u.nome}
                            </h4>
                          </div>
                        </div>
                        <div className="p-3 bg-white">
                          <p className="text-[11px] text-gray-500 flex items-start gap-1.5 leading-relaxed">
                            <MapPin
                              size={12}
                              className="text-[#eea13e] mt-0.5 shrink-0"
                            />
                            {u.endereco}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 h-full relative bg-gray-50">
                <ReservaMap
                  unidades={unidadesFiltradas}
                  onUnidadeSelect={(u: Unidade) => {
                    setUnidadeSelecionada(u);
                    form.setValue("unidade_id", u.id);
                    setStep(3);
                  }}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col h-full overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto bg-gray-50/30 p-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-6 space-y-6">
                    {reservaToEdit ? (
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                          <Building2 size={10} /> Unidade
                        </Label>
                        <Select
                          value={unidadeSelecionada?.id}
                          disabled={isReadOnly}
                          onValueChange={(val) => {
                            const u = listaUnidades.find(
                              (unit) => unit.id === val,
                            );
                            if (u) {
                              setUnidadeSelecionada(u);
                              form.setValue("unidade_id", u.id);
                            }
                          }}
                        >
                          <SelectTrigger
                            className={`h-12 bg-white border-gray-200 ${isReadOnly ? "opacity-70 bg-gray-50" : ""}`}
                          >
                            <SelectValue placeholder="Selecione a unidade..." />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(unidadesPorRegiao).map(
                              ([regiao, units]) => (
                                <SelectGroup key={regiao}>
                                  <SelectLabel className="text-[#472017] font-bold text-xs bg-orange-50 pl-2 py-1.5">
                                    {regiao}
                                  </SelectLabel>
                                  {units.map((u) => (
                                    <SelectItem key={u.id} value={u.id}>
                                      {u.nome}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      unidadeSelecionada && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-center">
                          <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            <img
                              src={getImageUrl(unidadeSelecionada.foto_url)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">
                              Unidade Selecionada
                            </p>
                            <h3 className="font-bold text-[#472017]">
                              {unidadeSelecionada.nome}
                            </h3>
                            <p className="text-[11px] text-gray-500 line-clamp-1">
                              {unidadeSelecionada.endereco}
                            </p>
                          </div>
                          {!isReadOnly && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setStep(2)}
                              className="ml-auto h-8 w-8 text-gray-400 hover:text-[#eea13e]"
                            >
                              <MapIcon size={16} />
                            </Button>
                          )}
                        </div>
                      )
                    )}

                    <div className="space-y-4">
                      {isAdmin && (
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                            <UserIcon size={10} /> Cliente (Admin)
                          </Label>
                          <Select
                            disabled={isReadOnly}
                            onValueChange={(val) =>
                              form.setValue("user_id", val)
                            }
                            defaultValue={
                              form.getValues("user_id") || undefined
                            }
                          >
                            <SelectTrigger
                              className={`h-10 bg-white border-gray-200 ${isReadOnly ? "opacity-70 bg-gray-50" : ""}`}
                            >
                              <SelectValue placeholder="Buscar cliente..." />
                            </SelectTrigger>
                            <SelectContent>
                              {(clientes || []).map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
                          <CalendarDays className="w-4 h-4 text-[#eea13e]" />
                          <span className="text-xs font-bold text-[#472017] uppercase">
                            Data e Hora
                          </span>
                        </div>

                        <div
                          className={`flex justify-center ${isReadOnly ? "pointer-events-none opacity-80" : ""}`}
                        >
                          <Calendar
                            mode="single"
                            selected={form.watch("data_reserva")}
                            onSelect={(d) =>
                              !isReadOnly &&
                              d &&
                              form.setValue("data_reserva", d)
                            }
                            locale={ptBR}
                            disabled={(date) => date < new Date()}
                            className="border-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                              <Clock size={10} /> Horário
                            </Label>
                            <Select
                              disabled={isReadOnly}
                              onValueChange={(v) =>
                                form.setValue("horario_reserva", v)
                              }
                              defaultValue={form.getValues("horario_reserva")}
                            >
                              <SelectTrigger
                                className={`h-10 bg-white border-gray-200 ${isReadOnly ? "opacity-70 bg-gray-50" : ""}`}
                              >
                                <SelectValue placeholder="--:--" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "19:00",
                                  "19:30",
                                  "20:00",
                                  "20:30",
                                  "21:00",
                                  "21:30",
                                  "22:00",
                                ].map((h) => (
                                  <SelectItem key={h} value={h}>
                                    {h}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                              <Users size={10} /> Pessoas
                            </Label>
                            <Input
                              disabled={isReadOnly}
                              type="number"
                              {...form.register("qtd_pessoas", {
                                valueAsNumber: true,
                              })}
                              className={`h-10 bg-white border-gray-200 focus:bg-white ${isReadOnly ? "opacity-70 bg-gray-50" : ""}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 flex flex-col">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-fit">
                      <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-[#eea13e]" />
                          <span className="text-xs font-bold text-[#472017] uppercase">
                            Pré-seleção de Cardápio
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">
                          Opcional
                        </span>
                      </div>

                      <div className="p-6 space-y-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-[#eea13e] uppercase flex items-center gap-1.5">
                            <Utensils size={12} /> Entrada
                          </Label>
                          <Select
                            disabled={isReadOnly}
                            value={entrada}
                            onValueChange={setEntrada}
                          >
                            <SelectTrigger className="h-11 bg-white border-gray-200 focus:ring-[#eea13e]/20">
                              <SelectValue placeholder="Escolha uma entrada..." />
                            </SelectTrigger>
                            <SelectContent>
                              {entradasOptions.map((item) => (
                                <SelectItem key={item} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-[#eea13e] uppercase flex items-center gap-1.5">
                            <ChefHat size={12} /> Prato Principal
                          </Label>
                          <Select
                            disabled={isReadOnly}
                            value={prato}
                            onValueChange={setPrato}
                          >
                            <SelectTrigger className="h-11 bg-white border-gray-200 focus:ring-[#eea13e]/20">
                              <SelectValue placeholder="Escolha seu prato..." />
                            </SelectTrigger>
                            <SelectContent>
                              {pratosPrincipaisCategories.map((cat) => (
                                <SelectGroup key={cat.category}>
                                  <SelectLabel className="text-[#472017] font-bold text-xs">
                                    {cat.category}
                                  </SelectLabel>
                                  {cat.items.map((item) => (
                                    <SelectItem key={item} value={item}>
                                      {item}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-[#eea13e] uppercase flex items-center gap-1.5">
                            <Coffee size={12} /> Sobremesa
                          </Label>
                          <Select
                            disabled={isReadOnly}
                            value={sobremesa}
                            onValueChange={setSobremesa}
                          >
                            <SelectTrigger className="h-11 bg-white border-gray-200 focus:ring-[#eea13e]/20">
                              <SelectValue placeholder="Para finalizar..." />
                            </SelectTrigger>
                            <SelectContent>
                              {sobremesasOptions.map((item) => (
                                <SelectItem key={item} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-gray-200 bg-white flex justify-end items-center gap-3 shrink-0 z-20">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold uppercase h-10 px-6 rounded-md"
                >
                  {isReadOnly ? "Fechar" : "Cancelar"}
                </Button>

                {!isReadOnly && (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#eea13e] to-[#d68b2d] text-[#472017] font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform h-10 px-8 rounded-md"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      <>
                        {reservaToEdit
                          ? "Atualizar Reserva"
                          : "Confirmar Reserva"}
                        <CheckCircle2 className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

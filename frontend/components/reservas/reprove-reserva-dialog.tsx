"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ReproveReservaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
  isLoading: boolean;
}

const MOTIVOS_REPROVACAO = [
  "Lotação máxima da unidade excedida",
  "Horário solicitado indisponível",
  "Manutenção não programada na unidade",
  "Dados do cliente inconsistentes",
  "Solicitação duplicada",
  "Política de reservas da empresa",
  "Outros",
];

export function ReproveReservaDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ReproveReservaDialogProps) {
  const [motivo, setMotivo] = useState<string>("");

  const handleConfirm = () => {
    if (motivo) {
      onConfirm(motivo);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 border-none rounded-2xl shadow-2xl overflow-hidden bg-white [&>button]:hidden">
        <div className="p-6 text-white relative bg-gradient-to-r from-[#472017] to-[#2a100b]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-3 text-white">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              Reprovar Reserva
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600 leading-relaxed text-sm">
            Esta ação negará a solicitação do cliente e não poderá ser desfeita.
            É obrigatório informar o motivo para notificar o cliente.
          </p>

          <div className="space-y-2 pt-2">
            <Label className="text-xs font-bold text-gray-500 uppercase">
              Selecione o Motivo
            </Label>
            <Select onValueChange={setMotivo}>
              <SelectTrigger className="h-11 bg-white border-gray-200 focus:ring-[#472017]/20 focus:border-[#472017]">
                <SelectValue placeholder="Selecione um motivo..." />
              </SelectTrigger>
              <SelectContent>
                {MOTIVOS_REPROVACAO.map((m) => (
                  <SelectItem key={m} value={m} className="cursor-pointer">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 font-bold text-gray-500 hover:text-gray-900 h-10"
            disabled={isLoading}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading || !motivo}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black h-10 shadow-lg shadow-red-500/20 transition-transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              "Confirmar Reprovação"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

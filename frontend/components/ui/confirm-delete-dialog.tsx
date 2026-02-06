"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, X, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  isLoading?: boolean;
  isBlocked?: boolean;
  reason?: string;
}

export function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading,
  isBlocked = false,
  reason,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] p-0 border-none rounded-2xl shadow-2xl overflow-hidden bg-white [&>button]:hidden">
        <div
          className={cn(
            "p-6 text-white relative bg-gradient-to-r",
            isBlocked
              ? "from-amber-600 to-amber-800"
              : "from-[#472017] to-[#2a100b]",
          )}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-3 text-white">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                {isBlocked ? (
                  <ShieldAlert className="w-6 h-6 text-amber-200" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                )}
              </div>
              {isBlocked ? "Ação Impedida" : title}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600 leading-relaxed text-sm">
            {isBlocked
              ? "Esta unidade não pode ser excluída no momento."
              : description}
          </p>

          {isBlocked && reason && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <p className="text-amber-800 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                <ShieldAlert size={14} /> Motivo do impedimento:
              </p>
              <p className="text-amber-900 text-sm font-medium italic">
                "{reason}"
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-0 flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 font-bold text-gray-500 hover:text-gray-900"
            disabled={isLoading}
          >
            {isBlocked ? "Entendi e Voltar" : "Cancelar"}
          </Button>

          {!isBlocked && (
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black shadow-lg shadow-red-500/20 transition-transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirmar Exclusão"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

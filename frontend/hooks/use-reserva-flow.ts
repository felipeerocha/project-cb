import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Unidade } from "@/types/unidade";
import { User } from "@/types/user";
import { reservaSchema, ReservaFormValues } from "@/components/reservas/schema";

import { unidadeService } from "@/services/unidade-service";
import { userService } from "@/services/user-service";

export function useReservaFlow(isOpen: boolean, isAdmin: boolean = false) {
  const [step, setStep] = useState(1);
  const [regiaoSelecionada, setRegiaoSelecionada] = useState<string>("");
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<Unidade | null>(
    null,
  );

  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [clientes, setClientes] = useState<User[]>([]);

  const form = useForm<ReservaFormValues>({
    resolver: zodResolver(reservaSchema) as any,
    defaultValues: {
      unidade_id: "",
      horario_reserva: "",
      qtd_pessoas: 2,
      itens_cardapio: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const { data: listaUnidades } = await unidadeService.getAll(
            1,
            1000,
            "",
            "nome",
          );
          setUnidades(listaUnidades || []);

          if (isAdmin) {
            const { data: listaUsers } = await userService.getAll(1, 1000);
            setClientes(listaUsers || []);
          }
        } catch (error) {
          console.error("Erro ao carregar dados para reserva:", error);
        }
      };

      fetchData();
    }
  }, [isOpen, isAdmin]);

  const toggleItem = (item: string) => {
    const current = form.getValues("itens_cardapio") || [];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];

    form.setValue("itens_cardapio", updated, { shouldValidate: true });
  };

  return {
    step,
    setStep,
    unidades,
    clientes,
    regiaoSelecionada,
    setRegiaoSelecionada,
    unidadeSelecionada,
    setUnidadeSelecionada,
    form,
    toggleItem,
  };
}

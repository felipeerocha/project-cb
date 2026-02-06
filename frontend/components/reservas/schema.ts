import * as z from "zod";

export const MENU_ITEMS = [
  {
    category: "🦐 Entradas e Saladas",
    items: [
      "Salada Caesar de Camarão",
      "Salada Caesar de Frango",
      "Salada Caprese",
      "Salada Coco Bambu",
      "Salada Costa Azul",
      "Bruschettas de tapioca",
    ],
  },
  {
    category: "🍤 Camarões e Frutos do Mar",
    items: [
      "Camarão Coco Bambu",
      "Camarão Alfredo",
      "Camarão Jurerê",
      "Camarão Capri",
      "Camarão Aruba",
      "Moqueca Cearense",
      "Peixada Cearense",
      "Peixe à Meunière",
      "Salmão em crosta de gergelim",
    ],
  },
  {
    category: "🍖 Carnes e Aves",
    items: [
      "Carne de Sol do Sertão",
      "Filé de carne com acompanhamentos",
      "Frango grelhado ao molho",
    ],
  },
  {
    category: "🍝 Massas",
    items: ["Espaguete Coco Bambu", "Carbonara Coco Bambu"],
  },
  {
    category: "🍰 Sobremesas",
    items: [
      "Cocada ao Forno",
      "Cocada Mole",
      "Torta de Maçã",
      "Torta de Limão",
      "Creme de Papaya",
      "Mousse de Chocolate",
      "Petit Gateau",
      "Pudim de Leite",
    ],
  },
  {
    category: "🍹 Bebidas",
    items: ["Sucos variados", "Limonadas", "Refrigerantes"],
  },
];

export const reservaSchema = z.object({
  unidade_id: z.string().min(1, "Selecione uma unidade"),
  data_reserva: z
    .date()
    .min(new Date("1900-01-01"), { message: "Selecione o dia" }),
  horario_reserva: z.string().min(1, "Selecione o horário"),
  qtd_pessoas: z.number().min(1, "Mínimo 1 pessoa"),
  user_id: z.string().optional(),
  itens_cardapio: z.array(z.string()).optional().default([]),
});

export type ReservaFormValues = z.infer<typeof reservaSchema>;

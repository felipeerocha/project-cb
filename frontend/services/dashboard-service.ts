import { unidadeService } from "./unidade-service";
import { userService } from "./user-service";
import { reservaService } from "./reserva-service";

export const dashboardService = {
  getAdminStats: async () => {
    const [unidadesData, usersData, reservasData] = await Promise.all([
      unidadeService.getAll(1, 1000),
      userService.getAll(1, 1),
      reservaService.getAll({ page: 1, limit: 1000, sort: "-data_reserva" }),
    ]);

    const reservas = reservasData.data || [];

    const aprovadas = reservas.filter(
      (r: any) => r.status === "APROVADO",
    ).length;
    const analise = reservas.filter(
      (r: any) => r.status === "EM_ANALISE",
    ).length;
    const reprovadas = reservas.filter(
      (r: any) => r.status === "REPROVADO",
    ).length;

    // 2. Cálculo do Gráfico (Agrupar por Data)
    const timelineMap: Record<string, number> = {};
    reservas.forEach((r: any) => {
      const dataObj = new Date(r.data_reserva);
      const diaMes = dataObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      timelineMap[diaMes] = (timelineMap[diaMes] || 0) + 1;
    });

    const chartData = Object.entries(timelineMap)
      .map(([name, value]) => ({ name, value }))
      .reverse()
      .slice(-7);

    return {
      totalUnidades: unidadesData.total,
      totalUsers: usersData.total,
      totalReservas: reservasData.total,
      statusDistrib: { aprovadas, analise, reprovadas },
      chartData,
    };
  },

  getClientStats: async () => {
    const { data: reservas, total } = await reservaService.getAll({
      page: 1,
      limit: 100,
      sort: "-data_reserva",
    });

    const aprovadas = reservas.filter(
      (r: any) => r.status === "APROVADO",
    ).length;
    const analise = reservas.filter(
      (r: any) => r.status === "EM_ANALISE",
    ).length;
    const reprovadas = reservas.filter(
      (r: any) => r.status === "REPROVADO",
    ).length;

    const recentes = reservas
      .filter((r: any) => r.status === "APROVADO")
      .slice(0, 5);

    return {
      total,
      aprovadas,
      analise,
      reprovadas,
      recentes,
    };
  },
};

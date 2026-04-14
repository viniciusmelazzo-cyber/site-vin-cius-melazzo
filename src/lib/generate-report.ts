import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateHealthScore, getScoreLabel } from "@/lib/health-score";
import { calcPatrimonio, getRendaLiquida, getParcelasDividas, type PatrimonioBreakdown } from "@/lib/onboarding-finance";
import { LOGO_BASE64 } from "@/lib/logo-base64";

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const pct = (v: number) => `${v.toFixed(1)}%`;

interface ReportData {
  clientName: string;
  month: string;
  entries: any[];
  onboarding: any;
  debts: any[];
  budgets: any[];
  snapshots: any[];
}

export function generateFinancialReport(data: ReportData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = 0;

  // Brand colors — Melazzo palette
  const navy = [10, 25, 47] as const;      // #0A192F
  const gold = [200, 162, 92] as const;     // #C8A25C
  const graphite = [54, 69, 79] as const;   // #36454F
  const linen = [245, 245, 220] as const;   // #F5F5DC
  const agro = [0, 75, 73] as const;        // #004B49
  const green = [46, 125, 50] as const;
  const red = [198, 40, 40] as const;

  const checkPage = (needed: number) => {
    if (y + needed > 270) {
      doc.addPage();
      y = 20;
    }
  };

  const sectionTitle = (title: string) => {
    checkPage(15);
    doc.setFillColor(...gold);
    doc.rect(margin, y, contentW, 8, "F");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 3, y + 5.5);
    y += 12;
    doc.setTextColor(...navy);
  };

  const labelValue = (label: string, value: string, indent = 0) => {
    checkPage(6);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...graphite);
    doc.text(label, margin + indent, y);
    doc.setTextColor(...navy);
    doc.setFont("helvetica", "bold");
    doc.text(value, pageW - margin, y, { align: "right" });
    y += 5;
  };

  // ========== COVER ==========
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageW, 297, "F");

  // Gold accent lines
  doc.setFillColor(...gold);
  doc.rect(margin, 35, contentW, 1, "F");
  doc.rect(margin, 37, contentW * 0.4, 0.5, "F");

  // Logo
  try {
    doc.addImage(LOGO_BASE64, "PNG", pageW / 2 - 20, 50, 40, 40);
  } catch { /* logo optional */ }

  // Company name
  doc.setFontSize(10);
  doc.setTextColor(...gold);
  doc.setFont("helvetica", "bold");
  doc.text("MELAZZO CONSULTORIA", pageW / 2, 98, { align: "center" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  doc.text("Estratégia  •  Performance  •  Jurídico  •  Crédito", pageW / 2, 104, { align: "center" });

  // Gold separator
  doc.setFillColor(...gold);
  doc.rect(pageW / 2 - 25, 110, 50, 0.5, "F");

  // Report title
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Relatório Financeiro", pageW / 2, 130, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(...gold);
  doc.text("Consolidado", pageW / 2, 140, { align: "center" });

  // Client info
  doc.setFontSize(12);
  doc.setTextColor(220, 220, 220);
  doc.setFont("helvetica", "normal");
  doc.text(data.clientName, pageW / 2, 160, { align: "center" });

  const [y2, m2] = data.month.split("-");
  const monthName = new Date(Number(y2), Number(m2) - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  doc.setTextColor(180, 180, 180);
  doc.text(monthName.charAt(0).toUpperCase() + monthName.slice(1), pageW / 2, 168, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, pageW / 2, 180, { align: "center" });

  // Footer
  doc.setFillColor(...gold);
  doc.rect(margin, 265, contentW, 0.5, "F");
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text("Documento confidencial — uso exclusivo do cliente e consultor", pageW / 2, 275, { align: "center" });

  // ========== PAGE 2: DRE ==========
  doc.addPage();
  y = 20;

  const monthEntries = data.entries.filter((e) => {
    const d = new Date(e.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === data.month;
  });

  const receitas = monthEntries.filter((e) => e.type === "receita");
  const despesas = monthEntries.filter((e) => e.type === "despesa");
  const totalRec = receitas.reduce((s, e) => s + Number(e.amount), 0);
  const totalDesp = despesas.reduce((s, e) => s + Number(e.amount), 0);
  const resultado = totalRec - totalDesp;

  sectionTitle("DRE — Demonstrativo de Resultado");

  labelValue("Total Receitas", fmt(totalRec));
  labelValue("Total Despesas", fmt(totalDesp));

  doc.setFillColor(230, 230, 230);
  doc.rect(margin, y - 1, contentW, 0.3, "F");
  y += 2;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(resultado >= 0 ? green[0] : red[0], resultado >= 0 ? green[1] : red[1], resultado >= 0 ? green[2] : red[2]);
  doc.text("Resultado Líquido", margin, y);
  doc.text(fmt(resultado), pageW - margin, y, { align: "right" });
  y += 8;
  doc.setTextColor(...navy);

  // Receitas por categoria
  if (receitas.length > 0) {
    checkPage(10);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Receitas por Categoria", margin, y);
    y += 4;
    const recCats: Record<string, number> = {};
    receitas.forEach((e) => { recCats[e.category] = (recCats[e.category] || 0) + Number(e.amount); });
    Object.entries(recCats).sort((a, b) => b[1] - a[1]).forEach(([cat, val]) => {
      labelValue(`  ${cat}`, fmt(val));
    });
    y += 3;
  }

  // Despesas por categoria
  if (despesas.length > 0) {
    checkPage(10);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Despesas por Categoria", margin, y);
    y += 4;
    const despCats: Record<string, number> = {};
    despesas.forEach((e) => { despCats[e.category] = (despCats[e.category] || 0) + Number(e.amount); });
    Object.entries(despCats).sort((a, b) => b[1] - a[1]).forEach(([cat, val]) => {
      labelValue(`  ${cat}`, fmt(val));
    });
    y += 3;
  }

  // ========== INDICADORES ==========
  const rendaLiquida = getRendaLiquida(data.onboarding);
  if (rendaLiquida > 0) {
    sectionTitle("Indicadores Financeiros");

    const margLiq = totalRec > 0 ? (resultado / totalRec) * 100 : 0;
    const compRenda = rendaLiquida > 0 ? (totalDesp / rendaLiquida) * 100 : 0;
    const parcelasDividas = getParcelasDividas(data.debts);
    const endividamento = rendaLiquida > 0 ? (parcelasDividas / rendaLiquida) * 100 : 0;

    labelValue("Margem Líquida", pct(margLiq));
    labelValue("Comprometimento da Renda", pct(compRenda));
    labelValue("Endividamento s/ Renda", pct(endividamento));
    labelValue("Parcelas de Dívidas", fmt(parcelasDividas));
    y += 3;
  }

  // ========== PATRIMÔNIO ==========
  if (data.onboarding) {
    const pat = calcPatrimonio(data.onboarding, data.debts);

    sectionTitle("Patrimônio Líquido");

    labelValue("Ativos Financeiros", fmt(pat.liquidez.total));
    labelValue("Ativos Imobilizados", fmt(pat.imobilizado.total));
    labelValue("Total Ativos", fmt(pat.liquidez.total + pat.imobilizado.total));
    y += 1;
    labelValue("Total Passivos", fmt(pat.passivos.total));

    doc.setFillColor(230, 230, 230);
    doc.rect(margin, y - 1, contentW, 0.3, "F");
    y += 2;

    const pl = pat.patrimonio_liquido;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(pl >= 0 ? green[0] : red[0], pl >= 0 ? green[1] : red[1], pl >= 0 ? green[2] : red[2]);
    doc.text("Patrimônio Líquido", margin, y);
    doc.text(fmt(pl), pageW - margin, y, { align: "right" });
    y += 8;
    doc.setTextColor(...navy);

    // Breakdown table
    checkPage(40);
    const assetRows = [
      ["Poupança", fmt(pat.liquidez.poupanca)],
      ["CDB/LCI/LCA", fmt(pat.liquidez.cdb_lci_lca)],
      ["Tesouro Direto", fmt(pat.liquidez.tesouro_direto)],
      ["Ações/Fundos", fmt(pat.liquidez.acoes_fundos)],
      ["Previdência Privada", fmt(pat.liquidez.previdencia_privada)],
      ["Imóveis", fmt(pat.imobilizado.imovel_principal + pat.imobilizado.outros_imoveis)],
      ["Veículos", fmt(pat.imobilizado.veiculos)],
    ].filter(([, v]) => v !== "R$ 0,00");

    if (assetRows.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [["Ativo", "Valor"]],
        body: assetRows,
        margin: { left: margin, right: margin },
        styles: { fontSize: 8, font: "helvetica", cellPadding: 2 },
        headStyles: { fillColor: [180, 155, 90], textColor: [255, 255, 255], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [245, 245, 240] },
        theme: "grid",
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }
  }

  // ========== HEALTH SCORE ==========
  if (data.onboarding) {
    const pat = calcPatrimonio(data.onboarding, data.debts);
    const DESP_FIXA_CATS = ["Moradia", "Transporte", "Saúde", "Educação", "Cartão de Crédito"];
    const despFixas = monthEntries
      .filter((e: any) => e.type === "despesa" && DESP_FIXA_CATS.includes(e.category))
      .reduce((s: number, e: any) => s + Number(e.amount), 0);

    const hs = calculateHealthScore({
      despesasFixas: despFixas,
      rendaLiquida: getRendaLiquida(data.onboarding),
      resultadoLiquido: resultado,
      totalReceitas: totalRec,
      liquidezAlta: pat.liquidez_alta,
      passivosTotal: pat.passivos.total,
      ativosTotal: pat.liquidez.total + pat.imobilizado.total,
    });

    sectionTitle("Health Score Financeiro");

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    const scoreColor = hs.classification === "excellent" ? green : hs.classification === "moderate" ? [180, 155, 90] as const : red;
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${hs.total}`, margin, y + 2);
    doc.setFontSize(10);
    doc.text(`/ 100  —  ${getScoreLabel(hs.classification)}`, margin + 15, y + 2);
    y += 10;
    doc.setTextColor(...navy);

    autoTable(doc, {
      startY: y,
      head: [["Pilar", "Score", "Peso", "Observação"]],
      body: [
        [hs.p1.label, `${hs.p1.score}`, "40%", `${hs.p1.raw.toFixed(1)}% da renda`],
        [hs.p2.label, `${hs.p2.score}`, "30%", `${hs.p2.raw.toFixed(1)}% poupados`],
        [hs.p3.label, `${hs.p3.score}`, "20%", `${hs.p3.raw.toFixed(1)} meses`],
        [hs.p4.label, `${hs.p4.score}`, "10%", `${hs.p4.raw.toFixed(1)}% endividado`],
      ],
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, font: "helvetica", cellPadding: 2 },
      headStyles: { fillColor: [180, 155, 90], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 240] },
      theme: "grid",
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ========== ORÇAMENTO ==========
  const monthBudgets = data.budgets.filter((b) => b.month === data.month);
  if (monthBudgets.length > 0) {
    sectionTitle("Orçamento Base Zero");

    const budgetRows = monthBudgets.map((b) => {
      const realizado = monthEntries
        .filter((e: any) => e.type === "despesa" && e.category === b.category)
        .reduce((s: number, e: any) => s + Number(e.amount), 0);
      const pctUsed = b.planned_amount > 0 ? (realizado / b.planned_amount) * 100 : 0;
      return [b.category, b.type, fmt(b.planned_amount), fmt(realizado), `${pctUsed.toFixed(0)}%`];
    });

    autoTable(doc, {
      startY: y,
      head: [["Categoria", "Tipo", "Planejado", "Realizado", "% Usado"]],
      body: budgetRows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, font: "helvetica", cellPadding: 2 },
      headStyles: { fillColor: [180, 155, 90], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 240] },
      theme: "grid",
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ========== PARCELAMENTOS ==========
  const installmentEntries = data.entries.filter((e) => e.installment_group_id);
  if (installmentEntries.length > 0) {
    const groups = new Map<string, any[]>();
    installmentEntries.forEach((e) => {
      const list = groups.get(e.installment_group_id) || [];
      list.push(e);
      groups.set(e.installment_group_id, list);
    });

    sectionTitle("Parcelamentos");

    const parcRows = Array.from(groups.values()).map((items) => {
      items.sort((a: any, b: any) => (a.installment_current || 0) - (b.installment_current || 0));
      const total = items[0].installment_total || items.length;
      const paid = items.length;
      const desc = items[0].description.replace(/\s*\(\d+\/\d+\)/, "");
      return [desc, items[0].category, fmt(items[0].amount), `${paid}/${total}`, fmt(items[0].amount * total)];
    });

    autoTable(doc, {
      startY: y,
      head: [["Descrição", "Categoria", "Parcela", "Progresso", "Total"]],
      body: parcRows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, font: "helvetica", cellPadding: 2 },
      headStyles: { fillColor: [180, 155, 90], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 240] },
      theme: "grid",
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ========== EVOLUÇÃO (snapshots) ==========
  if (data.snapshots.length > 0) {
    sectionTitle("Evolução Mensal");

    const snapRows = data.snapshots.map((s) => {
      const [sy, sm] = s.month.split("-");
      const label = new Date(Number(sy), Number(sm) - 1).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      return [label, fmt(s.receitas), fmt(s.despesas), fmt(s.resultado), fmt(s.patrimonio_liquido), String(s.health_score)];
    });

    autoTable(doc, {
      startY: y,
      head: [["Mês", "Receitas", "Despesas", "Resultado", "Patrimônio", "Score"]],
      body: snapRows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 7, font: "helvetica", cellPadding: 2 },
      headStyles: { fillColor: [180, 155, 90], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 240] },
      theme: "grid",
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ========== FOOTER on all pages ==========
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página ${i} de ${totalPages}`, pageW / 2, 290, { align: "center" });
  }

  // Save
  const fileName = `relatorio-financeiro-${data.month}.pdf`;
  doc.save(fileName);
}

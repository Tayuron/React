// Перевірка сумісності. sel = { cpu, cooler, motherboard, ram, gpu, psu, case } з обʼєктами варіантів.
export const estimatePower = (sel) => (sel.cpu || sel.gpu ? (sel.cpu?.tdp ?? 0) + (sel.gpu?.tdp ?? 0) + 100 : 0);
export const recommendedPsu = (power) => Math.ceil((power * 1.3) / 50) * 50;

export function getIssues(sel) {
  const { cpu, cooler, motherboard: mb, ram, psu, case: pcCase } = sel;
  const out = [];
  const add = (severity, categories, message) => out.push({ severity, categories, message });

  if (cpu && mb && cpu.socket !== mb.socket) {
    add('error', ['cpu', 'motherboard'], `Процесор (${cpu.socket}) не підходить до плати (${mb.socket})`);
  }
  if (ram && mb && ram.ramType !== mb.ramType) {
    add('error', ['ram', 'motherboard'], `Памʼять ${ram.ramType} не підходить до плати (${mb.ramType})`);
  }
  if (cooler && (cpu || mb)) {
    const socket = cpu?.socket ?? mb.socket;
    if (!cooler.sockets.includes(socket)) {
      add('error', ['cooler', cpu ? 'cpu' : 'motherboard'], `Кулер не підтримує сокет ${socket}`);
    }
  }
  if (cooler && cpu && cooler.coolTdp < cpu.tdp) {
    add('warning', ['cooler', 'cpu'], `Кулер розрахований на ${cooler.coolTdp} Вт, а процесор виділяє ${cpu.tdp} Вт`);
  }
  if (pcCase && mb && !pcCase.formFactors.includes(mb.formFactor)) {
    add('error', ['case', 'motherboard'], `Плата ${mb.formFactor} не підходить до корпусу`);
  }
  const power = estimatePower(sel);
  if (psu && power && psu.watts < recommendedPsu(power)) {
    add('warning', ['psu', 'cpu', 'gpu'], `Блок живлення ${psu.watts} Вт замалий, рекомендовано від ${recommendedPsu(power)} Вт`);
  }
  return out;
}

// Auto-generated from Worlds 2026 pro meta data provided by the user.
// Champion pro stats reflect Worlds only; soloq KR Challenger values are preserved from the prior dataset.
// Locke was added with Worlds stats and Riot-confirmed mid / Assassin-Mage classification.
//
// Un fișier per campion în acest folder; ordinea din `baseChampions` e ordinea
// istorică (influențează tie-break-urile din draft) — un campion nou se adaugă
// la import ȘI în listă, pe poziția dorită.

import type { Champion, ChampionCarryProfile } from "../../types/champion";
import { orianna } from "./orianna";
import { ambessa } from "./ambessa";
import { jarvanIv } from "./jarvan-iv";
import { rumble } from "./rumble";
import { vi } from "./vi";
import { neeko } from "./neeko";
import { nautilus } from "./nautilus";
import { varus } from "./varus";
import { ryze } from "./ryze";
import { yunara } from "./yunara";
import { azir } from "./azir";
import { xinZhao } from "./xin-zhao";
import { karma } from "./karma";
import { ezreal } from "./ezreal";
import { pantheon } from "./pantheon";
import { caitlyn } from "./caitlyn";
import { ahri } from "./ahri";
import { bard } from "./bard";
import { taliyah } from "./taliyah";
import { sion } from "./sion";
import { ksante } from "./ksante";
import { drMundo } from "./dr-mundo";
import { zaahen } from "./zaahen";
import { ashe } from "./ashe";
import { corki } from "./corki";
import { aurora } from "./aurora";
import { gwen } from "./gwen";
import { renekton } from "./renekton";
import { lulu } from "./lulu";
import { wukong } from "./wukong";
import { gnar } from "./gnar";
import { aatrox } from "./aatrox";
import { akali } from "./akali";
import { nocturne } from "./nocturne";
import { nami } from "./nami";
import { alistar } from "./alistar";
import { kaisa } from "./kaisa";
import { galio } from "./galio";
import { sivir } from "./sivir";
import { seraphine } from "./seraphine";
import { anivia } from "./anivia";
import { rakan } from "./rakan";
import { syndra } from "./syndra";
import { leona } from "./leona";
import { mel } from "./mel";
import { ornn } from "./ornn";
import { braum } from "./braum";
import { jhin } from "./jhin";
import { aphelios } from "./aphelios";
import { xayah } from "./xayah";
import { jax } from "./jax";
import { jayce } from "./jayce";
import { rell } from "./rell";
import { poppy } from "./poppy";
import { viktor } from "./viktor";
import { malphite } from "./malphite";
import { annie } from "./annie";
import { naafiri } from "./naafiri";
import { leblanc } from "./leblanc";
import { qiyana } from "./qiyana";
import { sylas } from "./sylas";
import { cassiopeia } from "./cassiopeia";
import { trundle } from "./trundle";
import { leeSin } from "./lee-sin";
import { kennen } from "./kennen";
import { yone } from "./yone";
import { zoe } from "./zoe";
import { lux } from "./lux";
import { yasuo } from "./yasuo";
import { rengar } from "./rengar";
import { aurelionSol } from "./aurelion-sol";
import { olaf } from "./olaf";
import { maokai } from "./maokai";
import { nidalee } from "./nidalee";
import { lucian } from "./lucian";
import { irelia } from "./irelia";
import { jinx } from "./jinx";
import { sejuani } from "./sejuani";
import { pyke } from "./pyke";
import { kogmaw } from "./kogmaw";
import { yorick } from "./yorick";
import { thresh } from "./thresh";
import { nunu } from "./nunu";
import { camille } from "./camille";
import { twistedFate } from "./twisted-fate";
import { kindred } from "./kindred";
import { vayne } from "./vayne";
import { viego } from "./viego";
import { renataGlasc } from "./renata-glasc";
import { tristana } from "./tristana";
import { elise } from "./elise";
import { zed } from "./zed";
import { garen } from "./garen";
import { missFortune } from "./miss-fortune";
import { hwei } from "./hwei";
import { volibear } from "./volibear";
import { yuumi } from "./yuumi";
import { graves } from "./graves";
import { zeri } from "./zeri";
import { milio } from "./milio";
import { gragas } from "./gragas";
import { reksai } from "./reksai";
import { draven } from "./draven";
import { smolder } from "./smolder";
import { kalista } from "./kalista";
import { blitzcrank } from "./blitzcrank";
import { diana } from "./diana";
import { veigar } from "./veigar";
import { kled } from "./kled";
import { sett } from "./sett";
import { vex } from "./vex";
import { shen } from "./shen";
import { darius } from "./darius";
import { kayle } from "./kayle";
import { khazix } from "./khazix";
import { mordekaiser } from "./mordekaiser";
import { zilean } from "./zilean";
import { morgana } from "./morgana";
import { fiora } from "./fiora";
import { kassadin } from "./kassadin";
import { riven } from "./riven";
import { singed } from "./singed";
import { soraka } from "./soraka";
import { swain } from "./swain";
import { warwick } from "./warwick";
import { zyra } from "./zyra";
import { senna } from "./senna";
import { lillia } from "./lillia";
import { skarner } from "./skarner";
import { ziggs } from "./ziggs";
import { illaoi } from "./illaoi";
import { lissandra } from "./lissandra";
import { tryndamere } from "./tryndamere";
import { xerath } from "./xerath";
import { samira } from "./samira";
import { gangplank } from "./gangplank";
import { vladimir } from "./vladimir";
import { fiddlesticks } from "./fiddlesticks";
import { amumu } from "./amumu";
import { brand } from "./brand";
import { chogath } from "./chogath";
import { evelynn } from "./evelynn";
import { fizz } from "./fizz";
import { hecarim } from "./hecarim";
import { heimerdinger } from "./heimerdinger";
import { janna } from "./janna";
import { karthus } from "./karthus";
import { katarina } from "./katarina";
import { malzahar } from "./malzahar";
import { masterYi } from "./master-yi";
import { nasus } from "./nasus";
import { quinn } from "./quinn";
import { rammus } from "./rammus";
import { shaco } from "./shaco";
import { shyvana } from "./shyvana";
import { sona } from "./sona";
import { talon } from "./talon";
import { taric } from "./taric";
import { teemo } from "./teemo";
import { twitch } from "./twitch";
import { udyr } from "./udyr";
import { urgot } from "./urgot";
import { zac } from "./zac";
import { velkoz } from "./velkoz";
import { ekko } from "./ekko";
import { tahmKench } from "./tahm-kench";
import { ivern } from "./ivern";
import { kayn } from "./kayn";
import { akshan } from "./akshan";
import { belveth } from "./belveth";
import { nilah } from "./nilah";
import { briar } from "./briar";
import { locke } from "./locke";

const baseChampions: Champion[] = [
  orianna,
  ambessa,
  jarvanIv,
  rumble,
  vi,
  neeko,
  nautilus,
  varus,
  ryze,
  yunara,
  azir,
  xinZhao,
  karma,
  ezreal,
  pantheon,
  caitlyn,
  ahri,
  bard,
  taliyah,
  sion,
  ksante,
  drMundo,
  zaahen,
  ashe,
  corki,
  aurora,
  gwen,
  renekton,
  lulu,
  wukong,
  gnar,
  aatrox,
  akali,
  nocturne,
  nami,
  alistar,
  kaisa,
  galio,
  sivir,
  seraphine,
  anivia,
  rakan,
  syndra,
  leona,
  mel,
  ornn,
  braum,
  jhin,
  aphelios,
  xayah,
  jax,
  jayce,
  rell,
  poppy,
  viktor,
  malphite,
  annie,
  naafiri,
  leblanc,
  qiyana,
  sylas,
  cassiopeia,
  trundle,
  leeSin,
  kennen,
  yone,
  zoe,
  lux,
  yasuo,
  rengar,
  aurelionSol,
  olaf,
  maokai,
  nidalee,
  lucian,
  irelia,
  jinx,
  sejuani,
  pyke,
  kogmaw,
  yorick,
  thresh,
  nunu,
  camille,
  twistedFate,
  kindred,
  vayne,
  viego,
  renataGlasc,
  tristana,
  elise,
  zed,
  garen,
  missFortune,
  hwei,
  volibear,
  yuumi,
  graves,
  zeri,
  milio,
  gragas,
  reksai,
  draven,
  smolder,
  kalista,
  blitzcrank,
  diana,
  veigar,
  kled,
  sett,
  vex,
  shen,
  darius,
  kayle,
  khazix,
  mordekaiser,
  zilean,
  morgana,
  fiora,
  kassadin,
  riven,
  singed,
  soraka,
  swain,
  warwick,
  zyra,
  senna,
  lillia,
  skarner,
  ziggs,
  illaoi,
  lissandra,
  tryndamere,
  xerath,
  samira,
  gangplank,
  vladimir,
  fiddlesticks,
  amumu,
  brand,
  chogath,
  evelynn,
  fizz,
  hecarim,
  heimerdinger,
  janna,
  karthus,
  katarina,
  malzahar,
  masterYi,
  nasus,
  quinn,
  rammus,
  shaco,
  shyvana,
  sona,
  talon,
  taric,
  teemo,
  twitch,
  udyr,
  urgot,
  zac,
  velkoz,
  ekko,
  tahmKench,
  ivern,
  kayn,
  akshan,
  belveth,
  nilah,
  briar,
  locke,
];

const mergeRelations = (relations: Champion["synergyWith"]): Champion["synergyWith"] => {
  const byId = new Map<string, Champion["synergyWith"][number]>();

  for (const relation of relations) {
    const existing = byId.get(relation.championId);

    if (!existing) {
      byId.set(relation.championId, relation);
      continue;
    }

    byId.set(relation.championId, {
      championId: relation.championId,
      score: Math.max(existing.score ?? 0, relation.score ?? 0) || undefined,
    });
  }

  return Array.from(byId.values());
};


const carryProfileOverrides: Partial<Record<string, ChampionCarryProfile>> = {
  aphelios: { selfPeel: 1, selfSave: 0, mobilitySafety: 0 },
  jinx: { selfPeel: 1, selfSave: 0, mobilitySafety: 0 },
  kogmaw: { selfPeel: 0, selfSave: 0, mobilitySafety: 0 },
  yunara: { selfPeel: 1, selfSave: 0, mobilitySafety: 1 },
  varus: { selfPeel: 1, selfSave: 0, mobilitySafety: 1 },
  caitlyn: { selfPeel: 1, selfSave: 0, mobilitySafety: 1 },
  ashe: { selfPeel: 1, selfSave: 0, mobilitySafety: 1 },
  jhin: { selfPeel: 1, selfSave: 0, mobilitySafety: 1 },
  sivir: { selfPeel: 4, selfSave: 3, mobilitySafety: 2 },
  xayah: { selfPeel: 3, selfSave: 5, mobilitySafety: 2 },
  ezreal: { selfPeel: 1, selfSave: 3, mobilitySafety: 5 },
  zeri: { selfPeel: 2, selfSave: 2, mobilitySafety: 4 },
  kaisa: { selfPeel: 1, selfSave: 2, mobilitySafety: 3 },
  lucian: { selfPeel: 1, selfSave: 1, mobilitySafety: 3 },
  corki: { selfPeel: 1, selfSave: 2, mobilitySafety: 4 },
  tristana: { selfPeel: 2, selfSave: 2, mobilitySafety: 4 },
  samira: { selfPeel: 3, selfSave: 2, mobilitySafety: 2 },
  kalista: { selfPeel: 2, selfSave: 1, mobilitySafety: 3 },
  draven: { selfPeel: 0, selfSave: 0, mobilitySafety: 1 },
  "miss-fortune": { selfPeel: 0, selfSave: 0, mobilitySafety: 1 },
  smolder: { selfPeel: 1, selfSave: 1, mobilitySafety: 2 },
  ziggs: { selfPeel: 1, selfSave: 1, mobilitySafety: 1 },
  mel: { selfPeel: 1, selfSave: 1, mobilitySafety: 1 },
  vayne: { selfPeel: 2, selfSave: 1, mobilitySafety: 3 },
};

export const champions: Champion[] = baseChampions.map((champion) => ({
  ...champion,
  carryProfile: carryProfileOverrides[champion.id] ?? champion.carryProfile,
  synergyWith: mergeRelations(champion.synergyWith),
}));

export const championsById = Object.fromEntries(champions.map((champion) => [champion.id, champion]));

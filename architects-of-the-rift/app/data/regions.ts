import { Region } from "../types/region"

export const regions: Region[] = [
  {
    id: "lck",
    name: "League of Legends Champions Korea",
    server: "Korean Server",
    teams: 10,
    logo: "/region-logos/League_of_Legends_Champions_Korea_logo.svg"
  },

  {
    id: "lec",
    name: "League of Legends EMEA Championship",
    server: "EU Server",
    teams: 10,
    logo: "/region-logos/lec.png"
  },

  {
    id: "lpl",
    name: "League of Legends Pro League",
    server: "China Server",
    teams: 14,
    logo: "/region-logos/League_of_legends_pro_league_logo.svg"
  },

  {
    id: "lcs",
    name: "League Championship Series",
    server: "NA Server",
    teams: 8,
    logo: "/region-logos/League_championship_series_logo.svg"
  },
]
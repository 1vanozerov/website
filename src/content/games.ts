// Personal games are kept entirely separate from freelance work.
export type GameProject = {
  slug: string;
  title: string;
  genre: string;
  status: "In development" | "Released";
  description: string;
  url?: string;
};

export const games: GameProject[] = [
  {
    slug: "last-shift-mars",
    title: "LAST SHIFT: MARS",
    genre: "Atmospheric psychological horror",
    status: "In development",
    description:
      "An atmospheric psychological horror game, currently in development.",
  },
];

// All public portfolio content in one place. Keep only verified details.
export type Service = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
};

export type ClientProject = {
  id: string;
  title: string;
  category: string;
  image?: string;
  url?: string;
};

export const portfolio = {
  name: "Ivan Ozerov",
  location: "Germany",
  locationNote: "Working on Earth",
  title: "Independent developer",
  headline: "I build things\nfor the digital world.",
  intro:
    "I'm Ivan, an independent developer based in Germany. I build MVPs, mobile apps and websites - from an idea to something people can use.",
  about:
    "I work across mobile and web platforms. I like taking an idea, finding the simplest way to make it work, and building from there.",
  email: "ozerovtech@gmail.com",
  services: [
    {
      id: "01",
      name: "Mobile MVPs",
      subtitle: "Flutter / Swift",
      description:
        "Mobile apps and MVPs for iOS and cross-platform products.",
    },
    {
      id: "02",
      name: "Websites",
      subtitle: "Web development",
      description:
        "Websites and web experiences that stay clear, fast, and useful.",
    },
  ] satisfies Service[],
  projects: [
    { id: "website", title: "Websites", category: "Web development", image: "/images/web_prev.png" },
    { id: "mobile", title: "Mobile Apps", category: "Flutter / Swift", image: "/images/mobile_prev.png" },
  ] as ClientProject[],
};

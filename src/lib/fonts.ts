import { Hanken_Grotesk, Newsreader } from "next/font/google";

/** Display and body. Variable, so weights 300/400/500 share one file. */
export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

/** Prices, statistics and pull quotes only. Variable with the optical-size axis. */
export const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

export const fontVariables = `${hankenGrotesk.variable} ${newsreader.variable}`;

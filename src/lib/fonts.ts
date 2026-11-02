import { Instrument_Serif, Manrope } from "next/font/google";

/** Body and UI. Variable, so every weight shares one file. */
export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/** Display only: headlines, prices and numerals. The italic carries the accent words. */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const fontVariables = `${manrope.variable} ${instrumentSerif.variable}`;

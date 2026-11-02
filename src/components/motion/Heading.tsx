"use client";

import { Fragment, type ElementType } from "react";
import { useInView } from "./Reveal";

interface HeadingProps {
  as?: ElementType;
  className?: string;
  id?: string;
  /** Plain text. Wrap words in *asterisks* to set them in the serif italic. */
  text: string;
  /** Seconds before the first word moves. */
  delay?: number;
}

/** Splits `text` into words, keeping the `*italic*` markers. Words keep a real space between them. */
function words(text: string) {
  const out: { word: string; italic: boolean; tail: string }[] = [];
  text.split(/(\*[^*]+\*)/).forEach((part) => {
    const italic = part.startsWith("*") && part.endsWith("*");
    if (italic) {
      out.push({ word: part.slice(1, -1), italic, tail: "" });
      return;
    }
    // Punctuation glued to the previous italic word stays attached to it ("alugar,").
    const glued = out.length && !/^\s/.test(part) ? part.match(/^\S+/)?.[0] : undefined;
    if (glued) out[out.length - 1].tail = glued;
    part
      .slice(glued?.length ?? 0)
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word) => out.push({ word, italic, tail: "" }));
  });
  return out;
}

/**
 * Headline whose words rise out of a mask when it enters the viewport (CSS transition, see base.css).
 * Screen readers get the whole sentence from aria-label; the split words are hidden from them.
 */
export function Heading({ as: Tag = "h2", className = "", id, text, delay = 0 }: HeadingProps) {
  const ref = useInView<HTMLElement>("0px 0px -6% 0px");
  const label = text.replace(/\*/g, "");

  return (
    <Tag
      ref={ref}
      id={id}
      aria-label={label}
      className={`wr ${className}`}
      style={delay ? { ["--d" as string]: delay } : undefined}
    >
      {words(text).map(({ word, italic, tail }, index, all) => (
        <Fragment key={`${word}-${index}`}>
          <span className="wr-w" aria-hidden="true">
            <span style={{ ["--i" as string]: index }}>
              {italic ? <em>{word}</em> : word}
              {tail}
            </span>
          </span>
          {index < all.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type AdminProductStoryFields = {
  features: { title: string; description: string }[];
  ritualSteps: { step: string; title: string; description: string }[];
  ratingAverage: string;
  ratingCount: string;
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialTitle: string;
  seoTitle: string;
  seoDescription: string;
};

export function emptyStoryFields(): AdminProductStoryFields {
  return {
    features: [],
    ritualSteps: [],
    ratingAverage: "",
    ratingCount: "",
    testimonialQuote: "",
    testimonialAuthor: "",
    testimonialTitle: "",
    seoTitle: "",
    seoDescription: "",
  };
}

/** Maps form state → Convex payloads. `update` clears ratings/testimonial/SEO when fields are empty. */
export function storyFieldsToConvexExtras(
  f: AdminProductStoryFields,
  mode: "create" | "update",
) {
  const features = f.features
    .map((x) => ({
      title: x.title.trim(),
      description: x.description.trim(),
    }))
    .filter((x) => x.title.length > 0 && x.description.length > 0);

  const ritualSteps = f.ritualSteps
    .map((x) => ({
      step: x.step.trim(),
      title: x.title.trim(),
      description: x.description.trim(),
    }))
    .filter((x) => x.step.length > 0 && x.title.length > 0);

  const ra = parseFloat(f.ratingAverage);
  const rc = Number.parseInt(f.ratingCount, 10);
  const hasRating =
    Number.isFinite(ra) &&
    ra >= 0 &&
    ra <= 5 &&
    Number.isFinite(rc) &&
    rc > 0;

  const quote = f.testimonialQuote.trim();
  const author = f.testimonialAuthor.trim();
  const title = f.testimonialTitle.trim();
  const seoT = f.seoTitle.trim();
  const seoD = f.seoDescription.trim();

  const ratings =
    mode === "update" ?
      { ratingAverage: hasRating ? ra : 0, ratingCount: hasRating ? rc : 0 }
    : hasRating ?
      { ratingAverage: ra, ratingCount: rc }
    : {};

  const testimonial =
    mode === "update" ?
      {
        testimonialQuote: quote,
        testimonialAuthor: author,
        testimonialTitle: title,
      }
    : quote || author || title ?
      {
        ...(quote ? { testimonialQuote: quote } : {}),
        ...(author ? { testimonialAuthor: author } : {}),
        ...(title ? { testimonialTitle: title } : {}),
      }
    : {};

  const seo =
    mode === "update" ?
      { seoTitle: seoT, seoDescription: seoD }
    : seoT || seoD ?
      {
        ...(seoT ? { seoTitle: seoT } : {}),
        ...(seoD ? { seoDescription: seoD } : {}),
      }
    : {};

  return { features, ritualSteps, ...ratings, ...testimonial, ...seo };
}

export function ProductStorySections({
  value,
  onChange,
}: {
  value: AdminProductStoryFields;
  onChange: (next: AdminProductStoryFields) => void;
}) {
  return (
    <div className="space-y-8 border-t border-border/60 pt-8">
      <div className="space-y-3">
        <div>
          <h2 className="font-heading text-lg text-foreground">
            Formula highlights (PDP grid)
          </h2>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Example tiles: title{" "}
            <span className="text-gold/90">
              Multi-weight hyaluronic acid
            </span>
            , description{" "}
            <span className="text-gold/90">
              Draws moisture into the upper layers for lasting comfort without
              a tacky feel.
            </span>
          </p>
        </div>
        <div className="space-y-3">
          {value.features.map((row, i) => (
            <div
              key={i}
              className="space-y-2 rounded-md border border-border/80 bg-muted/20 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Highlight {i + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-destructive hover:text-destructive"
                  onClick={() =>
                    onChange({
                      ...value,
                      features: value.features.filter((_, j) => j !== i),
                    })
                  }
                >
                  Remove
                </Button>
              </div>
              <Input
                placeholder="e.g. Barrier-support ceramides"
                value={row.title}
                onChange={(e) => {
                  const title = e.target.value;
                  onChange({
                    ...value,
                    features: value.features.map((r, j) =>
                      j === i ? { ...r, title } : r,
                    ),
                  });
                }}
              />
              <Textarea
                rows={2}
                placeholder="Short benefit line for the product detail page."
                value={row.description}
                onChange={(e) => {
                  const description = e.target.value;
                  onChange({
                    ...value,
                    features: value.features.map((r, j) =>
                      j === i ? { ...r, description } : r,
                    ),
                  });
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full border-dashed"
            onClick={() =>
              onChange({
                ...value,
                features: [...value.features, { title: "", description: "" }],
              })
            }
          >
            Add formula highlight
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="font-heading text-lg text-foreground">
            Regimen · Step by step
          </h2>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Example: step{" "}
            <span className="text-gold/90">1</span>, title{" "}
            <span className="text-gold/90">Dispense</span>, description{" "}
            <span className="text-gold/90">
              Smooth 1–2 pumps over face and neck after cleansing, AM or PM.
            </span>
          </p>
        </div>
        <div className="space-y-3">
          {value.ritualSteps.map((row, i) => (
            <div
              key={i}
              className="space-y-2 rounded-md border border-border/80 bg-muted/20 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Step {i + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-destructive hover:text-destructive"
                  onClick={() =>
                    onChange({
                      ...value,
                      ritualSteps: value.ritualSteps.filter((_, j) => j !== i),
                    })
                  }
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-[4rem_1fr] gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">#</Label>
                  <Input
                    placeholder="1"
                    value={row.step}
                    onChange={(e) => {
                      const step = e.target.value;
                      onChange({
                        ...value,
                        ritualSteps: value.ritualSteps.map((r, j) =>
                          j === i ? { ...r, step } : r,
                        ),
                      });
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">
                    Title
                  </Label>
                  <Input
                    placeholder="e.g. Layer under moisturizer"
                    value={row.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      onChange({
                        ...value,
                        ritualSteps: value.ritualSteps.map((r, j) =>
                          j === i ? { ...r, title } : r,
                        ),
                      });
                    }}
                  />
                </div>
              </div>
              <Textarea
                rows={2}
                placeholder="Instruction text shown under the step title."
                value={row.description}
                onChange={(e) => {
                  const description = e.target.value;
                  onChange({
                    ...value,
                    ritualSteps: value.ritualSteps.map((r, j) =>
                      j === i ? { ...r, description } : r,
                    ),
                  });
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full border-dashed"
            onClick={() =>
              onChange({
                ...value,
                ritualSteps: [
                  ...value.ritualSteps,
                  { step: "", title: "", description: "" },
                ],
              })
            }
          >
            Add ritual step
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="font-heading text-lg text-foreground">
            Star rating (shop display)
          </h2>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Example: average <span className="text-gold/90">4.8</span> (0–5),
            count <span className="text-gold/90">127</span>. Leave blank to use
            the default stars + &ldquo;Highly rated&rdquo; copy.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ratingAvg">Average</Label>
            <Input
              id="ratingAvg"
              inputMode="decimal"
              placeholder="4.8"
              value={value.ratingAverage}
              onChange={(e) =>
                onChange({ ...value, ratingAverage: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ratingCnt">Review count</Label>
            <Input
              id="ratingCnt"
              inputMode="numeric"
              placeholder="127"
              value={value.ratingCount}
              onChange={(e) =>
                onChange({ ...value, ratingCount: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="font-heading text-lg text-foreground">Testimonial</h2>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Example quote:{" "}
            <span className="text-gold/90">
              My skin looks calmer in two weeks—texture and glow without
              irritation.
            </span>{" "}
            Author: <span className="text-gold/90">Jordan K.</span> Descriptor:{" "}
            <span className="text-gold/90">Verified buyer · sensitive skin</span>
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tq">Quote</Label>
          <Textarea
            id="tq"
            rows={3}
            value={value.testimonialQuote}
            onChange={(e) =>
              onChange({ ...value, testimonialQuote: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ta">Attribution (name)</Label>
            <Input
              id="ta"
              placeholder="Jordan K."
              value={value.testimonialAuthor}
              onChange={(e) =>
                onChange({ ...value, testimonialAuthor: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tt">Line under name (optional)</Label>
            <Input
              id="tt"
              placeholder="Verified buyer · sensitive skin"
              value={value.testimonialTitle}
              onChange={(e) =>
                onChange({ ...value, testimonialTitle: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="font-heading text-lg text-foreground">SEO (optional)</h2>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Example title:{" "}
            <span className="text-gold/90">
              Overnight barrier cream · Helen&apos;s
            </span>
            . Meta description:{" "}
            <span className="text-gold/90">
              Rich barrier cream with ceramides and squalane for overnight
              recovery—fragrance-conscious, refillable jar.
            </span>
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="seoT">Meta title</Label>
          <Input
            id="seoT"
            value={value.seoTitle}
            onChange={(e) =>
              onChange({ ...value, seoTitle: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seoD">Meta description</Label>
          <Textarea
            id="seoD"
            rows={2}
            value={value.seoDescription}
            onChange={(e) =>
              onChange({ ...value, seoDescription: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}

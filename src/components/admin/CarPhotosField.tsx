"use client";
import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { AdminImage } from "@/components/admin/AdminImage";

type Existing = { src: string; alt: string };
type Pending = { key: string; file: File; url: string };

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
const MAX = 8;

export function CarPhotosField({
  images = [],
  error,
}: {
  images?: Existing[];
  error?: string;
}) {
  const coverPickId = useId();
  const galleryPickId = useId();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [kept, setKept] = useState<Existing[]>(images);
  const [cover, setCover] = useState<Pending | null>(null);
  const [gallery, setGallery] = useState<Pending[]>([]);

  const total = kept.length + (cover ? 1 : 0) + gallery.length;
  const coverExisting = !cover ? kept[0] ?? null : null;
  const galleryExisting = cover ? kept : kept.slice(1);

  useEffect(() => {
    const input = galleryInputRef.current;
    if (!input) return;
    const dt = new DataTransfer();
    for (const p of gallery) dt.items.add(p.file);
    input.files = dt.files;
  }, [gallery]);

  useEffect(() => {
    const input = coverInputRef.current;
    if (!input) return;
    const dt = new DataTransfer();
    if (cover) dt.items.add(cover.file);
    input.files = dt.files;
  }, [cover]);

  useEffect(() => {
    return () => {
      if (cover) URL.revokeObjectURL(cover.url);
      for (const p of gallery) URL.revokeObjectURL(p.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- revoke on unmount only
  }, []);

  function makePending(file: File): Pending {
    return { key: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`, file, url: URL.createObjectURL(file) };
  }

  function setCoverFile(file: File | null) {
    setCover((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return file ? makePending(file) : null;
    });
  }

  function addGallery(list: FileList | null) {
    if (!list?.length) return;
    const room = MAX - kept.length - (cover ? 1 : 0) - gallery.length;
    if (room <= 0) return;
    const next: Pending[] = [];
    for (const file of Array.from(list).slice(0, room)) {
      if (!ACCEPT.split(",").includes(file.type)) continue;
      next.push(makePending(file));
    }
    if (next.length) setGallery((g) => [...g, ...next]);
  }

  function removeKept(src: string) {
    setKept((list) => list.filter((i) => i.src !== src));
  }

  function removeGallery(key: string) {
    setGallery((list) => {
      const hit = list.find((p) => p.key === key);
      if (hit) URL.revokeObjectURL(hit.url);
      return list.filter((p) => p.key !== key);
    });
  }

  function clearCover() {
    if (cover) setCoverFile(null);
    else if (coverExisting) removeKept(coverExisting.src);
  }

  const showCover = coverExisting || cover;

  return (
    <div className="grid gap-5">
      {kept.map((img) => (
        <input key={img.src} type="hidden" name="keep" value={img.src} />
      ))}
      <input ref={coverInputRef} type="file" name="coverImage" accept={ACCEPT} className="sr-only" tabIndex={-1} aria-hidden />
      <input ref={galleryInputRef} type="file" name="newImages" accept={ACCEPT} multiple className="sr-only" tabIndex={-1} aria-hidden />

      <div>
        <h3 className="text-sm font-semibold text-ink">Cover photo</h3>
        <p className="mt-0.5 text-xs text-mute">Card image on the cars listing.</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="relative h-24 w-32 shrink-0 overflow-hidden border border-line bg-ink-2">
            {coverExisting ? (
              <AdminImage src={coverExisting.src} alt={coverExisting.alt} />
            ) : cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-mute">
                <ImagePlus size={22} aria-hidden />
              </div>
            )}
          </div>
          <div className="grid min-w-0 flex-1 gap-2">
            <input
              readOnly
              value={coverExisting?.src ?? (cover ? cover.file.name : "")}
              placeholder="No cover selected yet"
              className="field !min-h-9 text-sm text-mute"
              aria-label="Cover photo path"
            />
            <div className="flex flex-wrap gap-2">
              <label
                htmlFor={coverPickId}
                className="btn btn-ghost !min-h-9 inline-flex cursor-pointer items-center gap-2 px-3 text-sm"
              >
                <Upload size={15} aria-hidden />
                {showCover ? "Replace cover" : "Upload cover"}
              </label>
              <input
                id={coverPickId}
                type="file"
                accept={ACCEPT}
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (!f || !ACCEPT.split(",").includes(f.type)) return;
                  if (coverExisting) removeKept(coverExisting.src);
                  setCoverFile(f);
                }}
              />
              {showCover && (
                <button type="button" onClick={clearCover} className="btn btn-ghost !min-h-9 inline-flex items-center gap-2 px-3 text-sm text-red-800">
                  <Trash2 size={15} aria-hidden /> Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink">Gallery photos</h3>
        <p className="mt-0.5 text-xs text-mute">Extra photos on the car detail page (max {MAX} total).</p>

        {(galleryExisting.length > 0 || gallery.length > 0) && (
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {galleryExisting.map((img) => (
              <li key={img.src} className="grid gap-1.5">
                <div className="relative aspect-[4/3] overflow-hidden border border-line bg-ink-2">
                  <AdminImage src={img.src} alt={img.alt} />
                </div>
                <button type="button" onClick={() => removeKept(img.src)} className="btn btn-ghost !min-h-8 w-full text-xs text-red-800">
                  Remove
                </button>
              </li>
            ))}
            {gallery.map((p) => (
              <li key={p.key} className="grid gap-1.5">
                <div className="relative aspect-[4/3] overflow-hidden border border-line bg-ink-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <button type="button" onClick={() => removeGallery(p.key)} className="btn btn-ghost !min-h-8 w-full text-xs text-red-800">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3">
          <label
            htmlFor={galleryPickId}
            className={`btn btn-ghost !min-h-10 inline-flex w-full cursor-pointer items-center justify-center gap-2 text-sm sm:w-auto sm:min-w-[12rem] sm:px-5 ${total >= MAX ? "pointer-events-none opacity-50" : ""}`}
          >
            <Upload size={15} aria-hidden /> Upload photos
          </label>
          <input
            id={galleryPickId}
            type="file"
            accept={ACCEPT}
            multiple
            className="sr-only"
            disabled={total >= MAX}
            onChange={(e) => {
              addGallery(e.target.files);
              e.target.value = "";
            }}
          />
          <p className="mt-1.5 text-[11px] text-mute">
            JPG, PNG, WebP or AVIF · under 5 MB each · {total}/{MAX} photos
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="err">
          {error}
        </p>
      )}
    </div>
  );
}

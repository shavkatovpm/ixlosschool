import Link from "next/link";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { ConfirmButton } from "./confirm-button";

const iconButton =
  "flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:bg-tint-a disabled:opacity-35 disabled:hover:bg-transparent";

type ServerAction = (formData: FormData) => void | Promise<void>;

/** Edit / move / show-hide / delete controls for one row of an ordered list. Every button is a plain form post to a server action. */
export function ListControls({
  id,
  editHref,
  published,
  first,
  last,
  moveAction,
  toggleAction,
  deleteAction,
  confirmText,
}: {
  id: number;
  editHref: string;
  published: boolean;
  first?: boolean;
  last?: boolean;
  moveAction?: ServerAction;
  toggleAction: ServerAction;
  deleteAction: ServerAction;
  confirmText: string;
}) {
  const hidden = <input type="hidden" name="id" value={id} />;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {moveAction ? (
        <>
          <form action={moveAction}>
            {hidden}
            <input type="hidden" name="dir" value="up" />
            <button type="submit" disabled={first} aria-label="Yuqoriga ko'chirish" className={iconButton}>
              <ArrowUp size={16} aria-hidden />
            </button>
          </form>
          <form action={moveAction}>
            {hidden}
            <input type="hidden" name="dir" value="down" />
            <button type="submit" disabled={last} aria-label="Pastga ko'chirish" className={iconButton}>
              <ArrowDown size={16} aria-hidden />
            </button>
          </form>
        </>
      ) : null}
      <form action={toggleAction}>
        {hidden}
        <input type="hidden" name="published" value={published ? "0" : "1"} />
        <button type="submit" aria-label={published ? "Saytdan yashirish" : "Saytda ko'rsatish"} title={published ? "Saytdan yashirish" : "Saytda ko'rsatish"} className={iconButton}>
          {published ? <Eye size={16} aria-hidden /> : <EyeOff size={16} aria-hidden />}
        </button>
      </form>
      <Link href={editHref} aria-label="Tahrirlash" className={iconButton}>
        <Pencil size={16} aria-hidden />
      </Link>
      <form action={deleteAction}>
        {hidden}
        <ConfirmButton message={confirmText} label="O'chirish" className={`${iconButton} text-danger`}>
          <Trash2 size={16} aria-hidden />
        </ConfirmButton>
      </form>
    </div>
  );
}

export function StatusChip({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${published ? "bg-brand text-on-brand" : "bg-tint-b text-ink/70"}`}>
      {published ? "Saytda" : "Yashirin"}
    </span>
  );
}

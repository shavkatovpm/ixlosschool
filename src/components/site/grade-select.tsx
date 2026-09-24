"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, ChevronDown, GraduationCap } from "lucide-react";
import styles from "./admissions.module.css";

type Option = { value: string; label: string };

type Props = {
  id: string;
  label: string;
  placeholder: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  describedBy?: string;
};

const supportsPopover = () => typeof HTMLElement !== "undefined" && "popover" in HTMLElement.prototype;
const noSubscribe = () => () => {};

/**
 * Grade picker for the application form: a styled listbox (grid of grades) instead of the browser's default menu.
 * The list is a top-layer popover, so it is never clipped by the modal's scroll area. Browsers without the popover
 * API get the native <select> instead. Keyboard: arrows, Home/End, Enter/Space, Escape, type a number to jump.
 */
export function GradeSelect(props: Props) {
  const popover = useSyncExternalStore(noSubscribe, supportsPopover, () => true);
  return popover ? <GradeListbox {...props} /> : <NativeGradeSelect {...props} />;
}

function NativeGradeSelect({ id, options, placeholder, value, onChange, onBlur, invalid, describedBy }: Props) {
  return (
    <div className={`${styles.inputWrap} ${styles.selectWrap}`}>
      <span className={styles.inputIcon}><GraduationCap size={20} strokeWidth={1.7} aria-hidden /></span>
      <select id={id} value={value} required aria-invalid={invalid} aria-describedby={describedBy} onChange={(e) => onChange(e.target.value)} onBlur={onBlur}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className={styles.selectChevron} size={18} aria-hidden />
    </div>
  );
}

function GradeListbox({ id, label, placeholder, options, value, onChange, onBlur, invalid, describedBy }: Props) {
  const listId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState<React.CSSProperties>({});

  const selectedIndex = options.findIndex((o) => o.value === value);
  const optionId = (index: number) => `${listId}-${index}`;

  const place = useCallback(() => {
    const button = trigger.current;
    const list = panel.current;
    if (!button || !list) return;
    const rect = button.getBoundingClientRect();
    const height = list.offsetHeight;
    const below = window.innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const flip = below < Math.min(height, 240) && above > below;
    setPosition(
      flip
        ? { left: rect.left, width: rect.width, bottom: window.innerHeight - rect.top + 8, maxHeight: Math.min(above, 360) }
        : { left: rect.left, width: rect.width, top: rect.bottom + 8, maxHeight: Math.min(Math.max(below, 160), 360) },
    );
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const choose = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  };

  // Show / hide the popover, and keep it under the field while the page or modal scrolls or resizes.
  useLayoutEffect(() => {
    const list = panel.current;
    if (!list) return;
    if (open && !list.matches(":popover-open")) list.showPopover();
    if (!open && list.matches(":popover-open")) list.hidePopover();
    if (!open) return;
    place();
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
    };
  }, [open, place]);

  // Outside taps close the list; the selected option scrolls into view when it opens.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!trigger.current?.contains(target) && !panel.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  const openList = () => {
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        setActive((i) => Math.min(last, i + 1));
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        close();
        break;
      case "Tab":
        close();
        break;
      default:
        if (/^\d$/.test(event.key)) {
          const now = Date.now();
          const text = now - typed.current.at < 700 ? typed.current.text + event.key : event.key;
          typed.current = { text, at: now };
          const match = options.findIndex((o) => o.value.startsWith(text));
          if (match >= 0) setActive(match);
        }
    }
  };

  return (
    <div className={`${styles.inputWrap} ${styles.selectWrap}`}>
      <span className={styles.inputIcon}><GraduationCap size={20} strokeWidth={1.7} aria-hidden /></span>
      <button
        ref={trigger}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        data-placeholder={selectedIndex < 0}
        className={styles.selectTrigger}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        onBlur={() => {
          // The list is a popover: focus stays on this button while it is open, so a blur means the user moved on.
          setOpen(false);
          onBlur?.();
        }}
      >
        {selectedIndex >= 0 ? options[selectedIndex].label : placeholder}
      </button>
      <ChevronDown className={styles.selectChevron} size={18} aria-hidden />
      <div ref={panel} id={listId} role="listbox" aria-label={label} popover="manual" className={styles.selectPanel} style={position}>
        {options.map((option, index) => (
          <div
            key={option.value}
            id={optionId(index)}
            role="option"
            aria-selected={option.value === value}
            data-active={open && index === active}
            className={styles.selectOption}
            // Keep focus on the button (pointerdown would blur it and close the list before the click lands).
            onPointerDown={(event) => event.preventDefault()}
            onPointerMove={() => setActive(index)}
            onClick={() => choose(index)}
          >
            {option.value === value ? <Check size={15} strokeWidth={2.4} aria-hidden /> : null}
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}

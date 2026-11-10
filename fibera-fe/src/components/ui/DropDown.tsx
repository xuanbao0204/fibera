"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
    type ButtonHTMLAttributes,
} from "react";

import { Check, ChevronDown } from "lucide-react";

import "./dropdown.css";
import Link, { LinkProps } from "next/link";
import { cn } from "@/libs/utils";

interface DropdownContextType {
    open: boolean;
    setOpen: (value: boolean) => void;
    selectedValue?: string;
    onSelect?: (value: string) => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

function useDropdown() {
    const context = useContext(DropdownContext);

    if (!context) {
        throw new Error("Dropdown components must be used inside Dropdown");
    }

    return context;
}

/* Root */
interface DropdownProps {
    children: ReactNode;
    value?: string;
    fullWidth?: boolean;
    defaultValue?: string;
    onChange?: (value: string) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function Root({
    children,
    value,
    fullWidth = false,
    defaultValue,
    onChange,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
}: DropdownProps) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [internalValue, setInternalValue] = useState(defaultValue);

    const isOpenControlled = controlledOpen !== undefined;
    const isValueControlled = value !== undefined;

    const open = isOpenControlled ? controlledOpen : internalOpen;
    const selectedValue = isValueControlled ? value : internalValue;

    const setOpen = (next: boolean) => {
        if (!isOpenControlled) {
            setInternalOpen(next);
        }

        onOpenChange?.(next);
    };

    const handleSelect = (nextValue: string) => {
        if (!isValueControlled) {
            setInternalValue(nextValue);
        }

        onChange?.(nextValue);
        setOpen(false);
    };

    const context: DropdownContextType = {
        open,
        setOpen,
        selectedValue,
        onSelect: handleSelect,
    };

    return (
        <DropdownContext.Provider value={context}>
            <div className={cn("dropdown", fullWidth && "dropdown-full", open ? "open" : "")}>
                {children}
            </div>
        </DropdownContext.Provider>
    );
}

/* Trigger */
interface TriggerProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

function Trigger({
    children,
    className = "",
    disabled,
    ...props
}: TriggerProps) {
    const { open, setOpen } = useDropdown();

    return (
        <button
            type="button"
            {...props}
            disabled={disabled}
            className={`dropdown-trigger ${className}`}
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
        >
            <span className="dropdown-trigger-content">
                {children}
            </span>

            <ChevronDown
                size={16}
                className="dropdown-chevron"
            />
        </button>
    );
}

/* Content */
interface ContentProps {
    children: ReactNode;
    className?: string;
}

function Content({ children, className = "" }: ContentProps) {
    const { open, setOpen } = useDropdown();
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (
                contentRef.current &&
                !contentRef.current.parentElement?.contains(
                    event.target as Node
                )
            ) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, setOpen]);

    if (!open) return null;

    return (
        <div
            ref={contentRef}
            className={`dropdown-content ${className}`}
            role="listbox"
        >
            {children}
        </div>
    );
}

/* Item */
interface ItemProps {
    value: string;
    children: ReactNode;
    description?: string;
    icon?: ReactNode;
    disabled?: boolean;
}

function Item({
    value,
    children,
    description,
    icon,
    disabled = false,
}: ItemProps) {
    const { selectedValue, onSelect } = useDropdown();

    const selected = selectedValue === value;

    return (
        <button
            type="button"
            role="option"
            aria-selected={selected}
            disabled={disabled}
            className={`dropdown-item ${selected ? "selected" : ""}`}
            onClick={() => onSelect?.(value)}
        >
            {icon && (
                <span className="dropdown-item-icon">
                    {icon}
                </span>
            )}

            <span className="dropdown-item-label">
                {children}

                {description && (
                    <span className="dropdown-item-description">
                        {description}
                    </span>
                )}
            </span>

            {selected && (
                <Check
                    size={16}
                    className="dropdown-item-check"
                />
            )}
        </button>
    );
}

/* Label */
function Label({ children }: { children: ReactNode }) {
    return (
        <div className="dropdown-label">
            {children}
        </div>
    );
}

/* Separator */
function Separator() {
    return <div className="dropdown-separator" role="separator" />;
}

interface MenuItemProps extends LinkProps {
    children: ReactNode;
    className?: string;
    active?: boolean;
    onClick?: () => void;
}

function MenuItem({
    children,
    className = "",
    active = false,
    ...props
}: MenuItemProps) {
    return (
        <Link
            {...props}
            className={`dropdown-item ${active ? "selected" : ""} ${className}`}
        >
            <span className="dropdown-item-label">
                {children}
            </span>

            {active && (
                <Check
                    size={16}
                    className="dropdown-item-check"
                />
            )}
        </Link>
    );
}

/* Compound component */
export const Dropdown = Object.assign(Root, {
    Trigger,
    Content,
    Item,
    MenuItem,
    Label,
    Separator,
});

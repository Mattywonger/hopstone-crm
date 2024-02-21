import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const enumKeys = (en: Object): Array<string> => (
    Object.keys(en).filter(el => isNaN(Number(el)))
)

export const enumNums = (en: Object): Array<number> => (
    Object.keys(en).map(Number).filter(n => !isNaN(n))
)
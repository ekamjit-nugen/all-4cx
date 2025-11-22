import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const uniqueId = () => {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 36);
  return nanoid();
};

export const sortByTimestamp = (a, b) => {
  const dateA = new Date(a.timeStamp);
  const dateB = new Date(b.timeStamp);
  return dateA - dateB; // ascending order (oldest first)
};

"use client";

import { donorsSeed } from "@/lib/donors";
import type { Donor, FollowUpStatus, PaymentStatus } from "@/types/donor";

export const DONORS_STORAGE_KEY = "pulso-donante:donors:v1";

const STORE_EVENT = "pulso-donante:donors-changed";
const paymentStatuses: PaymentStatus[] = ["paid", "failed", "pending", "unknown"];
const followUpStatuses: FollowUpStatus[] = [
  "pending",
  "contacted",
  "recovered",
  "wants_increase",
  "needs_follow_up",
  "cancelled",
];

let currentDonors: Donor[] | null = null;

function cloneSeed() {
  return donorsSeed.map((donor) => ({ ...donor }));
}

function isDonor(value: unknown): value is Donor {
  if (!value || typeof value !== "object") {
    return false;
  }

  const donor = value as Record<string, unknown>;

  return (
    typeof donor.id === "string" &&
    typeof donor.name === "string" &&
    typeof donor.phone === "string" &&
    typeof donor.monthlyAmount === "number" &&
    paymentStatuses.includes(donor.paymentStatus as PaymentStatus) &&
    typeof donor.lastPaymentDate === "string" &&
    typeof donor.lastAmountUpdateDate === "string" &&
    typeof donor.lastImpactContactDate === "string" &&
    typeof donor.cause === "string" &&
    typeof donor.impactText === "string" &&
    followUpStatuses.includes(donor.followUpStatus as FollowUpStatus)
  );
}

function parseDonors(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.length > 0 && parsed.every(isDonor) ? parsed : null;
  } catch {
    return null;
  }
}

function persist(donors: Donor[]) {
  window.localStorage.setItem(DONORS_STORAGE_KEY, JSON.stringify(donors));
}

function readDonors() {
  if (typeof window === "undefined") {
    return donorsSeed;
  }

  if (currentDonors) {
    return currentDonors;
  }

  currentDonors = parseDonors(window.localStorage.getItem(DONORS_STORAGE_KEY)) ?? cloneSeed();
  persist(currentDonors);
  return currentDonors;
}

function publish(donors: Donor[]) {
  currentDonors = donors;
  persist(donors);
  window.dispatchEvent(new Event(STORE_EVENT));
}

export function getDonorsSnapshot() {
  return readDonors();
}

export function getDonorsServerSnapshot() {
  return donorsSeed;
}

export function subscribeToDonors(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key !== DONORS_STORAGE_KEY) {
      return;
    }

    currentDonors = parseDonors(event.newValue) ?? cloneSeed();
    onStoreChange();
  }

  window.addEventListener(STORE_EVENT, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(STORE_EVENT, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function updateDonorStatus(id: string, status: FollowUpStatus) {
  const donors = readDonors();
  const donorExists = donors.some((donor) => donor.id === id);

  if (!donorExists) {
    return false;
  }

  publish(donors.map((donor) => (donor.id === id ? { ...donor, followUpStatus: status } : donor)));
  return true;
}

export function loadDonors(donors: Donor[]) {
  if (donors.length === 0) {
    return false;
  }

  publish(donors.map((donor) => ({ ...donor })));
  return true;
}

export function resetDonors() {
  publish(cloneSeed());
}

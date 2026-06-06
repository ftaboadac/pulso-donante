"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  getDonorsServerSnapshot,
  getDonorsSnapshot,
  loadDonors,
  resetDonors,
  subscribeToDonors,
  updateDonorStatus,
} from "@/lib/store";

const subscribeToHydration = () => () => undefined;

export function useDonors() {
  const donors = useSyncExternalStore(subscribeToDonors, getDonorsSnapshot, getDonorsServerSnapshot);
  const isHydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const getDonor = useCallback((id: string) => donors.find((donor) => donor.id === id), [donors]);

  return {
    donors,
    getDonor,
    updateDonorStatus,
    loadDonors,
    resetDonors,
    isHydrated,
  };
}

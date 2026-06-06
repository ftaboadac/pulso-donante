export type PaymentStatus = "paid" | "failed" | "pending" | "unknown";

export type FollowUpStatus =
  | "pending"
  | "contacted"
  | "recovered"
  | "wants_increase"
  | "needs_follow_up"
  | "cancelled";

export type Donor = {
  id: string;
  name: string;
  phone: string;
  monthlyAmount: number;
  paymentStatus: PaymentStatus;
  lastPaymentDate: string;
  lastAmountUpdateDate: string;
  lastImpactContactDate: string;
  cause: string;
  impactText: string;
  followUpStatus: FollowUpStatus;
};

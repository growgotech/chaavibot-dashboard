export interface UserRegistrationData {
  businessType: string;
  businessName: string;
  location: string;
  contact: string;
  services: string;
  logoChoice: string;
  selectedLogo: string;
  logoPath: string | null;
  logoUrl: string | null;
  postFrequency: string;
  posterS3Url?: string | null;  // S3 preview URL key inside registration data
}

export interface UserPayment {
  status: 'success' | 'pending' | 'failed' | string;
  orderId: string;
  paymentId: string;
  amount: number; // In minor units (divide by 100 for actual INR amount)
  currency: string;
  paymentLink: string;
  paidAt: string | null;
  failureReason: string | null;
}

export interface User {
  _id: string;
  phoneNumber: string;
  currentStep: string;
  previousStep: string | null;
  registrationData: UserRegistrationData;
  payment: UserPayment;
  isCompleted: boolean;
  lastInboundMessageAt: string;
  lastPromoTemplateSentAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UsersAPIResponse {
  success: boolean;
  count: number;
  users: User[];
}

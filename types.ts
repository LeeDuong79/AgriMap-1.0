
export enum UserRole {
  FARMER = 'FARMER',
  BUYER = 'BUYER',
  ADMIN = 'ADMIN'
}

export enum ProductStatus {
  PENDING = 'Chờ duyệt',
  APPROVED = 'Đã duyệt',
  REJECTED = 'Từ chối',
  RE_PENDING = 'Chờ duyệt lại',
  EXPIRED = 'Hết hạn'
}

export enum AdminLevel {
  COMMUNE = 'Cấp Xã/Phường',
  DISTRICT = 'Cấp Quận/Huyện',
  PROVINCE = 'Cấp Tỉnh/Thành phố',
  CENTRAL = 'Cấp Trung ương'
}

export interface FarmerUser {
  id: string;
  role: UserRole.FARMER;
  farmName: string;
  representative: string;
  cccd: string;
  phone: string;
  address: {
    province: string;
    district: string;
    commune: string;
    detail: string;
  };
  location: {
    lat: number;
    lng: number;
  } | null;
}

export interface AdminUser {
  id: string;
  role: UserRole.ADMIN;
  fullName: string;
  adminId: string;
  position: string;
  unit: string; // Đơn vị công tác (Sở/Bộ/Phòng)
  level: AdminLevel;
  assignedArea: string; // Địa bàn phụ trách
  username: string;
  email: string; // Đuôi .gov.vn
  phone: string;
  status: 'ACTIVE' | 'LOCKED' | 'DISABLED';
}

export type User = FarmerUser | AdminUser | null;

export enum CertType {
  VIETGAP = 'VietGAP',
  GLOBALGAP = 'GlobalGAP',
  OCOP = 'OCOP',
  ORGANIC = 'Hữu cơ'
}

export interface FarmLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface FarmingTimelineUpdate {
  id: string;
  date: string;
  stage: string;
  description: string;
  imageUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminId: string;
  action: string;
  targetId: string;
  targetName: string;
  details?: string;
}

export interface FarmProduct {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  variety: string;
  category: string;
  area: number;
  expectedYield: number;
  description: string;
  harvestMonths: number[];
  images: {
    orchard: string[];
    product: string[];
    warehouse: string[];
  };
  certificates: {
    type: CertType;
    proofUrl: string;
    issueDate: string;
    expiryDate: string; // Thêm ngày hết hạn
  }[];
  regionCode: string;
  location: FarmLocation;
  status: ProductStatus;
  contact: string;
  rating: number;
  timeline: FarmingTimelineUpdate[];
  updatedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  verificationNote?: string;
}

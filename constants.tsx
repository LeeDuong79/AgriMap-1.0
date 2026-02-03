
import { FarmProduct, ProductStatus, CertType } from './types';

export const CATEGORIES = [
  'Trái cây',
  'Lúa gạo',
  'Rau củ',
  'Thủy sản',
  'Gia súc',
  'Gia cầm',
  'Cà phê/Hồ tiêu'
];

export const MOCK_PRODUCTS: FarmProduct[] = [
  {
    id: '1',
    farmerId: 'f1',
    farmerName: 'HTX Bến Tre Công Nghệ Cao',
    name: 'Bưởi Da Xanh Bến Tre',
    variety: 'Da Xanh Ruột Hồng',
    category: 'Trái cây',
    area: 12.5,
    expectedYield: 50,
    description: 'Sản xuất theo tiêu chuẩn hữu cơ, không sử dụng thuốc trừ sâu hóa học.',
    harvestMonths: [8, 9, 10, 11, 12],
    images: {
      orchard: ['https://picsum.photos/seed/garden1/600/400'],
      product: ['https://picsum.photos/seed/buoi/600/400'],
      warehouse: ['https://picsum.photos/seed/pack/600/400'],
    },
    // Fix: Add missing expiryDate property to satisfy FarmProduct interface
    certificates: [{ type: CertType.VIETGAP, proofUrl: 'pdf1', issueDate: '2023-05-10', expiryDate: '2025-05-10' }],
    regionCode: 'VN-BTE-PUC-001',
    location: { lat: 10.2435, lng: 106.3756, address: 'Châu Thành, Bến Tre' },
    status: ProductStatus.APPROVED,
    contact: '0901234567',
    rating: 4.8,
    timeline: [
      { id: 't1', date: '2023-10-01', stage: 'Đang đậu quả', description: 'Cây phát triển tốt, đã bọc quả tránh ruồi vàng.', imageUrl: 'https://picsum.photos/seed/t1/200' }
    ],
    updatedAt: '2023-10-25'
  }
];

import type { Landlord } from '@/types/landlord.type';
import type { AmenityCode } from '@/types/enums/amenity.type';
import type { Address } from '@/types/room/address.type';
import type {
    Room,
    RoomMedia,
    RoomPrice,
} from '@/types/room';
import type { ListingPost } from '@/types/post/listing-post.type';
import type { RoomFeedItem } from '../types/room-feed.type';
import { PromotionBenefit, PromotionCode } from '@/types/enums/promotion.type';
import { Promotion, PromotionConditions } from '@/types/room/promotion.type';
import { isPromotionActive } from '@/types/constants/promotion.const';
import { PricePeriod } from '@/types/enums/price-period.type';

interface PromotionSeed {
    code: PromotionCode;
    benefit: PromotionBenefit;
    conditions?: PromotionConditions;
    startsInDays: number; // âm = đã bắt đầu từ N ngày trước
    endsInDays: number | null; // âm = đã hết hạn; null = không giới hạn
    isActive?: boolean;
}

const MOCK_NOW = new Date(Date.UTC(2026, 10, 11, 2, 0, 0));
const DAY_MS = 86_400_000;
const addDays = (days: number) => new Date(MOCK_NOW.getTime() + days * DAY_MS).toISOString();


interface RoomSeed {
    slug: string;
    title: string;
    description: string;
    category: Room['category'];
    layout: Room['layout'];
    areaM2: number;
    maxOccupants: number;
    furnished: boolean;
    rent: number;
    period?: PricePeriod;
    deposit: number;
    electricityRate: number;
    waterRate: number;
    serviceFee: number;
    address: Address;
    amenityCodes: AmenityCode[];
    landlordIndex: number;
    image: string;
    daysAgo: number;
    promotions?: PromotionSeed[];
}

const landlords: Landlord[] = [
    {
        id: 'landlord-01',
        fullName: 'Nguyễn Minh Anh',
        displayName: 'Minh Anh',
        phone: '0901234567',
        gender: 'FEMALE',
        identityVerified: true,
        verifiedAt: '2026-10-10T08:00:00.000Z',
        createdAt: '2026-08-01T08:00:00.000Z',
        updatedAt: '2026-10-10T08:00:00.000Z',
    },
    {
        id: 'landlord-02',
        fullName: 'Trần Quốc Bảo',
        displayName: 'Bảo House',
        phone: '0912345678',
        gender: 'MALE',
        identityVerified: true,
        verifiedAt: '2026-10-15T08:00:00.000Z',
        createdAt: '2026-08-10T08:00:00.000Z',
        updatedAt: '2026-10-15T08:00:00.000Z',
    },
    {
        id: 'landlord-03',
        fullName: 'Lê Hoàng Nam',
        phone: '0934567890',
        gender: 'MALE',
        identityVerified: false,
        createdAt: '2026-09-01T08:00:00.000Z',
        updatedAt: '2026-09-01T08:00:00.000Z',
    },
];

const roomSeeds: RoomSeed[] = [
    {
        slug: '001',
        title: 'Studio full nội thất, ban công lớn gần Landmark 81',
        description:
            'Căn hộ studio thiết kế hiện đại, đầy đủ nội thất, cửa sổ lớn đón ánh sáng tự nhiên. Khu vực an ninh, thuận tiện di chuyển.',
        category: 'MINI_APARTMENT',
        layout: 'STUDIO',
        areaM2: 32,
        maxOccupants: 2,
        furnished: true,
        rent: 6_800_000,
        deposit: 6_800_000,
        electricityRate: 3_800,
        waterRate: 100_000,
        serviceFee: 150_000,
        address: {
            street: 'Nguyễn Hữu Cảnh',
            ward: 'Phường 22',
            district: 'Quận Bình Thạnh',
            city: 'TP. Hồ Chí Minh',
            latitude: 10.7947,
            longitude: 106.7221,
        },
        amenityCodes: [
            'AIR_CONDITIONING',
            'WIFI',
            'PARKING',
            'PRIVATE_BATHROOM',
            'BALCONY',
            'KITCHEN',
        ],
        landlordIndex: 0,
        image:
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
        daysAgo: 0,
        promotions: [
            {
                code: 'FIRST_MONTH',
                benefit: { kind: 'PERCENT_OFF', percent: 50, months: 1 },
                startsInDays: -5,
                endsInDays: 30,
            },
        ],
    },
    {
        slug: '002',
        title: 'Phòng trọ có gác, cửa sổ thoáng, giờ giấc tự do',
        description:
            'Phòng có gác rộng, WC riêng, khu vực để xe an toàn. Gần chợ, siêu thị và các tuyến xe buýt.',
        category: 'TRADITIONAL_ROOM',
        layout: 'SHARED_ROOM',
        areaM2: 24,
        maxOccupants: 2,
        furnished: true,
        rent: 3_200_000,
        deposit: 3_200_000,
        electricityRate: 3_500,
        waterRate: 100_000,
        serviceFee: 50_000,
        address: {
            street: 'Phan Huy Ích',
            ward: 'Phường 12',
            district: 'Quận Gò Vấp',
            city: 'TP. Hồ Chí Minh',
        },
        amenityCodes: [
            'AIR_CONDITIONING',
            'WIFI',
            'PARKING',
            'PRIVATE_BATHROOM',
        ],
        landlordIndex: 1,
        image:
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
        daysAgo: 1,
        promotions: [
            {
                code: 'STUDENT',
                benefit: { kind: 'PERCENT_OFF', percent: 10 },
                conditions: { requiresStudentProof: true },
                startsInDays: -30,
                endsInDays: null,
            },
        ],
    },
    {
        slug: '003',
        title: 'Căn hộ 1 phòng ngủ riêng tư, full nội thất cao cấp',
        description:
            'Căn hộ có phòng ngủ riêng, bếp và khu vực sinh hoạt thoải mái. Phù hợp người đi làm hoặc cặp đôi.',
        category: 'MINI_APARTMENT',
        layout: 'ONE_BEDROOM',
        areaM2: 45,
        maxOccupants: 3,
        furnished: true,
        rent: 9_500_000,
        deposit: 19_000_000,
        electricityRate: 4_000,
        waterRate: 150_000,
        serviceFee: 250_000,
        address: {
            street: 'Đường số 10',
            ward: 'Phường Thảo Điền',
            district: 'TP. Thủ Đức',
            city: 'TP. Hồ Chí Minh',
        },
        amenityCodes: [
            'AIR_CONDITIONING',
            'WIFI',
            'PARKING',
            'PRIVATE_BATHROOM',
            'WASHING_MACHINE',
            'BALCONY',
            'KITCHEN',
            'ELEVATOR',
        ],
        landlordIndex: 2,
        image:
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=85',
        daysAgo: 2,
        promotions: [
            // Đã hết hạn: dùng để kiểm tra feed không hiển thị ưu đãi hết hiệu lực.
            {
                code: 'LONG_TERM',
                benefit: { kind: 'PERCENT_OFF', percent: 8 },
                conditions: { minLeaseMonths: 12 },
                startsInDays: -60,
                endsInDays: -5,
            },
        ],
    },
    {
        slug: '004',
        title: 'Phòng cao cấp gần trung tâm Phú Nhuận',
        description:
            'Phòng mới, nội thất cơ bản, ánh sáng tự nhiên. Hẻm rộng, khu dân cư yên tĩnh, an ninh tốt.',
        category: 'TRADITIONAL_ROOM',
        layout: 'STUDIO',
        areaM2: 28,
        maxOccupants: 2,
        furnished: false,
        rent: 4_500_000,
        deposit: 4_500_000,
        electricityRate: 3_500,
        waterRate: 100_000,
        serviceFee: 100_000,
        address: {
            street: 'Huỳnh Văn Bánh',
            ward: 'Phường 11',
            district: 'Quận Phú Nhuận',
            city: 'TP. Hồ Chí Minh',
        },
        amenityCodes: [
            'WIFI',
            'PARKING',
            'PRIVATE_BATHROOM',
            'BALCONY',
        ],
        landlordIndex: 0,
        image:
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85',
        daysAgo: 3,
        promotions: [
            {
                code: 'STUDENT',
                benefit: { kind: 'AMOUNT_OFF', amount: 200_000 },
                conditions: { requiresStudentProof: true },
                startsInDays: -10,
                endsInDays: 60,
            },
            {
                code: 'LONG_TERM',
                benefit: { kind: 'DEPOSIT_OFF', percent: 50 },
                conditions: { minLeaseMonths: 12 },
                startsInDays: -10,
                endsInDays: null,
            },
        ],
    },
    {
        slug: '005',
        title: 'Căn hộ mini gần Đại học Tôn Đức Thắng',
        description:
            'Căn hộ mini có bếp riêng, thang máy và khu vực giặt phơi. Phù hợp sinh viên và người đi làm.',
        category: 'MINI_APARTMENT',
        layout: 'STUDIO',
        areaM2: 35,
        maxOccupants: 2,
        furnished: true,
        rent: 5_800_000,
        deposit: 5_800_000,
        electricityRate: 3_800,
        waterRate: 100_000,
        serviceFee: 150_000,
        address: {
            street: 'Nguyễn Thị Thập',
            ward: 'Phường Tân Phong',
            district: 'Quận 7',
            city: 'TP. Hồ Chí Minh',
        },
        amenityCodes: [
            'AIR_CONDITIONING',
            'WIFI',
            'PARKING',
            'PRIVATE_BATHROOM',
            'WASHING_MACHINE',
            'KITCHEN',
            'ELEVATOR',
        ],
        landlordIndex: 1,
        image:
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85',
        daysAgo: 4,
        promotions: [
            {
                code: 'FIRST_MONTH',
                benefit: { kind: 'FREE_MONTHS', months: 1 },
                conditions: { minLeaseMonths: 12 },
                startsInDays: -3,
                endsInDays: 45,
            },
        ],
    },
    {
        slug: '006',
        title: 'Nhà nguyên căn 2 tầng, có sân và chỗ để xe',
        description:
            'Nhà nguyên căn gồm 2 phòng ngủ, phòng khách và bếp riêng. Có sân trước, khu vực dân cư ổn định.',
        category: 'WHOLE_HOUSE',
        layout: 'TWO_BEDROOM',
        areaM2: 90,
        maxOccupants: 5,
        furnished: false,
        rent: 14_000_000,
        deposit: 28_000_000,
        electricityRate: 3_500,
        waterRate: 150_000,
        serviceFee: 0,
        address: {
            street: 'Cách Mạng Tháng Tám',
            ward: 'Phường 11',
            district: 'Quận 3',
            city: 'TP. Hồ Chí Minh',
        },
        amenityCodes: [
            'PARKING',
            'PRIVATE_BATHROOM',
            'BALCONY',
            'KITCHEN',
        ],
        landlordIndex: 2,
        image:
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
        daysAgo: 5,
    },
    {
        slug: '007',
        title: 'Phòng tiện nghi, WC riêng gần sân bay Tân Sơn Nhất',
        description:
            'Phòng sạch sẽ, có máy lạnh, tủ quần áo và khu vực nấu ăn. Thuận tiện di chuyển ra sân bay.',
        category: 'TRADITIONAL_ROOM',
        layout: 'STUDIO',
        areaM2: 22,
        maxOccupants: 2,
        furnished: true,
        rent: 3_800_000,
        deposit: 3_800_000,
        electricityRate: 3_500,
        waterRate: 100_000,
        serviceFee: 50_000,
        address: {
            street: 'Cộng Hòa',
            ward: 'Phường 4',
            district: 'Quận Tân Bình',
            city: 'TP. Hồ Chí Minh',
        },
        amenityCodes: [
            'AIR_CONDITIONING',
            'WIFI',
            'PARKING',
            'PRIVATE_BATHROOM',
        ],
        landlordIndex: 0,
        image:
            'https://images.unsplash.com/photo-1522156373667-4c7234bbd804?auto=format&fit=crop&w=1200&q=85',
        daysAgo: 6,
    },
    {
        slug: '008',
        title: 'Studio thiết kế tối giản, view thành phố',
        description:
            'Không gian riêng tư, nội thất hiện đại, khu vực bếp và ban công thoáng. Gần phố đi bộ và trung tâm thương mại.',
        category: 'HOMESTAY',
        layout: 'STUDIO',
        areaM2: 40,
        maxOccupants: 10,
        furnished: true,
        rent: 8_500_000,
        period: 'DAY',
        deposit: 4_500_000,
        electricityRate: 0,
        waterRate: 0,
        serviceFee: 200_000,
        address: {
            street: 'Nguyễn Thái Bình',
            ward: 'Phường Nguyễn Thái Bình',
            district: 'Quận 1',
            city: 'TP. Hồ Chí Minh',
        },
        amenityCodes: [
            'AIR_CONDITIONING',
            'WIFI',
            'PARKING',
            'PRIVATE_BATHROOM',
            'BALCONY',
            'KITCHEN',
            'ELEVATOR',
        ],
        landlordIndex: 1,
        image:
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
        daysAgo: 7,
        promotions: [
            {
                code: 'STUDENT',
                benefit: { kind: 'PERCENT_OFF', percent: 15 },
                conditions: { requiresStudentProof: true },
                startsInDays: -20,
                endsInDays: 90,
            },
        ],
    },
    {
        slug: '009',
        title: 'Phòng trọ rộng, có máy giặt và bếp riêng',
        description:
            'Phòng thoáng mát, diện tích rộng, đầy đủ tiện nghi cần thiết. Gần các trường đại học và khu văn phòng.',
        category: 'TRADITIONAL_ROOM',
        layout: 'STUDIO',
        areaM2: 26,
        maxOccupants: 2,
        furnished: true,
        rent: 4_200_000,
        deposit: 4_200_000,
        electricityRate: 3_500,
        waterRate: 100_000,
        serviceFee: 100_000,
        address: {
            street: 'Thành Thái',
            ward: 'Phường 14',
            district: 'Quận 10',
            city: 'TP. Hồ Chí Minh',
        },
        amenityCodes: [
            'AIR_CONDITIONING',
            'WIFI',
            'PARKING',
            'PRIVATE_BATHROOM',
            'WASHING_MACHINE',
            'KITCHEN',
        ],
        landlordIndex: 2,
        image:
            'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=85',
        daysAgo: 8,
    },
    {
        slug: '010',
        title: 'Căn hộ studio hiện đại tại khu Cầu Giấy',
        description:
            'Căn hộ thiết kế gọn gàng, có thang máy, bếp riêng và ban công. Gần các tuyến giao thông công cộng.',
        category: 'MINI_APARTMENT',
        layout: 'STUDIO',
        areaM2: 33,
        maxOccupants: 2,
        furnished: true,
        rent: 5_500_000,
        deposit: 5_500_000,
        electricityRate: 4_000,
        waterRate: 120_000,
        serviceFee: 180_000,
        address: {
            street: 'Trần Thái Tông',
            ward: 'Dịch Vọng',
            district: 'Quận Cầu Giấy',
            city: 'Hà Nội',
        },
        amenityCodes: [
            'AIR_CONDITIONING',
            'WIFI',
            'PARKING',
            'PRIVATE_BATHROOM',
            'BALCONY',
            'KITCHEN',
            'ELEVATOR',
        ],
        landlordIndex: 0,
        image:
            'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85',
        daysAgo: 9,
        promotions: [
            {
                code: 'LONG_TERM',
                benefit: { kind: 'PERCENT_OFF', percent: 5 },
                conditions: { minLeaseMonths: 6 },
                startsInDays: -15,
                endsInDays: null,
            },
        ],
    },
];

export const mockRoomFeed: RoomFeedItem[] = roomSeeds.map(
    (seed, index) => {
        const id = `room-${seed.slug}`;
        const landlord = landlords[seed.landlordIndex];
        const publishedAt = new Date(
            Date.UTC(2026, 10, 11 - seed.daysAgo, 2, 0, 0),
        ).toISOString();

        const room: Room = {
            id,
            landlordId: landlord.id,
            title: seed.title,
            description: seed.description,
            category: seed.category,
            layout: seed.layout,
            areaM2: seed.areaM2,
            maxOccupants: seed.maxOccupants,
            furnished: seed.furnished,
            address: seed.address,
            amenityCodes: [...seed.amenityCodes],
            status: 'PUBLISHED',
            verification: 'APPROVED',
            createdAt: publishedAt,
            updatedAt: publishedAt,
        };

        const post: ListingPost = {
            id: `post-${seed.slug}`,
            authorId: landlord.id,
            roomId: id,
            type: 'LISTING',
            title: seed.title,
            content: seed.description,
            moderationStatus: 'APPROVED',
            publishedAt,
            createdAt: publishedAt,
            updatedAt: publishedAt,
        };

        const price: RoomPrice = {
            id: `price-${seed.slug}`,
            roomId: id,
            rent: seed.rent,
            period: seed.period ?? 'MONTH',
            deposit: seed.deposit,
            electricityRate: seed.electricityRate,
            waterRate: seed.waterRate,
            serviceFee: seed.serviceFee,
            effectiveFrom: publishedAt,
            createdAt: publishedAt,
            updatedAt: publishedAt,
        };

        const media: RoomMedia[] = [
            {
                id: `media-${seed.slug}`,
                roomId: id,
                type: 'IMAGE',
                url: seed.image,
                sortOrder: 0,
                isCover: true,
                createdAt: publishedAt,
                updatedAt: publishedAt,
            },
        ];

        const promotions: Promotion[] = (seed.promotions ?? [])
            .map((item, promoIndex) => ({
                id: `promo-${seed.slug}-${promoIndex + 1}`,
                roomId: id,
                code: item.code,
                benefit: item.benefit,
                conditions: item.conditions ?? {},
                startsAt: addDays(item.startsInDays),
                endsAt: item.endsInDays === null ? null : addDays(item.endsInDays),
                isActive: item.isActive ?? true,
                createdAt: publishedAt,
                updatedAt: publishedAt,
            }))
            .filter((promotion) => isPromotionActive(promotion, MOCK_NOW));

        return {
            post,
            room,
            price,
            media,
            landlord,
            promotions
        };
    },
);
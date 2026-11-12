
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { RoomDetailClient } from '@/features/rooms/components/detail/room-detail';
import { mockRoomFeed } from '@/features/rooms/mock-data/mock-room';
import { getDictionary } from '@/i18n/dictionary';
import { Locale } from '@/i18n/config';

interface RoomDetailPageProps {
    params: Promise<{
        lang: Locale;
        roomId: string;
    }>;
}

function RoomDetailSkeleton() {
    return (
        <main className="min-h-screen bg-bg px-4 py-8">
            <div className="mx-auto max-w-360 animate-pulse space-y-6">
                <div className="h-5 w-48 rounded-lg bg-surface-hover" />
                <div className="h-10 w-2/3 rounded-lg bg-surface-hover" />
                <div className="h-110 rounded-card bg-surface-hover" />
                <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                    <div className="space-y-6">
                        <div className="h-48 rounded-card bg-surface-hover" />
                        <div className="h-64 rounded-card bg-surface-hover" />
                    </div>
                    <div className="h-80 rounded-card bg-surface-hover" />
                </div>
            </div>
        </main>
    );
}

async function RoomDetailContent({
    params,
}: {
    params: RoomDetailPageProps['params'];
}) {
    const { lang, roomId } = await params;
    const dict = await getDictionary(lang);

    const item = mockRoomFeed.find((item) => item.room.id === roomId,);

    if (!item) { notFound(); }

    return (
        <RoomDetailClient
            lang={lang} 
            t={dict['room-detail']} 
            common={dict.common} 
            enums={dict.enums}
            item={item}
        />
    );
}

export default function RoomDetailPage({
    params,
}: RoomDetailPageProps) {
    return (
        <Suspense fallback={<RoomDetailSkeleton />}>
            <RoomDetailContent params={params} />
        </Suspense>
    );
}

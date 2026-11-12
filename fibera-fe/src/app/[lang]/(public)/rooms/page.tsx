import { Reveal } from '@/components/ui/Reveal';
import { RoomFeedClient } from '@/features/rooms/components/room-feed';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';

export default async function RoomsPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <Reveal>
            <RoomFeedClient lang={lang} t={dict['room-feed']} common={dict.common} enums={dict.enums} />
        </Reveal>
    );
}
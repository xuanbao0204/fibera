
'use client';

import { useMemo, useState } from 'react';

import {
    ChevronLeft,
    ChevronRight,
    Images,
    Play,
} from 'lucide-react';

import type { RoomFeedItem } from '../../types/room-feed.type';

interface RoomGalleryProps {
    media: RoomFeedItem['media'];
    title: string;
}

export function RoomGallery({
    media,
    title,
}: RoomGalleryProps) {
    const images = useMemo(
        () => [...media].sort((a, b) => a.sortOrder - b.sortOrder),
        [media],
    );

    const [activeIndex, setActiveIndex] = useState(0);

    const activeMedia = images[activeIndex];

    const selectImage = (index: number) => {
        setActiveIndex(index);
    };

    const navigate = (direction: number) => {
        setActiveIndex((current) => {
            return (current + direction + images.length) % images.length;
        });
    };

    return (
        <section className="overflow-hidden rounded-card border border-line bg-surface shadow-panel">
            <div className="relative grid min-h-[280px] grid-cols-1 gap-1.5 bg-bg md:grid-cols-[1.65fr_1fr]">
                <div className="relative min-h-[280px] overflow-hidden md:min-h-[440px]">
                    {activeMedia ? (
                        activeMedia.type === 'VIDEO' ? (
                            <video
                                key={activeMedia.id}
                                src={activeMedia.url}
                                controls
                                className="absolute inset-0 size-full bg-black object-contain"
                            />
                        ) : (
                            <div
                                role="img"
                                aria-label={title}
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url("${activeMedia.url}")`,
                                }}
                            />
                        )
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-hover text-fg-muted">
                            <Images size={40} />
                            <span className="text-sm">Chưa có hình ảnh</span>
                        </div>
                    )}

                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                aria-label="Ảnh trước"
                                className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
                            >
                                <ChevronLeft size={21} />
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(1)}
                                aria-label="Ảnh tiếp theo"
                                className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
                            >
                                <ChevronRight size={21} />
                            </button>
                        </>
                    )}

                    <div className="absolute bottom-4 left-4 rounded-lg bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                        {activeIndex + 1} / {images.length || 1}
                    </div>
                </div>

                <div className="hidden grid-cols-2 grid-rows-2 gap-1.5 md:grid">
                    {Array.from({ length: 4 }).map((_, index) => {
                        const image = images[index + 1];

                        return (
                            <button
                                key={image?.id ?? index}
                                type="button"
                                disabled={!image}
                                onClick={() => selectImage(index + 1)}
                                aria-label={`Xem ảnh ${index + 2}`}
                                className={`group relative min-h-0 overflow-hidden bg-surface-hover ${!image ? 'cursor-default' : ''
                                    }`}
                            >
                                {image && (
                                    <>
                                        {image.type === 'VIDEO' ? (
                                            <div
                                                className="absolute inset-0 bg-cover bg-center"
                                                style={{
                                                    backgroundImage: `url("${images.find((item) => item.type === 'IMAGE')?.url ?? ''}")`,
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                style={{
                                                    backgroundImage: `url("${image.url}")`,
                                                }}
                                            />
                                        )}

                                        {image.type === 'VIDEO' && (
                                            <span className="absolute inset-0 flex items-center justify-center text-white">
                                                <Play size={28} fill="currentColor" />
                                            </span>
                                        )}

                                        {index === 3 && images.length > 5 && (
                                            <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-semibold text-white backdrop-blur-sm">
                                                +{images.length - 5} ảnh khác
                                            </span>
                                        )}
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto border-t border-line p-3">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            type="button"
                            onClick={() => selectImage(index)}
                            aria-label={`Chọn ảnh ${index + 1}`}
                            aria-pressed={activeIndex === index}
                            className={`relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${activeIndex === index
                                    ? 'border-brand shadow-glow'
                                    : 'border-transparent opacity-65 hover:opacity-100'
                                }`}
                        >
                            <span
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url("${image.type === 'IMAGE'
                                            ? image.url
                                            : images.find((item) => item.type === 'IMAGE')?.url ?? ''
                                        }")`,
                                }}
                            />

                            {image.type === 'VIDEO' && (
                                <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-white">
                                    <Play size={17} fill="currentColor" />
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}

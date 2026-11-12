'use client';

import { BadgeCheck, RotateCcw, SlidersHorizontal, } from 'lucide-react';

import type { Amenity } from '@/types/room/amenity.type';
import type { RoomFeedFilters } from '../types/room-feed.type';

import { CommonMessage, EnumMessages, RoomFeedMessage, RoomsFilterMessage } from '@/i18n/dictionary.type';
import { RoomLayout, RoomType } from '@/types';
import { Locale } from '@/i18n/config';
import { AREA_RANGE, PRICE_RANGE } from '../constants/room-feed.constant';
import { formatMessage } from '@/i18n/format';
import { AmenityCode } from '@/types/enums/amenity.type';
import { AMENITIES_BY_GROUP, AMENITY_CONFIG } from '@/types/constants/amenity.const';

interface RoomFiltersProps {
  t: RoomFeedMessage;
  lang: Locale;
  common: CommonMessage;
  enums: EnumMessages;
  filters: RoomFeedFilters;
  cities: string[];
  districts: string[];
  activeCount: number;
  resultCount?: number;
  onChange: (filters: RoomFeedFilters) => void;
  onClear: () => void;
  onClose?: () => void;
}

const inputClassName =
  'h-10 w-full rounded-xl border border-line bg-bg px-3 text-sm text-fg outline-none transition placeholder:text-fg-muted focus:border-brand focus:ring-2 focus:ring-brand/15';

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-line py-5 last:border-b-0">
      <h3 className="mb-4 text-sm font-semibold text-fg">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function RoomFilters({
  t,
  lang,
  common,
  enums,
  filters,
  cities,
  districts,
  activeCount,
  resultCount,
  onChange,
  onClear,
  onClose,
}: RoomFiltersProps) {

  const roomTypeOptions = Object.entries(enums.roomType) as [
    RoomType,
    string,
  ][];

  const roomLayoutOptions = Object.entries(enums.roomLayout) as [
    RoomLayout,
    string,
  ][];

  const nf = new Intl.NumberFormat(lang);

  const update = <K extends keyof RoomFeedFilters>(
    key: K,
    value: RoomFeedFilters[K],
  ) => {
    onChange({
      ...filters,
      [key]: value,
      ...(key === 'city' ? { district: '' } : {}),
    });
  };

  const toggleAmenity = (code: AmenityCode) => {
    const selected = filters.amenityCodes.includes(code);

    update(
      'amenityCodes',
      selected
        ? filters.amenityCodes.filter((item) => item !== code)
        : [...filters.amenityCodes, code],
    );
  };

  return (
    <div className="rounded-panel border border-line bg-surface p-5 shadow-panel">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={18}
            className="text-brand-text"
          />
          <h2 className="font-semibold text-fg">
            {t.filters.title}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs font-medium text-fg-muted transition hover:text-brand-text"
        >
          <RotateCcw size={13} />
          {common.actions.clearFilters}
          {activeCount > 0 && (
            <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-brand-text">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <FilterSection title={t.filters.location.title}>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="room-city"
              className="mb-2 block text-xs font-medium text-fg-2"
            >
              {common.terms.provinceCity}
            </label>

            <select
              id="room-city"
              value={filters.city}
              onChange={(event) =>
                update('city', event.target.value)
              }
              className={inputClassName}
            >
              <option value="">{t.filters.location.allCities}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="room-district"
              className="mb-2 block text-xs font-medium text-fg-2"
            >
              {t.filters.location.district}
            </label>

            <select
              id="room-district"
              value={filters.district}
              onChange={(event) =>
                update('district', event.target.value)
              }
              className={inputClassName}
            >
              <option value="">{t.filters.location.allDistricts}</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FilterSection>

      <FilterSection title={common.terms.roomType}>
        <div className="space-y-2.5">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-fg-2 transition hover:text-fg">
            <input
              type="radio"
              name="room-type"
              checked={filters.roomType === 'ALL'}
              onChange={() => update('roomType', 'ALL')}
              className="size-4 accent-brand"
            />
            {t.filters.roomType.all}
          </label>

          {roomTypeOptions.map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-fg-2 transition hover:text-fg"
            >
              <input
                type="radio"
                name="room-type"
                checked={filters.roomType === value}
                onChange={() =>
                  update('roomType', value)
                }
                className="size-4 accent-brand"
              />
              {label}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={common.terms.layout}>
        <select
          value={filters.layout}
          onChange={(event) =>
            update(
              'layout',
              event.target.value as RoomFeedFilters['layout'],
            )
          }
          className={inputClassName}
        >
          <option value="ALL">{t.filters.layout.all}</option>
          {roomLayoutOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title={t.filters.price.title}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="min-price"
              className="mb-2 block text-xs text-fg-2"
            >
              {t.filters.price.from}
            </label>
            <input
              id="min-price"
              type="number"
              min="0"
              step="500000"
              placeholder={nf.format(PRICE_RANGE.min)}
              value={filters.minPrice}
              onChange={(event) =>
                update('minPrice', event.target.value)
              }
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="max-price"
              className="mb-2 block text-xs text-fg-2"
            >
              {t.filters.price.to}
            </label>
            <input
              id="max-price"
              type="number"
              min="0"
              step="500000"
              placeholder={nf.format(PRICE_RANGE.max)}
              value={filters.maxPrice}
              onChange={(event) =>
                update('maxPrice', event.target.value)
              }
              className={inputClassName}
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title={t.filters.area.title}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="min-area"
              className="mb-2 block text-xs text-fg-2"
            >
              {t.filters.area.from}
            </label>
            <input
              id="min-area"
              type="number"
              min="0"
              placeholder={nf.format(AREA_RANGE.min)}
              value={filters.minArea}
              onChange={(event) =>
                update('minArea', event.target.value)
              }
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="max-area"
              className="mb-2 block text-xs text-fg-2"
            >
              {t.filters.area.to}
            </label>
            <input
              id="max-area"
              type="number"
              min="0"
              placeholder={nf.format(AREA_RANGE.max)}
              value={filters.maxArea}
              onChange={(event) =>
                update('maxArea', event.target.value)
              }
              className={inputClassName}
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title={common.terms.amenities}>
        <div className="space-y-5">
          {AMENITIES_BY_GROUP.map(({ group, codes }) => (
            <fieldset key={group} className="space-y-3">
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-muted">
                {enums.amenityGroup[group]}
              </legend>

              {codes.map((code) => {
                const Icon = AMENITY_CONFIG[code].icon;

                return (
                  <label
                    key={code}
                    className="flex cursor-pointer items-center justify-between gap-3 text-sm text-fg-2 transition hover:text-fg"
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={15} className="text-brand-text" />
                      {enums.amenity[code]}
                    </span>
                    <input
                      type="checkbox"
                      checked={filters.amenityCodes.includes(code)}
                      onChange={() => toggleAmenity(code)}
                      className="size-4 rounded accent-brand"
                    />
                  </label>
                );
              })}
            </fieldset>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={t.filters.other.title}>
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-fg-2 transition hover:text-fg">
            <input
              type="checkbox"
              checked={filters.furnishedOnly}
              onChange={(event) =>
                update('furnishedOnly', event.target.checked)
              }
              className="size-4 rounded accent-brand"
            />
            {common.terms.furnished}
          </label>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-fg-2 transition hover:text-fg">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(event) =>
                update('verifiedOnly', event.target.checked)
              }
              className="size-4 rounded accent-brand"
            />
            <span className="flex items-center gap-1.5">
              {common.terms.verifiedLandlord}
              <BadgeCheck
                size={15}
                className="text-brand-text"
              />
            </span>
          </label>
        </div>
      </FilterSection>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-brand py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-deep hover:shadow-glow"
        >
          {formatMessage(t.filters.actions.showResults, { count: resultCount ?? 0 })}
        </button>
      )}
    </div>
  );
}

export interface SearchRoutePayload {
  itemSlug?: string;
  universitySlug?: string;
  campusSlug?: string;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
}

export interface ParseCombinedSlugOptions {
  itemSlugs: string[];
  universitySlugs: string[];
  campusSlugs: string[];
  campusUniversityMap?: Map<string, string>;
}

export interface ParsedCombinedSlug {
  itemSlug?: string;
  universitySlug?: string;
  campusSlug?: string;
}

const uniqSortedByLengthDesc = (items: string[]) => {
  return Array.from(new Set(items.filter(Boolean))).sort((a, b) => b.length - a.length);
};

export const buildCombinedSearchSlug = ({
  itemSlug,
  universitySlug,
  campusSlug,
}: Omit<SearchRoutePayload, 'keyword' | 'minPrice' | 'maxPrice' | 'condition'>): string | undefined => {
  const parts = [itemSlug, universitySlug, campusSlug].filter(Boolean) as string[];
  if (parts.length === 0) return undefined;
  return parts.join('-');
};

export const buildSearchHref = ({
  itemSlug,
  universitySlug,
  campusSlug,
  keyword,
  minPrice,
  maxPrice,
  condition,
}: SearchRoutePayload): string => {
  const combined = buildCombinedSearchSlug({ itemSlug, universitySlug, campusSlug });
  const basePath = combined ? `/tim-kiem/${combined}` : '/tim-kiem';

  const params = new URLSearchParams();
  if (keyword) params.set('q', keyword);
  if (minPrice !== undefined) params.set('minPrice', minPrice.toString());
  if (maxPrice !== undefined) params.set('maxPrice', maxPrice.toString());
  if (condition) params.set('condition', condition);

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
};

export const parseCombinedSearchSlug = (
  combinedSlug: string,
  options: ParseCombinedSlugOptions,
): ParsedCombinedSlug => {
  if (!combinedSlug) return {};

  const itemSlugs = [''].concat(uniqSortedByLengthDesc(options.itemSlugs));
  const universitySlugs = [''].concat(uniqSortedByLengthDesc(options.universitySlugs));
  const campusSlugs = [''].concat(uniqSortedByLengthDesc(options.campusSlugs));

  for (const itemSlug of itemSlugs) {
    for (const universitySlug of universitySlugs) {
      for (const campusSlug of campusSlugs) {
        if (
          campusSlug &&
          universitySlug &&
          options.campusUniversityMap &&
          options.campusUniversityMap.get(campusSlug) !== universitySlug
        ) {
          continue;
        }

        const candidate = [itemSlug, universitySlug, campusSlug].filter(Boolean).join('-');
        if (candidate === combinedSlug) {
          return {
            itemSlug: itemSlug || undefined,
            universitySlug: universitySlug || undefined,
            campusSlug: campusSlug || undefined,
          };
        }
      }
    }
  }

  if (options.campusSlugs.includes(combinedSlug)) {
    return { campusSlug: combinedSlug };
  }

  if (options.universitySlugs.includes(combinedSlug)) {
    return { universitySlug: combinedSlug };
  }

  if (options.itemSlugs.includes(combinedSlug)) {
    return { itemSlug: combinedSlug };
  }

  return {};
};

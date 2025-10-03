import type {  Point, Polygon } from "geojson";
import { type Duration } from "date-fns";

export type IWebCOOSRawAssetServiceStream = {
    url: string;
    name: string;
    port: number;
    protocol: string;
    provider: string;
}

export type IWebCOOSRawAsset =  {
    uuid: string;
    created_at: string;
    updated_at: string;
    attrs: Record<string, unknown>;
    data: {
      kind: string;
      type: string;
      uuid: string;
      common: {
        slug: string;
        label: string;
        comments: string;
        description: string;
        access_level: string;
        statistics_level: string;
      };
      system: string;
      version: string;
      uuid_slug: string;
      uuid_type: string;
      properties: {
        group: string;
        source: string;
        location: Point;
        wedge: Polygon | null;
        timezone: string;
        thumbnails: {
          base: {
            lqip: string;
            rect_large: string;
            rect_small: string;
            rect_medium: string;
            square_large: string;
            square_small: string;
            square_medium: string;
          };
        };
      };
    };
    feeds: Array<{
      uuid: string;
      created_at: string;
      updated_at: string;
      attrs: Record<string, unknown>;
      data: {
        kind: string;
        type: string;
        uuid: string;
        common: {
          slug: string;
          label: string;
          comments: string;
          description: string;
          access_level: string;
          statistics_level: string;
        };
        system: string;
        version: string;
        uuid_slug: string;
        uuid_type: string;
        properties: {
          status: string;
        };
      };
      products: Array<{
        uuid: string;
        created_at: string;
        updated_at: string;
        attrs: Record<string, unknown>;
        data: {
          kind: string;
          type: string;
          uuid: string;
          common: {
            slug: string;
            label: string;
            comments: string;
            description: string;
            access_level: string;
            statistics_level: string;
          };
          system: string;
          version: string;
          uuid_slug: string;
          uuid_type: string;
          properties: Record<string, unknown>;
        };
        services: Array<{
          uuid: string;
          created_at: string;
          updated_at: string;
          attrs: Record<string, unknown>;
          data: {
            kind: string;
            type: string;
            uuid: string;
            common: {
              slug: string;
              label: string;
              comments: string;
              description: string;
              access_level: string;
              statistics_level: string;
            };
            system: string;
            version: string;
            uuid_slug: string;
            uuid_type: string;
            properties: {
              url?: string;
              path?: string;
              bucket?: string;
              region?: string;
              base_url?: string;
              frequency: {
                type: string;
                value: string | null;
              };
              connections?: IWebCOOSRawAssetServiceStream[];
            };
          };
          elements: {
            count: number;
            size: number | null;
            first_starting: string | null;
            last_starting: string | null;
            first_ending: string | null;
            last_ending: string | null;
          };
        }>;
      }>;
    }>;
    package: {
      uuid: string;
      created_at: string;
      updated_at: string;
      attrs: Record<string, unknown>;
      data: {
        kind: string;
        type: string;
        uuid: string;
        common: {
          slug: string;
          label: string;
          comments: string;
          description: string;
          access_level: string;
          statistics_level: string;
        };
        system: string;
        version: string;
        uuid_slug: string;
        uuid_type: string;
        properties: {
          group: string;
          source: string;
          location: Point;
          timezone: string;
          thumbnails: {
            base: null;
          };
        };
      };
    };
    disposition: {
      slug: string;
      label: string;
      description: string | null;
    };
    disposition_note: string;
  };

export type IWebCOOSParsedAssetService =  {
    uuid: string;
    created_at: string;
    updated_at: string;
    attrs: Record<string, unknown>;
    data: {
        kind: string;
        type: string;
        uuid: string;
        common: {
            slug: string;
            label: string;
            comments: string;
            description: string;
            access_level: string;
            statistics_level: string;
        };
        system: string;
        version: string;
        uuid_slug: string;
        uuid_type: string;
        properties: {
            url?: string;
            path?: string;
            bucket?: string;
            region?: string;
            base_url?: string;
            frequency: {
                type: string;
                value: string | null;
            };
            connections?: Array<{
                url: string;
                name: string;
                port: number;
                protocol: string;
                provider: string;
            }>;
        };
    };
    elements: {
        count: number;
        size: number | null;
        first_starting: string | null;
        last_starting: string | null;
        first_ending: string | null;
        last_ending: string | null;
    };
  }

export type IWebCOOSParsedGalleryService =  {
    uuid: string;
    common: {
        slug: string;
        label: string;
        comments: string;
        description: string;
        access_level: string;
        statistics_level: string;
    };
    elements: {
        count: number;
        size: number | null;
        first_starting: string | null;
        last_starting: string | null;
        first_ending: string | null;
        last_ending: string | null;
    };
    sortOrder: number;
    svcType: string;
    frequency: {
        type: string;
        period: string | Duration | null;
    };
}

export type IWebCOOSParsedAsset = {
  uuid: string;
  slug: string;
  label: string;
  description: string;
  access: string;
  statisticsLevel: string;
  timezone: string;
  source: string;
  group: string;
  longitude: number;
  latitude: number;
  thumbnail: string;
  thumbnails: {
    lqip: string;
    rect_large: string;
    rect_small: string;
    rect_medium: string;
    square_large: string;
    square_small: string;
    square_medium: string;
  };
  hls_stream?: IWebCOOSRawAssetServiceStream | null;
  dash_stream?: IWebCOOSRawAssetServiceStream | null;
  embed_stream?: IWebCOOSRawAssetServiceStream | null;
  services: IWebCOOSParsedAssetService[];
  dateBounds: (string | null)[];
  galleryServices: IWebCOOSParsedGalleryService[];
  wedge: Polygon | null;
  status: {
    slug: string;
    bg: string;
    fg: string;
    colorHex: string;
    border: string;
    desc: string;
    sortorder: number;
    age: number;
  };
  products: Array<string | null>;
  geography?: {
    region: string | null;
    state: string | null;
  };
  has_live_stream: boolean;
  has_archived_video: boolean;
  has_archived_images: boolean;
};


export type IWebCOOSApiRequestParams = {
    apiUrl?: string,
    apiVersion?: string,
    source?: string,
    token?: string,
    allow_cached?: boolean,
    signal?: AbortSignal
}



export interface IWebCOOSElementInventory {
  uuid: string;
  bucket_grouping: string;
  bucket_count: number;
  time_bucket: string;
  type: string;
  asset_uuid: string;
  asset_label: string;
  asset_slug: string;
  asset_group: string;
  feed_uuid: string;
  feed_slug: string;
  product_uuid: string;
  product_slug: string;
  service_uuid: string;
  service_slug: string;
  geom: GeoJSON.Point & {
    crs: {
      type: "name";
      properties: {
        name: string;
      };
    };
  };
};


export type IPostgrestParams<T> = {
    table: string
    limit?: number
    offset?: number
    order?: {
        column: keyof T
        dir?: 'asc' | 'desc'
    },
    select?: {
        column: keyof T
        fn?: 'count' | 'sum' | 'avg' | 'min' | 'max'
        as?: string
    }[],
    filters?: {
        column: keyof T,
        operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is' | 'cs' | 'cd' | 'sl' | 'sr' | 'nxl' | 'nxr',
        value: string | number | (string | number)[]
    }[]
}
import type {  Point, Polygon } from "geojson";
import { type Duration } from "date-fns";

export type IWebCOOSRawAssetServiceStream = {
    url: string;
    name: string;
    port: number;
    protocol: string;
    provider: string;
}


type IWebCOOSThumbnails = {
  lqip: string;
  rect_large: string;
  rect_small: string;
  rect_medium: string;
  square_large: string;
  square_small: string;
  square_medium: string;
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
            base: IWebCOOSThumbnails;
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
        services: Array<IWebCOOSParsedAssetService>;
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
            base: IWebCOOSThumbnails | null;
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

export type IWebCOOSElement = {
  uuid: string;
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
    extents: {
      temporal: {
        min: string;
      };
    };
    version: string;
    uuid_slug: string;
    uuid_type: string;
    properties: {
      url: string;
      size: number;
      duration: number | null;
      thumbnails: {
        base: {
          lqip: string;
          rect_small: string;
          rect_medium: string;
        };
      };
    };
  };
};

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
  stillImageService: IWebCOOSParsedAssetService | null;
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
    signal?: AbortSignal
}

type IWebCOOSPoint = GeoJSON.Point & {
    crs: {
      type: "name";
      properties: {
        name: string;
      };
    };
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
  geom: IWebCOOSPoint;
};


export interface IWebCOOSAssetElementView {
  asset_uuid: string;
  asset_slug: string;
  asset_group: string;
  asset_source: string;
  feed_uuid: string;
  feed_slug: string;
  produt_uuid: string;
  product_uuid: string;
  product_slug: string;
  service_uuid: string;
  service_slug: string;
  element_uuid: string;
  element_type: string;
  element_starting: string | null;
  element_ending: string | null;
}

export interface IWebCOOSAssetSummaryView {
  asset_uuid: string;
  asset_label: string;
  asset_slug: string;
  asset_disposition_slug: string | null;
  asset_disposition_label: string | null;
  asset_operational_status_slug: string;
  asset_operational_status_label: string;
  asset_operational_status_note: string | null;
  asset_operational_status_as_of: string;
  asset_service_uuids: string[];
  asset_service_types: string[];
  asset_service_slugs: string[];
  asset_service_labels: string[];
  asset_product_uuids: string[];
  asset_product_types: string[];
  asset_product_slugs: string[];
  asset_product_labels: string[];
  asset_location: IWebCOOSPoint | null;
  asset_description: string;
  asset_timezone: string;
  asset_group: string;
  asset_source: string;
  asset_region: string | null;
  asset_state_or_territory: string;
  asset_country: string;
  asset_access_url: string | null;
  asset_download_url: string | null;
  asset_first_starting: string;
  asset_last_ending: string;
  asset_element_size: number;
  asset_element_count: number;
  package_uuid: string;
  package_label: string;
  package_slug: string;
  package_location: IWebCOOSPoint;
  package_description: string;
  package_timezone: string;
  package_group: string;
  package_source: string;
  package_access_url: string | null;
  package_download_url: string | null;
  asset_thumbnails?: IWebCOOSThumbnails | null;
  asset_data: {
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
      wedge: GeoJSON.Polygon | null;
      source: string;
      location: GeoJSON.Point | null;
      timezone: string;
      thumbnails: {
        base: IWebCOOSThumbnails | null
      };
    };
  }
}

export type IWebCOOSMapAsset = {asset_slug: string} & Pick<IWebCOOSAssetSummaryView, 'asset_location' | 'asset_label' | 'asset_description' | 'asset_operational_status_slug' | 'asset_operational_status_label' | 'asset_operational_status_note' | 'asset_disposition_slug' | 'asset_disposition_label' | 'asset_thumbnails'>

export type IPostgrestParams<T> = {
    table: string
    limit?: number
    offset?: number
    order?: ({
        column: string | keyof T
        dir: 'asc' | 'desc'
    })[],
    select?: (string | {
        column: string | keyof T
        fn?: 'count' | 'sum' | 'avg' | 'min' | 'max'
        as?: string
    })[],
    filters?: {
        column: string | keyof T,
        operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is' | 'cs' | 'cd' | 'sl' | 'sr' | 'nxl' | 'nxr',
        value: string | number | (string | number)[]
    }[]
}
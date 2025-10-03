export type SiteConfig = {
    site: {
        title: string;
        description: string;
    };
    helpEmail?: string;
    header: {
        logoImage: string;
        logoImageSmall: string;
        logoAltText: string;
        logoUrl: string;
        bannerText: string;
        menus: Array<{
            label: string;
            to: string;
        }>;
    };
    footer: {
        logoImage: string;
        logoAltText: string;
        contact: {
            name: string;
            address: string;
            tel?: string; // Uncomment if needed
            email: string;
        };
        linkLists?: Array<{
           title: string;
           links: Array<{
             label: string;
             to: string;
           }>;
        }>;
    };
};

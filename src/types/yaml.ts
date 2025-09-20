export type Icon = {
    label: string;
    img: string;
};

export type Button = {
    label: string;
    to: string;
};

export type HeroSection = {
    image: string;
    imageAltText: string;
    imageClassName?: string;
    title: string;
    subtitle?: string;
    markdownContent: string;
    icons: Icon[];
    buttons: Button[];
};

export type NewsItem = {
    title: string;
    date: string;
    image: string;
    imageAltText: string;
    content: string;
    link: string;
};

export type Sections = {
    hero: HeroSection;
    news: NewsItem[];
};


export type HomePage = {
    sections: {
        hero: HeroSection
        news: NewsItem[]
    }
}

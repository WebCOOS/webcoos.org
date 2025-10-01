
export type AboutSectionRow = {
    content: string;
    image?: string;
    imageAltText?: string;
    imageCaption?: string;
};

export type AboutSection = {
    title: string;
    rows: AboutSectionRow[];
    imageClassName?: string;
};

export type Partner = {
    name: string;
    image: string;
    link: string;
};


export type About = {
    sections: {
        main: AboutSection;
        contact: AboutSection;
        funding: AboutSection;
        partners: Partner[];
    };
    
};

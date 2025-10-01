export type Product = {
    label: string;
    slug: string;
    image: string;
    content: string;
    extraClasses?: string;
};

export type Products = {
    sections: {
        products: Product[];
    }    
};

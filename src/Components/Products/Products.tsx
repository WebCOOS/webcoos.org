import type { ReactElement } from "react";
import YAML from "@Layouts/YAML";
import type { Products as ProductsType } from "@/types/yaml/products";
import Section from "../Section/Section";
import ProductCard from "./ProductCard";

const ProductContent = (products: ProductsType): ReactElement => {
    return (
                        
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                        {products.sections.products.map((p) => {
                            return <ProductCard key={p.slug} {...p} />;
                        })}
                    </div>
                
    )
}
const Products = (): ReactElement => {
    return <Section className="-mt-24">
        <YAML<ProductsType>
            yamlFile="/yaml_content/products.yaml"
            Component={ProductContent}
        />
    </Section>
}

export default Products
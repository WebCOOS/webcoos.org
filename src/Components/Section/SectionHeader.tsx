import { utils } from "@axdspub/axiom-ui-utilities";
import type { SectionHeaderParams } from "./types";


function SectionHeader({ 
    className, children, ...rest }: SectionHeaderParams) {
    return (
        <h2 className={utils.makeClassName({
            defaultClassName: 'text-2xl font-bold mb-4',
            className
        })} {...rest}>{children}</h2>
    );
}

export default  SectionHeader;


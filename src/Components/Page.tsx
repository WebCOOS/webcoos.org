import React, { type HTMLProps } from 'react';

function Page({ ...props }: HTMLProps<HTMLDivElement>): React.ReactElement {
    return <div className="flex flex-col min-h-screen" {...props} />;
}

export default Page;

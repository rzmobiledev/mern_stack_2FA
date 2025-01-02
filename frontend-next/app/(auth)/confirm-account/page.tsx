import React, {Suspense} from 'react';
import ConfirmAccount from "@/app/(auth)/confirm-account/_confirmaccount";

const Page = () => {
    return (
       <Suspense>
           <ConfirmAccount/>
       </Suspense>
    );
};

export default Page;
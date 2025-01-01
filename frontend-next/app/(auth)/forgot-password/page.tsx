
import React, { Suspense } from "react";
import ForgotPassword from "./_forgotpassword";

const Page = async() => {
    return (
        <Suspense>
            <ForgotPassword />;
        </Suspense>
    );
};

export default Page;
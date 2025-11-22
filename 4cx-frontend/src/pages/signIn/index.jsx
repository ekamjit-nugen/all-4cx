/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Authentication layout components

// Images
import curved14 from "assets/images/curved-images/curved14.jpg";
import { SignIn } from "@clerk/clerk-react";
import BasicLayout from "components/basic-layout";

function SignInComponent() {
  return (
    <BasicLayout
      title="4CX.AI"
      description="Access your Organization's account"
      image={curved14}
    >
      <SignIn
        path="/authentication/sign-in"
        signUpUrl="/authentication/sign-up"
        fallbackRedirectUrl="/"
      />
    </BasicLayout>
  );
}

export default SignInComponent;

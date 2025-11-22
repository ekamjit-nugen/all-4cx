
// Images
import curved11 from "assets/images/curved-images/curved11.jpg";
import { SignUp } from "@clerk/clerk-react";
import BasicLayout from "components/basic-layout";

function SignUpComponent() {
  return (
    <BasicLayout
      title="4CX.AI"
      description="Create an Organization"
      image={curved11}
    >
    <SignUp
        signInUrl="/authentication/sign-in"
        path="/authentication/sign-up"
        fallbackRedirectUrl="/"
      />
    </BasicLayout>
  );
}

export default SignUpComponent;

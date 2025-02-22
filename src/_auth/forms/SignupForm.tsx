
import { Button } from "../../components/ui/button";

const SignupForm = () => {
  console.log("✅ SignupForm is rendering!");

  return (
    <div className="flex w-full h-screen">
      {/* Side Image */}
      <img
        src="side-img.svg" // Update with your actual image path
        alt="Signup Background"
        
      />

      {/* Signup Form Section */}
      <div className="w-full xl:w-1/2 flex items-center justify-center p-4 border border-red-500">
        <div>
          <h1 className="text-lg font-bold">Signup Form</h1>
          <Button className="bg-blue-500 text-white mt-4">Click Me</Button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;

//////

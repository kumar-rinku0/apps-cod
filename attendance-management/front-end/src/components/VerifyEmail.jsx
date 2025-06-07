import axios from "axios";
import { useSearchParams, useNavigate } from "react-router";
import { toast } from "sonner";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("TOKEN");
  console.log(token);
  const handleVerifyClick = () => {
    axios
      .get(`/api/user/verify?TOKEN=${token}`)
      .then((res) => {
        console.log(res);
        toast.info(res.data.message);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        toast.info(err.response.data.message);
      });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1a1a2e] to-[#16213e] p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          {" "}
          Please Verify Your Email
        </h1>
        {/* <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Please check your email inbox and click the verification link we sent you.
          </p> */}
        <button
          className="bg-red-400 hover:bg-red-500 text-white font-medium py-3 px-8 rounded-md text-lg transition duration-200 cursor-pointer mt-10"
          onClick={handleVerifyClick}
        >
          Verify Email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;

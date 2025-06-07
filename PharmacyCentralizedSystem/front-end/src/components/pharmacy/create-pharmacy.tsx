import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth } from "../provider/auth-provider";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import pharmacyImage from "@/assets/pharmacy-image.jpg";
import { Textarea } from "../ui/textarea";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

const schema = z.object({
  name: z.string().min(2, "Pharmacy name is required"),
  domain: z.string().min(2, "Domain is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  owner: z.string().min(2, "Owner name is required"),
  postalCode: z
    .string()
    .min(6, "Postal code must be 6-8 digits")
    .max(8, "Postal code must be 6-8 digits")
    .regex(/^\d+$/, "Postal code must be numeric"),
  registrationNumber: z.string().min(2, "Registration number is required"),
  licenceExpiry: z.string().trim().nonempty("please select an expiry duration"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  address: z.string().min(5, "Address is required"),
  logo: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size > 0, {
      message: "Uploaded file is empty or invalid",
    }),
});

type PharmacyFormData = z.infer<typeof schema>;

export const CreatePharmacy = ({ isLogin }: { isLogin: boolean }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<PharmacyFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: "",
      domain: "",
      email: "",
      licenceExpiry: "",
      name: "",
      owner: "",
      password: "",
      phone: "",
      postalCode: "",
      registrationNumber: "",
    },
  });

  const onSubmit = async (data: PharmacyFormData) => {
    console.log(data);

    setLoading(true);
    axios
      .post(`/api/pharmacy/create-pharmacy`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        toast.success(res.data.message);
        navigate(
          isLogin && isAuthenticated && user
            ? "/dashboard/list-pharmacy"
            : "/login"
        );
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-blue-700 mb-2">
          🏥 Pharmacy Registration
        </h2>
        <p className="text-gray-500">Fill in your pharmacy details below</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Pharmacy Name</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="domain">Domain</Label>
            <Input {...register("domain")} />
            {errors.domain && (
              <p className="text-sm text-red-500">{errors.domain.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="phone">Phone</Label>
            <PhoneInput
              country={"in"}
              value={phone}
              onChange={(value) => {
                setPhone(value);
                setValue("phone", value);
              }}
              inputProps={{ name: "phone", required: true }}
              inputStyle={{ width: "100%" }}
              containerStyle={{ borderRadius: "6px" }}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="owner">Owner</Label>
            <Input {...register("owner")} />
            {errors.owner && (
              <p className="text-sm text-red-500">{errors.owner.message}</p>
            )}
          </div>

          {/* <div className="flex flex-col gap-1">
            <Label htmlFor="logo">Upload Logo</Label>
            <Input
              type="file"
              accept="image/png, image/gif, image/svg, image/jpeg"
              id="logo"
              {...register("logo")}
            />
          </div> */}
          <Controller
            name="logo"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <Label>Logo Upload</Label>
                <Input
                  type="file"
                  accept="image/png, image/gif, image/svg, image/jpeg"
                  onChange={(e) => field.onChange(e.target.files?.[0])} // pass single File
                />
              </div>
            )}
          />
          {errors.logo && (
            <p className="text-sm text-red-500">{errors.logo.message}</p>
          )}

          <div className="flex flex-col gap-1">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input {...register("postalCode")} />
            {errors.postalCode && (
              <p className="text-sm text-red-500">
                {errors.postalCode.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input {...register("registrationNumber")} />
            {errors.registrationNumber && (
              <p className="text-sm text-red-500">
                {errors.registrationNumber.message}
              </p>
            )}
          </div>

          <Controller
            name="licenceExpiry"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <Label>Licence Expiry</Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  name="licenceExpiry"
                >
                  <SelectTrigger className="min-w-full">
                    <SelectValue placeholder="Select Duration" />
                  </SelectTrigger>
                  <SelectContent className="min-w-full">
                    <SelectItem value="30">One Month</SelectItem>
                    <SelectItem value="180">Six Months</SelectItem>
                    <SelectItem value="365">One Year</SelectItem>
                    <SelectItem value="99999">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
                {errors.licenceExpiry && (
                  <p className="text-sm text-red-500">
                    {errors.licenceExpiry.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="pr-10"
              />
              <span
                className="absolute inset-y-0 right-3 top-1/2 transform -translate-y-1/2 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea rows={2} {...register("address")} />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="flex justify-center md:col-span-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register Pharmacy"}
            </Button>
          </div>
        </form>

        {/* Right - Image */}
        <div className="hidden lg:flex items-center justify-center bg-blue-50 p-10">
          <div className="text-center max-w-md">
            <img
              src={pharmacyImage}
              alt="Pharmacy"
              className="mb-6 rounded-xl shadow-md w-full object-cover"
            />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Reliable Healthcare, One Registration Away
            </h3>
            <p className="text-gray-600">
              Join our network of trusted pharmacies and serve your community
              with confidence. Register now and take the first step toward
              transforming patient care!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePharmacy;

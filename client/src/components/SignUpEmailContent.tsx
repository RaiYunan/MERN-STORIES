import mailLogo from "@/assets/images/mail-logo.png";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { showToast } from "@/helpers/showToast";
import axios from "axios";

type SignUpEmailContentProps = {
  onSwitchToSignUp: () => void;
  onSwitchToSignIn: () => void;
  onSwitchToSignInEmail:()=>void;
};
const SignUpEmailContent = ({
  onSwitchToSignIn,
  onSwitchToSignUp,
  onSwitchToSignInEmail
}: SignUpEmailContentProps) => {
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const formSchema = z
    .object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      password: z.string().min(8),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const { confirmPassword, ...userData } = values;

    const url = `${import.meta.env.VITE_URL}/auth/register`;
    try {
      const response = await axios.post(url, userData);
      const data = response.data;

      showToast("success", data.message);
      onSwitchToSignInEmail();
    } catch (error:any) {
      const msg =
        error.response?.data?.message || "Something went wrong. Try again.";

      showToast("error", msg);
    }
  }

  return (
    <>
      <div className="max-w-full mx-auto">
        <img src={mailLogo} alt="mail-logo" className=" w-12 h-12" />
      </div>
      <h2 className="font-serif text-center text-2xl font-medium">
        Create Your Account
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword.new ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                      >
                        {showPassword.new ? (
                          <FaEyeSlash className="w-4 h-4" />
                        ) : (
                          <FaEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword.confirm ? "text" : "password"}
                        placeholder="Enter your password again"
                        {...field}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 tansition-colors cursor-pointer"
                        onClick={() => {
                          setShowPassword((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }));
                        }}
                      >
                        {showPassword.confirm ? (
                          <FaEyeSlash className="w-4 h-4" />
                        ) : (
                          <FaEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center flex-col gap-2">
            <Button type="submit" className="text-center max-w-fit">
              Sign Up
            </Button>
            <button className="underline text-sm" onClick={onSwitchToSignUp}>
              Back to other sign-up options
            </button>
            <p className="text-sm">
              Already have an account?{" "}
              <button className="underline" onClick={onSwitchToSignIn}>
                Sign in
              </button>
            </p>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignUpEmailContent;

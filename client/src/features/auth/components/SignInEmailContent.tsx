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
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { showToast } from "@/helpers/showToast";
import axios from "axios";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { authStart, authSuccess } from "@/features/auth/authSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

type SignInEmailContentProps = {
  onSwitchToSignIn: () => void;
  closeDialog: () => void;
};

const SignInEmailContent = ({
  onSwitchToSignIn,
  closeDialog,
}: SignInEmailContentProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const dispatch = useAppDispatch();
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    console.log("User state updated:", user);
    console.log("Auth status:", isAuthenticated);
  }, [user, isAuthenticated]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const url = `${import.meta.env.VITE_URL}/auth/login`;
    dispatch(authStart());
    try {
      const response = await axios.post(url, values, {
        withCredentials: true,
      });
      const data = response.data;

      dispatch(authSuccess(data.data));

      showToast("success", 'Welcome back!');
      closeDialog();
    } catch (error: any) {
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
        Sign in to your account
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-600 hover:text-gray-800 transition-colors"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
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
              Sign In
            </Button>

            <p className="text-sm">
              <button className="underline" onClick={onSwitchToSignIn}>
                Back to sign-in options
              </button>
            </p>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignInEmailContent;

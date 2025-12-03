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

type SignInEmailContentProps = {
  onSwitchToSignIn: () => void;
};

const SignInEmailContent = ({ onSwitchToSignIn }: SignInEmailContentProps) => {
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
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

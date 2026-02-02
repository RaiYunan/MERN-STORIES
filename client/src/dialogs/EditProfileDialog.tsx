import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, type ReactNode } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { RootState } from "@/app/store";
import userImage from "@/assets/images/default.jpg";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetch } from "@/hooks/useFetch";
import type { User } from "@/types/user";

type EditProfileDialogProps = {
  children: ReactNode;
};
const EditProfileDialog = ({ children }: EditProfileDialogProps) => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  console.log("User Data:- ", user);
  const userID = user?._id;
  console.log(userID);

  const fetchUrl = `${import.meta.env.VITE_URL}/users/get-user/${userID}`;
  const { data: userData } = useFetch<User>(fetchUrl, {
    method: "GET",
    credentials: "include",
  });
  const formSchema = z.object({
    name: z.string(),
    bio: z.string(),
  });

  console.log("Data from fetching user:- ", userData);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData?.name ?? "",
        bio: userData?.bio ?? "",
      });
    }
  }, [userData, form]);
  const onSubmit = () => {
    console.log("Submiited");
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl py-8 px-6">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mb-6">
          <p className="text-gray-700 font-medium">Photo</p>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <Avatar className="h-22 w-22 cursor-pointer shrink-0">
              <AvatarImage src={user?.avatar || userImage} alt="profile pic" />
              <AvatarFallback className="text-lg">CN</AvatarFallback>
            </Avatar>
            <div className="space-y-4 flex-1">
              <div className="flex gap-6 text-sm">
                <p className="text-green-700 cursor-pointer font-medium hover:text-green-800">
                  Update
                </p>
                <p className="text-red-700 cursor-pointer font-medium hover:text-red-800">
                  Remove
                </p>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per
                side.
              </div>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Name*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Name"
                        {...field}
                        className="h-8 text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Short bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your bio"
                        {...field}
                        className="min-h-25 text-base p-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-8 gap-3">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 hover:bg-gray-50 rounded-lg px-6 py-2.5 font-medium transition-all"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow rounded-lg px-8 py-2.5 font-medium transition-all"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;

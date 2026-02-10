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
import { useEffect, useState, type ReactNode } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { RootState } from "@/app/store";
import userImage from "@/assets/images/default.jpg";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetch } from "@/hooks/useFetch";
import type { User } from "@/types/user";
import { useWatch } from "react-hook-form";

type EditProfileDialogProps = {
  children: ReactNode;
};

const EditProfileDialog = ({ children }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [photoUpdated, setPhotoUpdated] = useState(false);
  
  const user = useAppSelector((state: RootState) => state.auth.user);
  const userID = user?._id;

  const fetchUrl = `${import.meta.env.VITE_URL}/users/get-user/${userID}`;
  const { data: userData, refetch } = useFetch<User>(fetchUrl, {
    method: "GET",
    credentials: "include",
  });

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    bio: z.string().max(160, "Bio must be 160 characters or less"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  // ✅ FIX 1: Refetch fresh data when dialog opens
  useEffect(() => {
    if (open) {
      console.log("Dialog opened, refetching user data...");
      refetch(); // Get latest data from server
      
      // Reset photo states when opening
      setPhotoRemoved(false);
      setPhotoUpdated(false);
    }
  }, [open, refetch]);

  // ✅ FIX 2: Reset form when userData changes
  useEffect(() => {
    if (userData && open) {
      console.log("Resetting form with fresh data:", userData);
      form.reset({
        name: userData?.name ?? "",
        bio: userData?.bio ?? "",
      });
    }
  }, [userData, form, open]);

  // ✅ FIX 3: Clean up states when dialog closes
  useEffect(() => {
    if (!open) {
      // Reset photo states when closing
      setPhotoRemoved(false);
      setPhotoUpdated(false);
      setSaveLoading(false);
    }
  }, [open]);

  const bio = useWatch({
    control: form.control,
    name: "bio",
  }) ?? "";

  const bioLength = bio.trim().length;
  const maxLength = 160;

  const removeProfile = () => {
    console.log("Profile removed");
    setPhotoRemoved(true);
    setPhotoUpdated(false); // Ensure mutual exclusivity
  };

  const updateProfile = () => {
    console.log("Profile updated");
    setPhotoUpdated(true);
    setPhotoRemoved(false); // Ensure mutual exclusivity
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Submitting profile update:", data);
    setSaveLoading(true);

    try {
      // Your API call here
      // await axios.patch(...)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Profile updated successfully");
      setOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const hasChanges = isDirty || photoRemoved || photoUpdated;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                <p
                  className="text-green-700 cursor-pointer font-medium hover:text-green-800"
                  onClick={updateProfile}
                >
                  Update
                </p>
                <p
                  className="text-red-700 cursor-pointer font-medium hover:text-red-800"
                  onClick={removeProfile}
                >
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
                      <div className="relative">
                        <Textarea
                          placeholder="Enter your bio"
                          {...field}
                          className="min-h-25 text-base p-4"
                        />
                        <div className="absolute bottom-3 right-3">
                          <span
                            className={`text-xs ${bioLength > maxLength * 0.9 ? "text-rose-500" : "text-gray-400"}`}
                          >
                            {bioLength}/{maxLength}
                          </span>
                        </div>
                      </div>
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
                disabled={!hasChanges || !isValid || saveLoading}
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow rounded-lg px-8 py-2.5 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
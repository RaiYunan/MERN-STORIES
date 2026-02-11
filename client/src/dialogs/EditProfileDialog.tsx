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
import axios from "axios";

type EditProfileDialogProps = {
  children: ReactNode;
};

const EditProfileDialog = ({ children }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [photoUpdated, setPhotoUpdated] = useState(false);
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
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

  // Refetch fresh data when dialog opens
  useEffect(() => {
    if (open) {
      console.log("Dialog opened, refetching user data...");
      refetch();
      
      // Reset photo states when opening
      setPhotoRemoved(false);
      setPhotoUpdated(false);
      setNewPhotoFile(null);
      setPreviewUrl(null);
    }
  }, [open, refetch]);

  // Reset form when userData changes
  useEffect(() => {
    if (userData && open) {
      console.log("Resetting form with fresh data:", userData);
      form.reset({
        name: userData?.name ?? "",
        bio: userData?.bio ?? "",
      });
    }
  }, [userData, form, open]);

  // Clean up states when dialog closes
  useEffect(() => {
    if (!open) {
      setPhotoRemoved(false);
      setPhotoUpdated(false);
      setNewPhotoFile(null);
      setPreviewUrl(null);
      setSaveLoading(false);
    }
  }, [open]);

  const bio = useWatch({
    control: form.control,
    name: "bio",
  }) ?? "";

  const bioLength = bio.trim().length;
  const maxLength = 160;

  // Handle photo removal - just update UI state
  const removeProfile = () => {
    console.log("Photo marked for removal");
    setPhotoRemoved(true);
    setPhotoUpdated(false);
    setNewPhotoFile(null);
    setPreviewUrl(null);
  };

  //  Handle photo update - show file picker and preview
  const updateProfile = () => {
    // Create a hidden file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/jpg,image/png,image/gif";
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        // Validate file size (e.g., max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("File size must be less than 5MB");
          return;
        }
        
        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert("Please select an image file");
          return;
        }
        
        console.log("Photo selected:", file.name);
        setNewPhotoFile(file);
        setPhotoUpdated(true);
        setPhotoRemoved(false);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  //  Determine which image to show
  const getDisplayImage = () => {
    // If photo is marked for removal, show default image
    if (photoRemoved) {
      return userImage;
    }
    
    // If new photo is selected, show preview
    if (photoUpdated && previewUrl) {
      return previewUrl;
    }
    
    // Otherwise show current user avatar or default
    return user?.avatar || userImage;
  };

  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Submitting profile update:", data);
    setSaveLoading(true);

    try {
      let avatarUrl = user?.avatar;

      // Handle photo upload
      if (photoUpdated && newPhotoFile) {
        console.log("Uploading new photo...");
        
        const formData = new FormData();
        formData.append("avatar", newPhotoFile);
        
        const uploadResponse = await axios.post(
          `${import.meta.env.VITE_URL}/users/upload-avatar`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        avatarUrl = uploadResponse.data.avatarUrl;
        console.log("Photo uploaded successfully:", avatarUrl);
      }
    

      // Update profile with all changes
      const updateResponse = await axios.patch(
        `${import.meta.env.VITE_URL}/users/me`,
        {
          name: data.name,
          bio: data.bio,
          avatar: avatarUrl,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Profile updated successfully:", updateResponse.data);
      
      // Refetch to update all components
      await refetch();
      
      setOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      // TODO: Show error toast notification
      alert("Failed to update profile. Please try again.");
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
            <div className="relative">
              <Avatar className="h-22 w-22 cursor-pointer shrink-0">
                <AvatarImage 
                  src={getDisplayImage()} 
                  alt="profile pic" 
                />
                <AvatarFallback className="text-lg">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "UR"}
                </AvatarFallback>
              </Avatar>
              
          
            </div>
            
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
              {photoRemoved && (
                <div className="text-sm text-red-600 font-medium">
                  ⚠️ Profile photo will be removed when you save
                </div>
              )}
              {photoUpdated && newPhotoFile && (
                <div className="text-sm text-green-600 font-medium">
                  ✓ New photo selected: {newPhotoFile.name}
                </div>
              )}
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
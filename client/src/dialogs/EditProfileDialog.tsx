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
import { useEffect, useState, useCallback, type ReactNode } from "react";
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
import { useDropzone } from "react-dropzone";
import { Camera } from "lucide-react";
import { setUser } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";

type EditProfileDialogProps = {
  children: ReactNode;
  onSuccess?: () => void;
};

const EditProfileDialog = ({ children ,onSuccess}: EditProfileDialogProps) => {
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (open) {
      console.log("Dialog opened, refetching user data...");
      refetch();

      setPhotoRemoved(false);
      setPhotoUpdated(false);
      setNewPhotoFile(null);
      setPreviewUrl(null);
    }
  }, [open, refetch]);

  useEffect(() => {
    if (userData && open) {
      console.log("Resetting form with fresh data:", userData);
      form.reset({
        name: userData?.name ?? "",
        bio: userData?.bio ?? "",
      });
    }
  }, [userData, form, open]);

  useEffect(() => {
    if (!open) {
      setPhotoRemoved(false);
      setPhotoUpdated(false);
      setNewPhotoFile(null);
      setPreviewUrl(null);
      setSaveLoading(false);
    }
  }, [open]);

  // Cleanup preview URL on unmount or when it changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        console.log("Preview URL revoked:", previewUrl);
      }
    };
  }, [previewUrl]);

  const bio =
    useWatch({
      control: form.control,
      name: "bio",
    }) ?? "";

  const bioLength = bio.trim().length;
  const maxLength = 160;

  const handleFileSelection = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      console.log("File:- ", file);

      if (!file) return;

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      console.log("Photo selected:", file.name);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      setNewPhotoFile(file);
      setPhotoUpdated(true);
      setPhotoRemoved(false);
    },
    [previewUrl],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openDropzone,
  } = useDropzone({
    onDrop: handleFileSelection,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  // Handle photo removal
  const removeProfile = () => {
    console.log("Photo marked for removal");
    setPhotoRemoved(true);
    setPhotoUpdated(false);
    setNewPhotoFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleUpdateClick = () => {
    openDropzone();
  };

  const getDisplayImage = () => {
    if (photoRemoved) {
      return userImage;
    }

    if (photoUpdated && previewUrl) {
      return previewUrl;
    }

    return user?.avatar || userImage;
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Submitting profile update:", data);
    setSaveLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("bio", data.bio);

      if (photoUpdated && newPhotoFile) {
        console.log("Uploading new photo...");
        formData.append("avatar", newPhotoFile);
      }

      if (photoRemoved) {
        console.log("Removing photo...");
        formData.append("removeAvatar", "true");
      }

      const updateResponse = await axios.patch(
        `${import.meta.env.VITE_URL}/users/me/update-user-details`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    

      await refetch(); 
      onSuccess?.();
      setOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
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
            <div {...getRootProps()} className="relative">
              <input {...getInputProps()} />
              <Avatar className="h-24 w-24 cursor-pointer shrink-0 group">
                <AvatarImage
                  src={getDisplayImage()}
                  alt="profile pic"
                  className="object-cover"
                />
                <AvatarFallback className="text-lg bg-green-50 text-green-700">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "UR"}
                </AvatarFallback>

                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-full transition-opacity ${
                    isDragActive
                      ? "bg-green-500/70 opacity-100"
                      : "bg-black/50 opacity-0 group-hover:opacity-100"
                  }`}
                  onClick={handleUpdateClick}
                >
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </Avatar>
            </div>

            <div className="space-y-4 flex-1">
              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUpdateClick}
                  className="text-green-700 border-green-200 hover:bg-green-50 hover:border-green-300"
                >
                  Update
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeProfile}
                  disabled={!user?.avatar && !photoUpdated}
                  className="text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </Button>
              </div>

              <div className="text-sm text-gray-600 leading-relaxed">
                <p className="font-medium mb-1">Photo Guidelines:</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li>Square JPG, PNG, or GIF recommended</li>
                  <li>At least 1,000 pixels per side</li>
                  <li>Maximum file size: 5MB</li>
                </ul>
              </div>

              {isDragActive && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded-md border border-green-200">
                  📁 Drop your photo here...
                </div>
              )}

              {photoRemoved && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                  ⚠️ Profile photo will be removed when you save
                </div>
              )}

              {photoUpdated && newPhotoFile && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded-md border border-green-200">
                  <p className="font-medium">✓ New photo selected:</p>
                  <p className="text-xs mt-1">
                    {newPhotoFile.name} ({(newPhotoFile.size / 1024).toFixed(0)}{" "}
                    KB)
                  </p>
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
                        className="h-10 text-base"
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
                          placeholder="Tell us about yourself..."
                          maxLength={160}
                          {...field}
                          className="
                  w-full
                  h-[100px]
                  resize-none
                  overflow-y-auto
                  overflow-x-hidden
                  break-all
                  whitespace-pre-wrap
                  rounded-lg
                  border-gray-300
                  text-sm
                  focus:ring-green-500
                  focus:border-green-500
                  pr-12
                "
                        />
                        <div className="absolute bottom-3 right-3">
                          <span
                            className={`text-xs font-medium ${
                              bioLength > maxLength * 0.9
                                ? "text-rose-500"
                                : bioLength > maxLength * 0.75
                                  ? "text-amber-500"
                                  : "text-gray-400"
                            }`}
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
                  type="button"
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 hover:bg-gray-50 rounded-lg px-6 py-2.5 font-medium transition-all"
                  disabled={saveLoading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={!hasChanges || !isValid || saveLoading}
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow rounded-lg px-8 py-2.5 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;

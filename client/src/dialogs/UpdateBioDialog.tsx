
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
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useEffect, useState, type ReactNode } from "react";

type UpdateBioDialogProps = {
  children: ReactNode;
  initialBio?: string;
};

const UpdateBioDialog = ({
  children,
  initialBio = "",
}: UpdateBioDialogProps) => {
  
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState(initialBio);

useEffect(() => {
  setBio(initialBio);
}, [initialBio]);

  const bioLength = bio.length;

  const maxLength = 160;

  

  async function handleSubmit() {
    console.log(" button clicked")
    const url = `${import.meta.env.VITE_URL}/users/me/bio`;
    try {
      setLoading(true);
      const response = await axios.patch(
        url,
        { bio: bio.trim() },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log(response);
    } catch (err) {
      console.error("Failed to update bio", err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-xl border border-gray-200 shadow-lg p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-medium text-gray-900">
            Edit bio
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Tell others about yourself
          </DialogDescription>
        </DialogHeader>

        <form
          className="px-6 pb-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share what you're passionate about, your expertise, or what inspires you..."
                rows={4}
                className="resize-none rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500 pr-12 text-sm"
                maxLength={maxLength}
              />

              <div className="absolute bottom-2 right-2">
                <span
                  className={`text-xs ${bioLength > maxLength * 0.9 ? "text-rose-500" : "text-gray-400"}`}
                >
                  {bioLength}/{maxLength}
                </span>
              </div>
            </div>

            <div className="flex items-center text-xs text-gray-500">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3">Keep it genuine</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
          </div>
        

        <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
             disabled={loading || !bio.trim()}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
           {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
        </form> 
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBioDialog;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Calendar,
  Edit,
  Globe,
  BookOpen,
  PenTool,
  Eye,
  Users,
  Plus,
  Pencil,
} from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { RootState } from "@/app/store";
import EditProfileDialog from "@/dialogs/EditProfileDialog";
import { useFetch } from "@/hooks/useFetch";
import type { User } from "@/types/user";
import UpdateBioDialog from "@/dialogs/UpdateBioDialog";

const Profile = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const userId = user?._id;

  const url = `${import.meta.env.VITE_URL}/users/get-user/${userId}`;
  const {
    data: userData,
    loading,
    error,
  } = useFetch<User>(
    url,
    {
      method: "GET",
      credentials: "include",
    },
    [userId],
  );

  console.log("data:", userData);
  const bio = userData?.bio?.trim();

  console.log("loading:", loading);
  console.log("error:-", error);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  const mockStats = [
    { label: "Stories", value: 24, icon: <PenTool className="h-4 w-4" /> },
    { label: "Reads", value: "1.4K", icon: <Eye className="h-4 w-4" /> },
    { label: "Followers", value: 186, icon: <Users className="h-4 w-4" /> },
    { label: "Following", value: 92, icon: <Users className="h-4 w-4" /> },
  ];

  const mockRecentStories = [
    { title: "Morning Coffee", date: "2 hours ago", reads: 42 },
    { title: "City Lights", date: "1 day ago", reads: 89 },
    { title: "Mountain Trails", date: "3 days ago", reads: 156 },
  ];

  const mockTags = ["Fiction", "Travel", "Personal", "Poetry", "Tech"];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Profile
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Your writing journey</p>
          </div>
          <EditProfileDialog>
            <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </EditProfileDialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="pt-6 px-6 pb-6">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-6">
                    <AvatarImage src={user?.avatar || ""} />
                    <AvatarFallback className="bg-green-50 text-green-700">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "UR"}
                    </AvatarFallback>
                  </Avatar>

                  <h2 className="text-xl font-semibold text-gray-900">
                    {user?.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Storyteller & Writer
                  </p>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                      {user?.authProvider || "Google"}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-2 gap-4">
                  {mockStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center p-3 rounded-lg hover:bg-green-50/50 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="text-green-600">{stat.icon}</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {stat.value}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-green-600 shrink-0" />
                    <div className="text-sm">
                      <div className="text-gray-500">Email</div>
                      <div className="text-gray-900 truncate">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-green-600 shrink-0" />
                    <div className="text-sm">
                      <div className="text-gray-500">Joined</div>
                      <div className="text-gray-900">
                        {joinDate || "Recently"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-green-600 shrink-0" />
                    <div className="text-sm">
                      <div className="text-gray-500">Location</div>
                      <div className="text-gray-900">Kathmandu, Nepal</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-gray-900">
                  Writing Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockTags.map((tag, index) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={`rounded-md text-xs ${
                        index === 0
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {bio ? (
                    <div className="group relative p-3 pr-10 rounded-lg hover:bg-gray-50/80 transition-colors duration-200">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-1 h-full bg-linear-to-b from-emerald-300 to-emerald-500 rounded-full mt-1"></div>
                        <p className="text-gray-800 leading-relaxed text-sm sm:text-base flex-1 min-w-0">
                          {bio}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 
               hover:scale-105 active:scale-95 text-gray-500 hover:text-emerald-600 
               hover:bg-emerald-50 border border-transparent hover:border-emerald-100
               shadow-sm hover:shadow-xs p-1.5 h-auto"
                        title="Edit bio"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>

                      {/* Subtle hover indicator */}
                      <div className="absolute inset-0 border border-transparent group-hover:border-emerald-100 rounded-lg pointer-events-none transition-colors duration-200"></div>
                    </div>
                  ) : (
                    <div className="text-center p-6 border border-gray-100 rounded-xl bg-linear-to-b from-white to-emerald-50/20">
                      <h4 className="text-gray-900 font-medium mb-2">
                        Your story begins here
                      </h4>
                      <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                        Add a short bio to introduce yourself to your readers
                      </p>
                      <UpdateBioDialog >
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition-shadow">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Bio
                        </Button>
                      </UpdateBioDialog>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Start Writing
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-50"
                  >
                    View Archive
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Recent Stories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRecentStories.map((story, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-100 rounded-lg hover:border-green-200 hover:bg-green-50/30 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 hover:text-green-700 transition-colors">
                          {story.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm text-gray-500">
                            {story.date}
                          </span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Eye className="h-3 w-3 text-green-600" />
                            {story.reads}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-700 hover:text-green-800 hover:bg-green-50"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="w-full text-green-700 hover:text-green-800 hover:bg-green-50"
                >
                  View All Stories
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

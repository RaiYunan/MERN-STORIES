import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar, Edit, Globe, BookOpen } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { RootState } from "@/app/store";

const Profile = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
//   const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);

 
  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    : '';


  const mockStats = {
    stories: 24,
    reads: 1420,
    followers: 186,
    following: 92
  };

  const mockRecentStories = [
    { title: "Morning Coffee", date: "2 hours ago", reads: 42 },
    { title: "City Lights", date: "1 day ago", reads: 89 },
    { title: "Mountain Trails", date: "3 days ago", reads: 156 },
  ];

  const mockTags = ["Fiction", "Travel", "Personal", "Poetry", "Tech"];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Your stories and writing journey</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-gray-200 shadow-sm overflow-hidden">
              <div className="h-24 bg-linear-to-r from-blue-50 to-indigo-50" />
              <CardContent className="pt-0">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-white -mt-16 mx-auto shadow-lg">
                    <AvatarImage src={user?.avatar || ""} />
                    <AvatarFallback className="bg-linear-to-br from-blue-100 to-indigo-100 text-lg">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'UR'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="text-center mt-6">
                  <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">Storyteller & Writer</p>
                  
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">
                      {user?.authProvider || 'Google'}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Writer
                    </Badge>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{mockStats.stories}</div>
                    <div className="text-xs text-gray-500">Stories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{mockStats.reads}</div>
                    <div className="text-xs text-gray-500">Reads</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{mockStats.followers}</div>
                    <div className="text-xs text-gray-500">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{mockStats.following}</div>
                    <div className="text-xs text-gray-500">Following</div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Info */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Email</div>
                      <div className="text-gray-600 truncate">{user?.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Joined</div>
                      <div className="text-gray-600">{joinDate || 'Recently'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Location</div>
                      <div className="text-gray-600">Kathmandu, Nepal</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Writing Tags */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Writing Style</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockTags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline"
                      className="rounded-full px-3 py-1 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio Card */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Sharing stories that inspire and connect. From personal essays to fictional tales, 
                  each piece is a fragment of life's beautiful journey. Currently writing about 
                  technology, travel, and the human experience.
                </p>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">Start Writing</Button>
                  <Button variant="outline" size="sm">View Archive</Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Stories */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Recent Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentStories.map((story, index) => (
                    <div 
                      key={index} 
                      className="group p-4 rounded-lg border border-gray-100 hover:border-gray-300 transition-all hover:shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {story.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-500">{story.date}</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{story.reads} reads</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Stories
                </Button>
              </CardContent>
            </Card>

            {/* Reading List */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Reading List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "The Art of Storytelling",
                    "Digital Nomad Diaries",
                    "Morning Pages",
                    "Urban Explorations"
                  ].map((title, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{title}</span>
                      <Badge variant="outline" className="text-xs">Saved</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Profile;
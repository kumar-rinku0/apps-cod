import { useAuth } from "./provider/auth-provider";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Profile: React.FC = () => {
  const { isAuthenticated, user, signOut } = useAuth();

  const handleDelete = (id: string) => {
    axios
      .delete(`/api/user/delete/${id}`)
      .then((res) => {
        console.log(res.data);
        signOut();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "";
    const names = name.trim().split(" ");
    return names.map((n) => n[0].toUpperCase()).join("");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-700">
          Please log in to view your profile
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-lg w-full space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
            {getInitials(user?.fullName)}
          </div>
          <h2 className="text-3xl font-extrabold text-blue-700">
            User Profile
          </h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between items-center">
            <span className="font-medium">Full Name:</span>
            <span className="capitalize">{user?.fullName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Email:</span>
            <span className="lowercase">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Role:</span>
            <span>{user?.role}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. It will permanently delete your
                  account and remove all data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => user?._id && handleDelete(user._id)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            // onClick={() => navigate(`/dashboard/edit?pharmacyId=${user?._id}`)}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

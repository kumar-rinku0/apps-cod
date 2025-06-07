import axios from "axios";
import {
  Copy,
  CopyCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "../provider/auth-provider";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

type PharmacyType = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  userId: string;
  address: string;
  domain: string;
  logo: string;
  owner: string;
  postalCode: string;
  registrationNumber: string;
  establistedAt: string;
  licenceKey: string;
  licenceExpiry: string;
  createdBy: {
    _id: string;
    status: string;
  };
};

const Pharmacy = () => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [pharmacies, setPharmacies] = useState<PharmacyType[] | null>(null);
  const [copiedLicence, setCopiedLicence] = useState<string | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyType | null>(
    null
  );

  const handleGetPharmacies = (role: string, id: string) => {
    setLoading(true);
    axios
      .get(
        role === "admin"
          ? "/api/pharmacy/getall"
          : `/api/pharmacy/getbyuserid/${id}`
      )
      .then((res) => {
        const { pharmacies } = res.data;
        console.log(res);
        setPharmacies(pharmacies);
      })
      .catch((err) => {
        const msg =
          err.response.data.message || err.response.data.error || err.message;
        if (msg === "login application to access route!") {
          toast.error("pharmacy is not active, plase!");
          // toast.error("User not logged in. Reloading... in 2s");
          // console.warn("User not logged in. Reloading...");
          setTimeout(() => {
            window.location.reload(); // or redirect to login
          }, 2000);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEditPageNavigate = (pharmacyId: string) => {
    if (user?.role === "admin") {
      navigate(`/dashboard/edit?pharmacyId=${pharmacyId}`);
    } else {
      navigate(`/edit?pharmacyId=${pharmacyId}`);
    }
  };

  const handleCopy = (licence: string) => {
    navigator.clipboard.writeText(licence);
    setCopiedLicence(licence);
    setTimeout(() => setCopiedLicence(null), 2000);
  };

  const handleDelete = (pharmacyId: string) => {
    if (isAuthenticated && user?.role === "admin") {
      axios
        .delete(`/api/pharmacy/delete/pharmacyId/${pharmacyId}`)
        .then((res) => {
          handleGetPharmacies(user.role, user._id);
          toast.message(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          const msg =
            err.response.data.message || err.response.data.error || err.message;
          toast.error(msg);
        });
    }
  };

  const handleToggleStatus = (userId: string) => {
    axios
      .put(`/api/user/${userId}/toggle-status`)
      .then((res) => {
        console.log(res);
        handleGetPharmacies("admin", "");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to update status");
      });
  };

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      handleGetPharmacies(user.role || "", user._id || "");
    }
  }, [isAuthenticated, user?._id]);

  if (loading || !pharmacies) {
    return (
      <div className="flex h-[90vh] justify-center items-center">
        <FaSpinner size={20} className="animate-spin" />
      </div>
    );
  }

  if (pharmacies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          No Pharmacies!
        </h2>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Pharmacies</h2>

      <Dialog
        open={selectedPharmacy !== null}
        onOpenChange={() => setSelectedPharmacy(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPharmacy?.name}</DialogTitle>
            <DialogDescription>its all about pharmacy! </DialogDescription>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">Licence:</span>{" "}
                  <span>{selectedPharmacy?.licenceKey}</span>
                </div>
                <Button
                  variant={"outline"}
                  onClick={() =>
                    selectedPharmacy && handleCopy(selectedPharmacy.licenceKey)
                  }
                  title={
                    copiedLicence === selectedPharmacy?.licenceKey
                      ? "Copied!"
                      : "Copy to clipboard"
                  }
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  {copiedLicence === selectedPharmacy?.licenceKey ? (
                    <CopyCheck className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p>
                <span className="font-medium">Owner:</span>{" "}
                {selectedPharmacy?.owner}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {selectedPharmacy?.phone}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {selectedPharmacy?.email}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {selectedPharmacy?.address}
              </p>
              <p>
                <span className="font-medium">Expiry:</span>{" "}
                {new Date(
                  selectedPharmacy?.licenceExpiry || ""
                ).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    selectedPharmacy &&
                    handleEditPageNavigate(selectedPharmacy._id)
                  }
                >
                  Update
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>

        <div className="overflow-x-auto border rounded-md shadow-sm">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700 uppercase">
                <th className="px-6 py-3">S.No</th>
                <th className="px-6 py-3">Logo</th>
                <th className="px-6 py-3">Pharmacy Name</th>
                {user?.role === "admin" && (
                  <th className="px-6 py-3">Status</th>
                )}
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pharmacies.map((pharmacy, index) => (
                <tr key={pharmacy._id} className="border-t text-sm">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">
                    {pharmacy.logo?.length > 10 ? (
                      <img
                        src={pharmacy.logo}
                        alt="Logo"
                        width={40}
                        height={40}
                      />
                    ) : (
                      "No Logo"
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-blue-800">
                    {pharmacy.name}
                  </td>
                  {user?.role === "admin" && (
                    <td className="px-6 py-4">
                      <Switch
                        checked={pharmacy.createdBy?.status === "active"}
                        onCheckedChange={() =>
                          handleToggleStatus(pharmacy.createdBy?._id)
                        }
                        className="cursor-pointer data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPharmacy(pharmacy)}
                    >
                      View
                    </Button>
                    {user?.role === "admin" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            className="cursor-pointer"
                            type="button"
                            variant={"destructive"}
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your pharmacy and remove your
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(pharmacy._id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Dialog>
    </div>
  );
};

export default Pharmacy;

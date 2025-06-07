import { Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "sonner";

// components
import Pharmacy from "./components/pharmacy/pharmacy";
import MedicationList from "./components/pharmacy/medications";
import SelectedMedication from "./components/pharmacy/selected-medication";
import Dashboard from "./components/pharmacy/dashboard";
import Header from "./components/header";
import Profile from "./components/profile";
import Settings from "./components/settings";
import Notifications from "./components/notification";
import CustomerList from "./components/customer/customer-view";
import SearchCustomer from "./components/pharmacy/search";
import CreateCustomer from "./components/customer/create-customer";
import CreatePharmacy from "./components/pharmacy/create-pharmacy";
import Homepage from "./components/home/homepage";
import Logout from "./components/auth/logout";
import { useAuth } from "./components/provider/auth-provider";
import NoPage from "./components/no-page";
import EditPharmacy from "./components/pharmacy/edit-pharmacy";
import SearchPage from "./components/home/searchpage";
import CreatePharmacyPage from "./components/home/createpharmacypage";
import Pharmacies from "./components/home/pharmacies";
import ProfilePage from "./components/home/profilepage";
import EditPharmacyPage from "./components/home/editpharmacypage";
import VerifyEmail from "./components/auth/verify";
import ResetPassword from "./components/auth/reset";
import UserTable from "./components/pharmacy/user-table";
import LoginPage from "./components/home/loginpage";
import RegisterPage from "./components/home/registerpage";
import MedicationPage from "./components/home/medicationpage";

{
  /* <PharmacyForm /> */
}
function App() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/create-pharmacy" element={<CreatePharmacyPage />} />
        <Route path="/logout" element={<Logout />} />
        {isAuthenticated && (
          <>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/pharmacies" element={<Pharmacies />} />
            <Route path="/edit" element={<EditPharmacyPage />} />
            <Route path="/medication" element={<MedicationPage />} />
          </>
        )}
        {isAuthenticated && user?.role === "admin" && (
          <Route path="/dashboard" element={<Header />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/list-pharmacy" element={<Pharmacy />} />
            <Route
              path="/dashboard/create-pharmacy"
              element={<CreatePharmacy isLogin={true} />}
            />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route
              path="/dashboard/notifications"
              element={<Notifications />}
            />
            <Route path="/dashboard/customer" element={<CreateCustomer />} />
            <Route path="/dashboard/customer-list" element={<CustomerList />} />
            <Route path="/dashboard/edit" element={<EditPharmacy />} />
            <Route path="/dashboard/search" element={<SearchCustomer />} />
            <Route
              path="/dashboard/:customerId/medication-list"
              element={<MedicationList />}
            />
            <Route
              path="/dashboard/:customerId/select-medication"
              element={<SelectedMedication />}
            />
            <Route path="/dashboard/users" element={<UserTable />} />
          </Route>
        )}
        <Route path="/*" element={<NoPage />} />
      </Routes>
      <Toaster
        position="top-center"
        richColors
        expand={true}
        visibleToasts={1}
      />
    </>
  );
}

export default App;

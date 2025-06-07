import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import CatererDashboard from "./components/Caterer-Dashboard";
import CatererProfile from "./components/caterer-profile";

import Staff from "./components/Staff";
import LoginForm from "./components/LoginPage";
import MenuCategories from "./components/MenuCategories";
import CategoryItems from "./components/CategoryItems";
import Header from "./components/partials/header";
import CustomerService from "./components/customer-service";
import CreateMeals from "./components/create-meal";
import CatererList from "./components/CatererList";
import SelectCategories from "./components/SelectCategories";
import SelectItems from "./components/SelectItems";
import MealPreview from "./components/Meal-Preview";
import RegisterForm from "./components/Register";
import OperatorDashboard from "./components/operatordashboard";
import CustomerDashboard from "./components/Customer-Dashboard";
import { Toaster } from "./components/ui/sonner";
import QuotationDetails from "./components/QuotationDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/profile" element={<CatererProfile />} />
        <Route path="/:id" element={<Header />}>
          <Route path="/:id/dashboard" element={<CatererDashboard />} />
          <Route path="/:id/profile" element={<CatererList />} />
          <Route path="/:id/customer" element={<CustomerDashboard />} />

          <Route path="/:id/staff" element={<Staff />} />
          <Route path="/:id/menu" element={<MenuCategories />} />
          <Route path="/:id/operator" element={<OperatorDashboard />} />
          <Route path="/:id/event" element={<CustomerService />} />

          <Route
            path="/:id/categoryItems/:categoryId"
            element={<CategoryItems />}
          />
        </Route>
        <Route path="/:id/:eventId/create-meal" element={<CreateMeals />} />
        <Route
          path="/:id/:eventId/:mealId/select-categories"
          element={<SelectCategories />}
        />
        <Route
          path="/:id/:eventId/:mealId/select-itms/:categoryId"
          element={<SelectItems />}
        />
        <Route path="/:id/:eventId/meal-preview" element={<MealPreview />} />
        <Route
          path="/:id/:quotationId/quotation-details"
          element={<QuotationDetails />}
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
    // </div>
  );
}

export default App;

//okkk

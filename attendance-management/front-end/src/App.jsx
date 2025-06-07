import "./App.css";
import { Route, Routes } from "react-router";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "./providers/AuthProvider";
import Settings from "./components/Settings";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Attendance from "./components/Attendance";
import CreateCompany from "./components/CreateCompany";
import CreateBranch from "./components/CreateBranch";
import Header from "./components/Header";
import NoPage from "./components/NoPage";
import HomePage from "./components/HomePage";
import ShowCompany from "./components/ShowCompany";
import CreateStaff from "./components/CreateStaff";
import SelectCompany from "./components/SelectCompany";
import ProfilePage from "./components/ProfilePage";
import PersonalDetails from "./components/PersonalDetails";
import BankDetails from "./components/BankDetails";
import Dashboard from "./components/Dashboard";
import CurrentEmp from "./components/CurrentEmp";
import AttendanceDetails from "./components/AttendanceDetails";
import WorkTime from "./components/WorkTime";
import AttendanceModes from "./components/AttendanceModes";
import AutomationRules from "./components/AutomationRules";
import CalendarPage from "./components/AttendancePage";
import EditAttendance from "./components/EditAttendance";
import Leaves from "./components/Leaves";
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import LeavesPage from "./components/Leavespage";
import ApprovePage from "./components/Approvepage";
import LeaveDetails from "./components/LeaveDetails";
import HolidayList from "./components/HolidayList";
import NotesPage from "./components/NotesPage";
import MessagesSystem from "./components/partials/MessageSystem";
import ExportUsersCSVButton from "./components/partials/ExportUsersCSVButton";

function App() {
  const { loading, isAuthenticated, user } = useAuth();
  if (loading) {
    return (
      <div className="app w-full h-[90vh] flex justify-center items-center lead">
        <FaSpinner size="2rem" className="animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route
            path="/"
            element={
              <HomePage
                btn={isAuthenticated ? "GET IN" : "GET STARTED"}
                btnRef={isAuthenticated ? "/settings" : "/login"}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/password" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          {isAuthenticated && (
            <>
              <Route path="/settings" element={<Settings />} />
              <Route path="/select" element={<SelectCompany />} />
              <Route path="/branch" element={<CreateBranch />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/leavereq" element={<Leaves />} />
              <Route path="/leaveapr" element={<ApprovePage />} />
              <Route path="/holidaylist" element={<HolidayList />} />
              <Route
                path="/attendancedetails"
                element={<AttendanceDetails />}
              />
              <Route path="/worktimings" element={<WorkTime />} />
              <Route path="/attendancemode" element={<AttendanceModes />} />
              <Route path="/automationrules" element={<AutomationRules />} />
              <Route path="/attendancepage" element={<CalendarPage />} />
              <Route path="/editattendance" element={<EditAttendance />} />
              <Route path="/create" element={<CreateCompany />} />
              <Route path="/showdetails" element={<ShowCompany />} />
              <Route path="/staff" element={<CreateStaff />} />
              <Route path="/selectcompany" element={<SelectCompany />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profilepage" element={<ProfilePage />} />
              <Route path="/personaldetails" element={<PersonalDetails />} />
              <Route path="/currentemp" element={<CurrentEmp />} />
              <Route path="/bankdetails" element={<BankDetails />} />
              <Route path="/leavesform" element={<LeavesPage />} />
              <Route path="/leavedetails" element={<LeaveDetails />} />
              <Route path="/notespage" element={<NotesPage />} />
              <Route path="/message" element={<MessagesSystem />} />
              <Route path="/button" element={<ExportUsersCSVButton />} />
              

            </>
          )}

          <Route path="/*" element={<NoPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

import './App.css';
import React from 'react';
import { Provider } from 'react-redux';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import BillList from './components/BillList';
import BillForm from './components/BillForm';
import AdminDashboard from './components/AdminDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import WorkerDashboard from './components/WorkerDashboard';
import UserLayout from './layout/userLayout/UserLayout';
import LayoutAdmin from './layout/adminLayout/LayoutAdmin';
import UserAuthGuard from './guards/UserAuthGuard';
import store from './redux/store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from 'flowbite-react';


function App() {
  const customTheme = createTheme({
    navbar: {
     
    },
    button: {
      color: {
        primary: "bg-[#44b8ff] hover:bg-[#1f90bc] text-white ",
      },
    },
    sidebar: {
      item: {
        base: "h-full flex items-center justify-center rounded-md p-2 hover:bg-[#2098e3] hover:text-black-900 hover:text-white",
      },
    },
    collapse: {
      base: "w-full md:block md:w-auto text-right md:text-left",
      list: "mt-4 flex flex-col items-end md:items-center md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium",
      hidden: {
        on: "hidden",
        off: ""
      }
    }
  });
  return (
    <>
    <ThemeProvider theme={customTheme}> 
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<UserLayout />}>

              <Route index element={<Dashboard />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route path="bills" element={<BillList />} />
              <Route path="create-bill" element={<BillForm />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <UserAuthGuard>
                  <LayoutAdmin />
                </UserAuthGuard>
              }>
              <Route path="dashboard" element={<AdminDashboard />} />
              {/* Add more admin routes here */}
            </Route>

            {/* Buyer Routes */}
            <Route
              path="/buyer"
              element={
                <UserAuthGuard>
                  <UserLayout />
                </UserAuthGuard>
              }>
              <Route path="dashboard" element={<BuyerDashboard />} />
              {/* Add more buyer routes here */}
            </Route>

            {/* Worker Routes */}
            <Route
              path="/worker"
              element={
                <UserAuthGuard>
                  <UserLayout />
                </UserAuthGuard>
              }>
              <Route path="dashboard" element={<WorkerDashboard />} />
              {/* Add more worker routes here */}
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </>
  );
}

export default App;

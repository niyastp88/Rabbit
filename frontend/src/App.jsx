import React,{Suspense,lazy} from "react";
import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
const UserLayout =lazy(()=> import("./components/Layout/UserLayout"))
const Home=lazy(()=>import("./pages/Home"))
const Login= lazy(()=>import("./pages/Login"))
const Register=lazy(()=>import("./pages/Register"))
const Profile = lazy(()=>import("./pages/Profile"))
const CollectionPage = lazy(()=>import("./pages/CollectionPage"))
const ProductDetails = lazy(()=>import("./components/Products/ProductDetails"))
const Checkout = lazy(()=>import("./components/Cart/Checkout"))
const OrderConfirmationPage = lazy(()=>import("./pages/OrderConfirmationPage"))
const OrderDetailsPage = lazy(()=>import("./pages/OrderDetailsPage"))
const MyOrdersPage = lazy(()=>import("./pages/MyOrdersPage"))
const AdminLayout = lazy(()=>import("./components/Admin/AdminLayout"))
const AdminHomePage = lazy(()=>import("./pages/AdminHomePage"))
const UserManagement = lazy(()=>import("./components/Admin/UserManagement"))
const ProductManagement = lazy(()=>import("./components/Admin/ProductManagement"))
const EditProductPage = lazy(()=>import("./components/Admin/EditProductPage"))
const OrderManagement = lazy(()=>import("./components/Admin/OrderManagement"))
const ProtectedRoute = lazy(()=>import("./components/Common/ProtectedRoute"))
const AddProductPage = lazy(()=>import("./components/Admin/AddProductPage"))
const CategoryManagement = lazy(()=>import("./components/Admin/categoryManagement"))
const PaymentFailedPage = lazy(()=>import("./pages/PaymentFailedPage"))
const BrandManagement = lazy(()=>import("./components/Admin/brandManagemnt"))
const MaterialManagement = lazy(()=>import("./components/Admin/materialManagement"))
const HomeContentManagement = lazy(()=>import("./components/Admin/HomeContentManagment"))
const ForgotPassword = lazy(()=>import("./pages/forgotPassword"))
const ResetPassword = lazy(()=>import("./pages/ResetPassword"))


const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
          Loading...
        </div>
      }
    >
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route
              path="order-confirmation"
              element={<OrderConfirmationPage />}
            />
            <Route path="/payment-failed" element={<PaymentFailedPage />} />
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />


          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="/admin/products/add" element={<AddProductPage />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/brands" element={<BrandManagement />} />
            <Route path="/admin/materials" element={<MaterialManagement />} />
            <Route
              path="/admin/home-content"
              element={<HomeContentManagement />}
            />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
};

export default App;

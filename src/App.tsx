import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./app/feature/auth/LoginPage";
import ProductsDetails from "./app/Components/admin/product/product/ProductsDetails";
import { PrivateRoute } from "./app/routes/PrivateRoutes";
import ViewProduct from "./app/Components/user/view/ViewProduct";
import ManagementUserPage from "./app/pages/management/ManagementUserPage";
import DetailProduct from "./app/Components/user/view/DetailProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Admin Only */}
        <Route
          path="/product-details"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <ProductsDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/management-users"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <ManagementUserPage />
            </PrivateRoute>
          }
        />

        {/* User Only */}
        <Route
          path="/view-product"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <ViewProduct />
            </PrivateRoute>
          }
        />

        <Route
          path="/view-product/:id"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <DetailProduct />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

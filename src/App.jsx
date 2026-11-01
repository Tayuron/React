import { Routes, Route } from 'react-router-dom';
import { Layout } from './modules/core/layout/Layout';
import { RequireAuth } from './modules/auth/RequireAuth';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductPage } from './pages/ProductPage';
import { ConfiguratorPage } from './pages/ConfiguratorPage';
import { ComponentsPage } from './pages/ComponentsPage';
import { PeripheralsPage } from './pages/PeripheralsPage';
import { CartPage } from './pages/CartPage';
import { RequisitesPage } from './pages/RequisitesPage';
import { CabinetLayout } from './pages/cabinet/CabinetLayout';
import { CabinetPage } from './pages/cabinet/CabinetPage';
import { OrdersPage } from './pages/cabinet/OrdersPage';
import { FavoritesPage } from './pages/cabinet/FavoritesPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PageNotFound } from './pages/PageNotFound';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/:id" element={<ProductPage />} />
        <Route path="configurator" element={<ConfiguratorPage />} />
        <Route path="components" element={<ComponentsPage />} />
        <Route path="peripherals" element={<PeripheralsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="requisites"
          element={
            <RequireAuth>
              <RequisitesPage />
            </RequireAuth>
          }
        />
        <Route
          path="cabinet"
          element={
            <RequireAuth>
              <CabinetLayout />
            </RequireAuth>
          }
        >
          <Route index element={<CabinetPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

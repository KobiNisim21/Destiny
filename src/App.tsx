import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MouseTrail from "./components/MouseTrail";

// ... existing imports

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SessionTimeout />
            <ScrollToTop />
            <MouseTrail />
            <CartDrawer />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/product/:productId" element={<ProductPage />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/orders" element={<UserOrders />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />



                <Route path="/verify" element={<VerifyEmail />} />
                <Route path="/verify-account" element={<VerifyAccount />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />

                {/* Policy Routes */}
                <Route path="/shipping" element={<PolicyPage type="shipping" />} />
                <Route path="/returns" element={<PolicyPage type="returns" />} />
                <Route path="/privacy" element={<PolicyPage type="privacy" />} />
                <Route path="/legal" element={<PolicyPage type="legal" />} />
                <Route path="/terms" element={<PolicyPage type="terms" />} />

                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                    <Route path="marketing" element={<Marketing />} />
                    <Route path="policies" element={<PolicySettings />} />
                    <Route path="users" element={<AdminTeam />} />
                    <Route path="content" element={<ContentSettings />} />

                    {/* Product Routes */}
                    <Route path="products" element={<Products />} />
                    <Route path="products/new" element={<ProductForm />} />
                    <Route path="products/edit/:id" element={<ProductForm />} />
                  </Route>
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

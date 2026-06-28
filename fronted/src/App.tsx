import React, { useState, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from './store/authStore';
import { Toaster } from 'sonner';
import { Header } from "@/components/Header";

const Home = React.lazy(() => import("@/pages/Home"));
const PhotoDetail = React.lazy(() => import("@/pages/PhotoDetail"));
const Login = React.lazy(() => import("@/pages/Login"));
const Register = React.lazy(() => import("@/pages/Register"));
const Profile = React.lazy(() => import("@/pages/Profile"));
const ProfileSettings = React.lazy(() => import("@/pages/ProfileSettings"));
const Community = React.lazy(() => import("@/pages/Community"));
const Resources = React.lazy(() => import("@/pages/Resources"));
const ProjectDetail = React.lazy(() => import("@/pages/ProjectDetail"));
const SearchResult = React.lazy(() => import("@/pages/SearchResult"));
const EquipmentHub = React.lazy(() => import("@/pages/EquipmentHub"));
const OnlineCourses = React.lazy(() => import("@/pages/OnlineCourses"));
const CourseDetail = React.lazy(() => import("@/pages/CourseDetail"));
const TutorialDetail = React.lazy(() => import("@/pages/TutorialDetail"));
const TutorialResources = React.lazy(() => import("@/pages/TutorialResources"));
const OfflineEvents = React.lazy(() => import("@/pages/OfflineEvents"));
const PhotographyContests = React.lazy(() => import("@/pages/PhotographyContests"));
const PhotoComments = React.lazy(() => import("@/pages/PhotoComments"));
const EventDetail = React.lazy(() => import("@/pages/EventDetail"));
const ContestDetail = React.lazy(() => import("@/pages/ContestDetail"));
const EventsAndContests = React.lazy(() => import("@/pages/EventsAndContests"));
const PostDetail = React.lazy(() => import("@/pages/PostDetail"));
const AIChat = React.lazy(() => import("@/pages/AIChat"));
const GroupsList = React.lazy(() => import("@/pages/GroupsList"));
const GroupDetail = React.lazy(() => import("@/pages/GroupDetail"));
const Footer = React.lazy(() => import("@/components/Footer.tsx"));
const Layout = React.lazy(() => import("@/components/admin/Layout"));
const Dashboard = React.lazy(() => import("@/pages/admin/Dashboard"));
const UserManagement = React.lazy(() => import("@/pages/admin/UserManagement"));
const ContentManagement = React.lazy(() => import("@/pages/admin/ContentManagement"));
const GroupManagement = React.lazy(() => import("@/pages/admin/GroupManagement"));
const OrderManagement = React.lazy(() => import("@/pages/admin/OrderManagement"));
const Analytics = React.lazy(() => import("@/pages/admin/Analytics"));
const Settings = React.lazy(() => import("@/pages/admin/Settings"));

const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdminAuthenticated, adminUser } = useAuthStore();
  
  if (!isAdminAuthenticated) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }
  
  if (!adminUser) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  const { theme } = useAuthStore();
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(true);
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    const noFooterRoutes = ['/login', '/register'];
    setShowFooter(!noFooterRoutes.includes(location.pathname));
  }, [location]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="container mx-auto px-4 py-8 h-80 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#4A5F8B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/runtime/" element={<Navigate to="/" replace />} />
            <Route path="/runtime/login" element={<Navigate to="/login" replace />} />
            <Route path="/runtime/register" element={<Navigate to="/register" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/settings" element={<ProfileSettings />} />
            
            <Route path="/profile-center" element={<Navigate to="/profile" replace />} />
            <Route path="/profile-center/batch-manage" element={<Navigate to="/profile" replace />} />
            <Route path="/profile-center/photo-locations" element={<Navigate to="/profile" replace />} />
            <Route path="/profile-center/materials" element={<Navigate to="/profile/settings" replace />} />
            <Route path="/profile-center/membership" element={<Navigate to="/profile/settings" replace />} />
            <Route path="/profile-center/settings" element={<Navigate to="/profile/settings" replace />} />
            <Route path="/profile-center/notifications" element={<Navigate to="/profile/settings" replace />} />
            <Route path="/profile-center/events" element={<Navigate to="/profile/settings" replace />} />
            <Route path="/profile-center/orders" element={<Navigate to="/profile/settings" replace />} />
            <Route path="/profile-center/editor" element={<Navigate to="/profile" replace />} />
            <Route path="/profile-center/contests" element={<Navigate to="/profile" replace />} />
            <Route path="/profile-center/equipment" element={<Navigate to="/profile" replace />} />
            
            <Route path="/community" element={<Community />} />
            <Route path="/groups" element={<GroupsList />} />
            <Route path="/group/:id" element={<GroupDetail />} />
            <Route path="/post/:id" element={<PostDetail />} />
            
            <Route path="/resources" element={<Resources />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            
            <Route path="/equipment" element={<EquipmentHub />} />
            <Route path="/equipment/database" element={<EquipmentHub />} />
            <Route path="/equipment/review" element={<EquipmentHub />} />
            <Route path="/equipment/trade" element={<EquipmentHub />} />
            <Route path="/equipment/library" element={<EquipmentHub />} />
            {/* 旧路由重定向 */}
            <Route path="/equipment-database" element={<Navigate to="/equipment" replace />} />
            <Route path="/equipment-review" element={<Navigate to="/equipment" replace />} />
            <Route path="/equipment-trade" element={<Navigate to="/equipment" replace />} />
            
            <Route path="/online-courses" element={<OnlineCourses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/tutorial/:id" element={<TutorialDetail />} />
            <Route path="/tutorial-resources" element={<TutorialResources />} />
            
            <Route path="/offline-events" element={<OfflineEvents />} />
            <Route path="/events-and-contests" element={<EventsAndContests />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/photography-contests" element={<PhotographyContests />} />
            <Route path="/contest/:id" element={<ContestDetail />} />
            
            <Route path="/ai-chat" element={<AIChat />} />
            
            <Route path="/search" element={<SearchResult />} />
            
            <Route path="/photo/:id" element={<PhotoDetail />} />
            <Route path="/photo-comments/:id" element={<PhotoComments />} />
            
            <Route path="/admin" element={
              <AdminAuthGuard>
                <Layout>
                  <Dashboard />
                </Layout>
              </AdminAuthGuard>
            } />
            <Route path="/admin/users" element={
              <AdminAuthGuard>
                <Layout>
                  <UserManagement />
                </Layout>
              </AdminAuthGuard>
            } />
            <Route path="/admin/users/pending" element={
              <AdminAuthGuard>
                <Layout>
                  <UserManagement />
                </Layout>
              </AdminAuthGuard>
            } />
            <Route path="/admin/users/banned" element={
              <AdminAuthGuard>
                <Layout>
                  <UserManagement />
                </Layout>
              </AdminAuthGuard>
            } />
            <Route path="/admin/content" element={
              <AdminAuthGuard>
                <Layout>
                  <ContentManagement />
                </Layout>
              </AdminAuthGuard>
            } />
            <Route path="/admin/content/photos" element={
              <AdminAuthGuard>
                <Layout>
                  <ContentManagement />
                </Layout>
              </AdminAuthGuard>
            } />
            <Route path="/admin/content/posts" element={
              <AdminAuthGuard>
                <Layout>
                  <ContentManagement />
                </Layout>
              </AdminAuthGuard>
            } />
            <Route path="/admin/content/comments" element={
              <AdminAuthGuard>
                <Layout>
                  <ContentManagement />
                </Layout>
              </AdminAuthGuard>
            } />
            <Route path="/admin/groups" element={
              <AdminAuthGuard>
                <Layout>
                  <GroupManagement />
                </Layout>
              </AdminAuthGuard>
            } />
            <Route path="/admin/orders" element={
              <AdminAuthGuard>
                <Layout>
                  <OrderManagement />
                </Layout>
              </AdminAuthGuard>
            } />
            <Route path="/admin/analytics" element={
              <AdminAuthGuard>
                <Layout>
                  <Analytics />
                </Layout>
              </AdminAuthGuard>
            } />
            <Route path="/admin/settings" element={
              <AdminAuthGuard>
                <Layout>
                  <Settings />
                </Layout>
              </AdminAuthGuard>
            } />
            
            <Route path="*" element={<div className="text-center text-xl py-10">页面未找到</div>} />
          </Routes>
        </Suspense>
      </main>
      {showFooter && (
        <Suspense fallback={
          <div className={`w-full py-10 mt-12 ${theme === 'dark' ? 'bg-[#1E2532]' : 'bg-gray-100'}`}>
            <div className="container mx-auto px-4 text-center text-[#B8C6D8]">
              <div className="w-16 h-16 border-4 border-[#4A5F8B] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4">加载页脚中...</p>
            </div>
          </div>
        }>
          <Footer />
        </Suspense>
      )}
      <Toaster />
    </div>
  );
}
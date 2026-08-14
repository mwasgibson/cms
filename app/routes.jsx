import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '../utils/constants'

import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import RequireAuth from '../features/auth/components/RequireAuth'

import Login from '../features/auth/pages/Login'
import Dashboard from '../features/dashboard/pages/Dashboard'
import Rooms from '../features/rooms/pages/Rooms'
import AddRoom from '../features/rooms/pages/AddRoom'
import EditRoom from '../features/rooms/pages/EditRoom'
import Deals from '../features/deals/pages/Deals'
import AddDeal from '../features/deals/pages/AddDeal'
import EditDeal from '../features/deals/pages/EditDeal'
import Documents from '../features/documents/pages/Document'
import Posts from '../features/blog/pages/Posts'
import AddPost from '../features/blog/pages/AddPost'
import EditPost from '../features/blog/pages/EditPost'
import Content from '../features/content/pages/Content'
import Settings from '../features/settings/pages/Settings'
import AuditLogs from '../features/logs/pages/AuditLogs'
import Trash from '../features/trash/pages/Trash'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
      </Route>

      <Route
        path="/admin"
        element={<RequireAuth><AdminLayout /></RequireAuth>}
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"              element={<Dashboard />} />
        <Route path="rooms"                  element={<Rooms />} />
        <Route path="rooms/new"              element={<AddRoom />} />
        <Route path="rooms/:roomNumber/edit" element={<EditRoom />} />
        <Route path="deals"                  element={<Deals />} />
        <Route path="deals/new"              element={<AddDeal />} />
        <Route path="deals/:id/edit"         element={<EditDeal />} />
        <Route path="documents"              element={<Documents />} />
        <Route path="blog"                   element={<Posts />} />
        <Route path="blog/new"               element={<AddPost />} />
        <Route path="blog/:id/edit"          element={<EditPost />} />
        <Route path="content"                element={<Content />} />
        <Route path="settings"               element={<Settings />} />
        <Route path="logs"                   element={<AuditLogs />} />
        <Route path="trash"                  element={<Trash />} />
      </Route>

      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
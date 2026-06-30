import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '../utils/constants'

import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import RequireAuth from '../features/auth/components/RequireAuth'

import Login from '../features/auth/pages/Login'
import Dashboard from '../features/dashboard/pages/Dashboard'
import Units from '../features/units/pages/Units'
import AddUnit from '../features/units/pages/AddUnit'
import EditUnit from '../features/units/pages/EditUnit'
import UnitDetails from '../features/units/pages/UnitDetails'
import Projects from '../features/projects/pages/Projects'
import AddProject from '../features/projects/pages/AddProject'
import EditProject from '../features/projects/pages/EditProject'
import ProjectDetails from '../features/projects/pages/ProjectDetails'
import Leads from '../features/leads/pages/Leads'
import LeadDetails from '../features/leads/pages/LeadDetails'
import Documents from '../features/documents/pages/Documents'
import Testimonials from '../features/testimonials/pages/Testimonials'
import Posts from '../features/blog/pages/Posts'
import AddPost from '../features/blog/pages/AddPost'
import EditPost from '../features/blog/pages/EditPost'
import Content from '../features/content/pages/Content'
import Settings from '../features/settings/pages/Settings'
import AuditLogs from '../features/audit/pages/AuditLogs'
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
        <Route path="dashboard"                    element={<Dashboard />} />
        <Route path="units"                         element={<Units />} />
        <Route path="units/new"                     element={<AddUnit />} />
        <Route path="units/:id"                     element={<UnitDetails />} />
        <Route path="units/:id/edit"                element={<EditUnit />} />
        <Route path="projects"                      element={<Projects />} />
        <Route path="projects/new"                  element={<AddProject />} />
        <Route path="projects/:id"                  element={<ProjectDetails />} />
        <Route path="projects/:id/edit"             element={<EditProject />} />
        <Route path="leads"                         element={<Leads />} />
        <Route path="leads/:id"                     element={<LeadDetails />} />
        <Route path="documents"                     element={<Documents />} />
        <Route path="testimonials"                  element={<Testimonials />} />
        <Route path="blog"                          element={<Posts />} />
        <Route path="blog/new"                      element={<AddPost />} />
        <Route path="blog/:id/edit"                 element={<EditPost />} />
        <Route path="content"                       element={<Content />} />
        <Route path="settings"                      element={<Settings />} />
        <Route path="audit-logs"                    element={<AuditLogs />} />
        <Route path="trash"                         element={<Trash />} />
      </Route>

      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

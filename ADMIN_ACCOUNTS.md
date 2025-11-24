# 🔐 Admin Test Accounts - Role-Based System

## Role-Based Admin System

This system now supports **three levels of admin access** with varying permissions:

### 🛡️ Admin Roles

#### Super Admin 👑
- **Full system control**
- Can manage other admins (create, update, delete)
- Access to all features
- Badge: Blue "Super Admin" badge in dashboard

#### Moderator 🎯
- Can manage all complaints
- Can respond to students
- Access to analytics and reports
- Badge: Grey "Moderator" badge in dashboard

#### Admin 📋
- Basic complaint management
- Can respond to students
- Limited access to system features
- Badge: Grey "Admin" badge in dashboard

---

## Current Active Admin Account

### Super Admin (Primary)
- **Email**: `mike.wilson@brototype.com`
- **Password**: `student123`
- **Role**: Super Admin
- **Status**: ✅ ACTIVE & READY

**⚠️ Important**: All previous admin accounts have been removed. This is now the only active admin account in the system.

---

## 🚀 How to Create Additional Admins

### Method 1: Manual Database Entry (Current)

After a user creates an account, run this SQL in your database:

```sql
-- Create a Super Admin
INSERT INTO public.admin_roles (user_id, role)
VALUES ('user-uuid-here', 'super_admin');

-- Create a Moderator
INSERT INTO public.admin_roles (user_id, role)
VALUES ('user-uuid-here', 'moderator');

-- Create a regular Admin
INSERT INTO public.admin_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');
```

### Method 2: Via Application (Coming Soon)

A user management interface for super admins will be added in future updates where you can:
- Promote users to admin roles
- Change admin role levels
- Revoke admin access

---

## 🔒 Role Permissions Matrix

| Feature | Super Admin | Moderator | Admin |
|---------|------------|-----------|-------|
| View All Complaints | ✅ | ✅ | ✅ |
| Update Complaint Status | ✅ | ✅ | ✅ |
| Reply to Students | ✅ | ✅ | ✅ |
| Analytics Dashboard | ✅ | ✅ | ✅ |
| Export Reports | ✅ | ✅ | ✅ |
| Bulk Import | ✅ | ✅ | ✅ |
| Manage Admin Roles | ✅ | ❌ | ❌ |
| System Configuration | ✅ | ❌ | ❌ |

---

## 🎯 Features Available to All Admin Levels

### 1. Complaint Management
- View all student complaints in one dashboard
- Update complaint status (Pending, In Progress, Resolved)
- Real-time updates when complaints change
- Reply to student complaints via conversation threads

### 2. Analytics Dashboard
- View complaint statistics and trends
- Track resolution rates
- Monitor response times
- Visual charts and graphs

### 3. Bulk Import (via Quick Actions)
- Mass create complaints for testing
- Import from JSON format
- Automatically assigns to existing students

### 4. Export Reports
- Download complaint data as CSV
- Filter complaints before export
- Includes student information

### 5. Search & Filter
- Search by title, description, or student name
- Filter by status (All, Pending, In Progress, Resolved)
- Real-time filtering

---

## 📊 Bulk Import Feature

**Access**: Click "Bulk Import" button in the admin dashboard header

**Sample JSON Format**:
```json
[
  {
    "title": "Issue Title",
    "description": "Detailed description of the problem",
    "status": "Pending"
  },
  {
    "title": "Another Issue",
    "description": "Another problem description",
    "status": "In Progress"
  }
]
```

**Pre-loaded Test Data**: The bulk import page comes with 5 sample complaints ready to import.

---

## 🔄 Testing Workflow

### 1. Login as Super Admin
- Go to `/admin-auth`
- Use: `mike.wilson@brototype.com` / `student123`
- You'll be redirected to the admin dashboard
- Notice the "Super Admin" badge next to the dashboard title

### 2. Explore Dashboard Features
- View the quick action buttons at the top
- Check the complaint statistics cards
- Search and filter complaints
- Update complaint statuses

### 3. Test Navigation
- Use "Back to Home" button on auth page to return to landing page
- Use "Home" button in dashboard header
- Navigate between Bulk Import and Analytics pages

### 4. Test Complaint Management
- Click on any complaint to view details
- Update status and add responses
- View conversation threads with students

### 5. Test Bulk Import
- Click "Bulk Import" in the header
- Use pre-loaded sample data or paste custom JSON
- Import complaints and see them appear in dashboard

### 6. Test Analytics
- Click "View Analytics" in the header
- View charts and statistics
- Check resolution rates and response times

---

## 🔐 Security Implementation

- **Server-Side Validation**: All admin checks happen on the server
- **RLS Policies**: Row-level security enforces access control
- **Separate Role Table**: Admin roles stored in dedicated `admin_roles` table
- **Security Definer Functions**: Prevent privilege escalation
- **Role-Based Access**: Different permission levels for different admin types

---

## 🎓 Student Test Accounts

For complete testing, use these student accounts:

**Student 1 - John Doe**:
- Email: `john.doe@brototype.com`
- Password: `student123`
- Purpose: Primary student for testing

**Student 2 - Jane Smith**:
- Email: `jane.smith@brototype.com`
- Password: `student123`
- Purpose: Secondary student for multi-user testing

**Note**: `mike.wilson@brototype.com` also has a student profile but is primarily used as the super admin account.

---

## 📝 Important Notes

- **Single Active Admin**: Currently only one super admin account exists
- **Equal Visibility**: All admin levels can see all complaints
- **Role Badge**: Your role is displayed in the dashboard header
- **Home Navigation**: Both portals have "Back to Home" buttons
- **Separate Portals**: Admin portal (`/admin-auth`) and Student portal (`/auth`) are separate
- **Auto-Assignment**: Bulk import randomly assigns complaints to existing students

---

## 🐛 Troubleshooting

**Can't login to admin portal?**
- Make sure you're using: `mike.wilson@brototype.com` / `student123`
- Check you're on `/admin-auth` not `/auth`
- Clear browser cache and try again

**Don't see admin badge?**
- Refresh the page after login
- Check you're logged in as the correct user
- Verify your role in the database

**Complaints not loading?**
- Check browser console for errors
- Verify database connection
- Make sure RLS policies are properly set

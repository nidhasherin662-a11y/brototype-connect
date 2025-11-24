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

## How to Create a New Admin Account

### Step 1: Create User Account
1. Go to `/admin-auth` page
2. Click "Student Login" at the bottom
3. Sign up with your desired email and password
4. Complete the signup process

### Step 2: Assign Admin Role
After creating the account, run this SQL in your database to assign the admin role:

```sql
-- Get the user ID first
SELECT id, email, name FROM profiles WHERE email = 'your-email@brototype.com';

-- Assign Super Admin role (replace 'user-uuid-here' with actual UUID)
INSERT INTO public.admin_roles (user_id, role)
VALUES ('user-uuid-here', 'super_admin');

-- OR assign Moderator role
INSERT INTO public.admin_roles (user_id, role)
VALUES ('user-uuid-here', 'moderator');

-- OR assign Admin role
INSERT INTO public.admin_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');
```

### Step 3: Login to Admin Portal
1. Go to `/admin-auth`
2. Login with your credentials
3. You'll be redirected to the admin dashboard

---

## Recommended Test Admin Credentials

Create a new account with these credentials:

- **Email**: `admin@brototype.com`
- **Password**: `Admin@2024!`
- **Role**: Super Admin

**Note**: You must first sign up through the app, then assign the role using the SQL above.

---


## 📧 Email Notifications

The system now sends automated email notifications using Resend:

### Admin Notifications
- **New Complaint**: All admins receive an email when a student submits a new complaint
- Includes: Student name, complaint title, description, and complaint ID

### Student Notifications
- **Status Change**: Students receive an email when their complaint status is updated
- **New Response**: Students receive an email when an admin replies to their complaint
- Includes: Complaint details and the relevant update

**Setup Required**: 
1. Add your RESEND_API_KEY in the secrets
2. Verify your sending domain at https://resend.com/domains

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
- Automated email notifications

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

### 1. Create and Login as Admin
- Sign up at `/auth` with recommended credentials (`admin@brototype.com` / `Admin@2024!`)
- Assign super_admin role via SQL (instructions above)
- Login at `/admin-auth`
- Notice the "Super Admin" badge next to the dashboard title

### 2. Explore Dashboard Features
- View the quick action buttons at the top
- Check the complaint statistics cards
- Search and filter complaints
- Update complaint statuses

### 3. Test Email Notifications
- Submit a test complaint as a student
- Check admin email for new complaint notification
- Update complaint status and verify student receives email
- Reply to complaint and verify student receives response email

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

- **No Default Admin**: You must create and assign admin roles manually
- **Email Setup**: Configure Resend API key and verify domain for notifications
- **Equal Visibility**: All admin levels can see all complaints
- **Role Badge**: Your role is displayed in the dashboard header
- **Home Navigation**: Both portals have "Back to Home" buttons
- **Separate Portals**: Admin portal (`/admin-auth`) and Student portal (`/auth`) are separate
- **Auto-Assignment**: Bulk import randomly assigns complaints to existing students

---

## 🐛 Troubleshooting

**Can't login to admin portal?**
- Make sure you've created an account first via signup
- Check that admin role was assigned via SQL
- Verify you're on `/admin-auth` not `/auth`
- Clear browser cache and try again

**Don't see admin badge?**
- Refresh the page after login
- Check you're logged in as the correct user
- Verify your role in the database

**Complaints not loading?**
- Check browser console for errors
- Verify database connection
- Make sure RLS policies are properly set

**Email notifications not working?**
- Verify RESEND_API_KEY is set
- Check that your domain is verified at https://resend.com/domains
- Check edge function logs for errors
- Make sure the "from" email domain is verified

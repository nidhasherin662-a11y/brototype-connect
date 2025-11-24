# 🔐 Admin Test Accounts

## Multiple Admin Accounts for Testing

### Admin 1 (Primary)
- **Email**: `admin@brototype.com`
- **Password**: `admin123`
- **Status**: ✅ ACTIVE & READY
- **Purpose**: Main admin account for full system testing

### Admin 2 (Secondary)
- **Email**: `staff@brototype.com`
- **Password**: `staff123`
- **Purpose**: Secondary admin for testing multiple admin workflows

### Admin 3 (Manager)
- **Email**: `manager@brototype.com`
- **Password**: `manager123`
- **Purpose**: Manager-level admin testing

### Admin 4 (Supervisor)
- **Email**: `supervisor@brototype.com`
- **Password**: `supervisor123`
- **Purpose**: Supervisor access testing

---

## 🚀 How to Create Additional Admins

**Method 1: Via Admin Auth Page**
1. Go to `/admin-auth`
2. Click "Sign Up" (if available) or use the form
3. Sign up with any of the emails above
4. System automatically grants admin privileges

**Method 2: Manual Database Entry**
After creating a regular account, run this SQL in your database:
```sql
INSERT INTO public.admin_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'your-email@brototype.com';
```

---

## ✅ Fixed: Login Issue

**What was the problem?**
When you signed up with `admin@brototype.com`, your account was created but the admin role wasn't automatically added to the `admin_roles` table. This caused the system to deny admin access.

**Solution Applied:**
✅ Fixed your existing account - you can now login!
✅ Your user ID has been added to the admin_roles table
✅ You should now have full admin access

---

## 🎯 Features Available to Admins

✅ View all student complaints
✅ Update complaint status
✅ Reply to students via conversation threads
✅ Analytics dashboard with charts
✅ **NEW: Bulk Import Complaints** (`/bulk-import`)
✅ Search and filter all complaints
✅ View student information

---

## 📊 Bulk Import Feature

**Access**: Navigate to `/bulk-import` from the Admin Dashboard

**What it does**:
- Import multiple test complaints at once
- Automatically assigns complaints to existing students
- Supports JSON format
- Perfect for testing with large datasets

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

**Pre-loaded Test Data**:
The bulk import page comes with 5 sample complaints ready to import:
- Broken AC in Classroom
- WiFi Issues in Library
- Broken Chair in Lab
- Projector Problems
- Washroom Maintenance

Just click "Import Complaints" to add them all!

---

## 🔄 Testing Workflow

1. **Login as Admin**: Use `admin@brototype.com` / `admin123`
2. **Import Test Data**: Go to Bulk Import page
3. **View Dashboard**: See all imported complaints
4. **Update Status**: Change complaint statuses
5. **Reply to Students**: Test conversation threads
6. **Check Analytics**: View statistics and charts
7. **Test with Multiple Admins**: Login with different admin accounts

---

## 📝 Notes

- All admin accounts have equal permissions
- Admins can see ALL complaints from ALL students
- Only admins can update complaint statuses
- Bulk import requires at least one student account to exist
- Complaints are randomly distributed among existing students during bulk import

---

## 🎓 Student Test Accounts

For complete testing, use these student accounts:

**Student 1**:
- Email: `john.doe@brototype.com`
- Password: `student123`

**Student 2**:
- Email: `jane.smith@brototype.com`
- Password: `student123`

**Student 3**:
- Email: `mike.wilson@brototype.com`
- Password: `student123`

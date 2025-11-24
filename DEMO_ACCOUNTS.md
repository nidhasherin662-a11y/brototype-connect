# Demo Account Credentials

## 🔐 Test Accounts for Brototype Complaint Portal

### Admin Account
**Purpose**: Staff access to view and manage all complaints

- **Email**: `admin@brototype.com`
- **Password**: `admin123` (create this when signing up)
- **Access**: Full complaint management, analytics dashboard, can respond to all complaints

**How to create**:
1. Go to `/admin-auth`
2. Sign up with the email above
3. System automatically grants admin privileges

---

### Student Account Examples
**Purpose**: Students can submit and track their complaints

#### Student 1
- **Email**: `john.doe@brototype.com`
- **Password**: `student123`
- **Name**: John Doe
- **Department**: Computer Science
- **Roll No**: BT2024001

#### Student 2
- **Email**: `jane.smith@brototype.com`
- **Password**: `student123`
- **Name**: Jane Smith
- **Department**: Web Development
- **Roll No**: BT2024002

#### Student 3
- **Email**: `mike.wilson@brototype.com`
- **Password**: `student123`
- **Name**: Mike Wilson
- **Department**: Data Science
- **Roll No**: BT2024003

**How to create**:
1. Go to `/auth`
2. Click "Sign Up" tab
3. Fill in the details above
4. System creates profile automatically

---

## 📝 How to Test the System

### As a Student:
1. Sign up with one of the student emails above
2. Submit a complaint with title, description, and optional image
3. View your complaints and their status
4. Reply to admin responses in the conversation thread
5. Search and filter your complaints

### As an Admin:
1. Sign up with the admin email
2. View all student complaints in one dashboard
3. See student details (name, date, time, day)
4. Update complaint status (Pending → In Progress → Resolved)
5. Reply to students through conversation threads
6. View analytics dashboard with:
   - Total complaints count
   - Status distribution charts
   - Complaints trend over time
   - Average resolution time
   - Performance metrics

---

## 🎯 Key Features

### Student Portal Features:
✅ Submit complaints with image upload
✅ Only see their own complaints
✅ Search and filter by status
✅ Reply to admin messages
✅ Real-time status updates
✅ Profile settings (update name, department, roll number)
✅ Password reset

### Admin Portal Features:
✅ View ALL student complaints
✅ See student information with each complaint
✅ Update complaint status
✅ Reply to students
✅ Analytics dashboard with charts
✅ Real-time updates
✅ Search and filter complaints
✅ Password reset

---

## 🚀 Quick Start

1. **Create Admin Account First**:
   - Visit: `/admin-auth`
   - Sign up with: `admin@brototype.com`

2. **Create Student Accounts**:
   - Visit: `/auth`
   - Create 2-3 student accounts for testing

3. **Submit Test Complaints**:
   - Login as students
   - Submit various complaints with images

4. **Test Admin Features**:
   - Login as admin
   - View, respond to, and resolve complaints
   - Check analytics dashboard

---

## 💡 Tips

- Students can ONLY see their own complaints
- Admins can see ALL complaints from all students
- Conversation threads allow back-and-forth communication
- Status colors: Yellow (Pending), Orange (In Progress), Green (Resolved)
- Real-time updates mean no page refresh needed!
- All dates show: Date, Day, and Time for clarity

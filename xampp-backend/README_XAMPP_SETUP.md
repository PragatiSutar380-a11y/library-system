# Academic B.Sc. Computer Science Field Project: Library Management System
## Local Machine & XAMPP Setup Guide (Windows / macOS / Linux)

Congratulations on downloading the complete project package! This package contains:
1. **Frontend**: Complete modern React + Tailwind CSS web interface.
2. **PHP + MySQL Backend**: Ready-to-run Apache + PHP REST APIs and SQL dump for **XAMPP / WampServer / InfinityFree**.
3. **Node.js + PostgreSQL Backend**: Ready-to-run Express + Drizzle server.
4. **Pre-built Static Distribution (`dist/`)**: Production-optimized files ready to serve immediately.

---

## METHOD 1: Running with XAMPP (Apache + MySQL + PHP)

### Step 1: Install XAMPP
If not already installed, download and install **XAMPP** from [apachefriends.org](https://www.apachefriends.org/).

### Step 2: Start Apache and MySQL
1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL**.
*(Both modules should turn green).*

### Step 3: Import the Database (`database.sql`)
1. Open your web browser and go to:
   ```text
   http://localhost/phpmyadmin
   ```
2. In phpMyAdmin, click on **Databases** or click **New** on the left sidebar.
3. Database Name: `library_db` -> Click **Create**.
4. With `library_db` selected, click the **Import** tab at the top.
5. Click **Choose File** and select `xampp-backend/database.sql` from this project folder.
6. Scroll to the bottom and click **Import** (or **Go**).
7. *Success! All 7 relational tables (`users`, `employees`, `members`, `book_categories`, `books`, `transactions`, `attendance`) and sample college records are now created.*

### Step 4: Move Project to `htdocs`
1. Navigate to your XAMPP installation directory:
   - On Windows: `C:\xampp\htdocs\`
   - On macOS: `/Applications/XAMPP/xamppfiles/htdocs/`
   - On Linux: `/opt/lampp/htdocs/`
2. Create a folder named: `library-system`
3. Copy the contents of the `dist/` folder (or this entire extracted project) into `C:\xampp\htdocs\library-system\`.
4. Copy `xampp-backend/` into `C:\xampp\htdocs\library-system/api/` (or keep `db_connect.php` in the parent directory).

### Step 5: Run the Project in Browser!
Open your web browser and visit:
```text
http://localhost/library-system/
```
You can now log in using the project accounts:
- **Admin**: Username: `admin` | Password: `admin123`
- **Staff (Employee)**: Select `Suresh Kumar` or `Anita Sharma`
- **Student Member**: Select `Rahul Sharma` or `Priya Patel`

---

## METHOD 2: Running with Node.js (Full-Stack React + Express)

If you prefer running the editable TypeScript & React environment with hot reload:

1. Open your terminal in this project directory:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser at:
   ```text
   http://localhost:3000
   ```

---

## Viva & Project Examination Quick Reference

| Entity / Table | Purpose & Description |
|---|---|
| `users` | Role-based authorization (`admin`, `employee`, `member`). |
| `employees` | Staff cataloging, assistant librarian duties, contact details. |
| `members` | Student & faculty patrons with borrowing allowances (3 books for students, 6 for faculty). |
| `book_categories` | Dewey-style classification (Computer Science, Mathematics, Electronics, etc.). |
| `books` | Physical inventory, ISBN, rack locator, total and available copy counts. |
| `transactions` | Issue and return audit trail, calculation of due dates and overdue fines. |
| `attendance` | Daily staff attendance logging with timestamped check-in and check-out. |

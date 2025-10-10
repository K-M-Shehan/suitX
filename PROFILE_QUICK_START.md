# Quick Start Guide - Profile Page

## What's Been Implemented

✅ **Backend (Java/Spring Boot)**
- UserController with `/api/user/me` endpoints
- UserService with profile update logic  
- Security configured to require JWT authentication
- All changes follow the User schema from SCHEMA_IMPLEMENTATION.md

✅ **Frontend (React)**
- UserService for API calls
- ProfilePage component with loading/error states
- Profile component with edit functionality
- Following the User model fields

## How to Test

### 1. Start Backend
```bash
cd backend
./mvnw spring-boot:run
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Flow
1. **Login** to get JWT token
2. **Navigate to Profile** (click profile icon in header dropdown)
3. **View Profile** - See all your user information
4. **Click "Edit Profile"** - Enable edit mode
5. **Make Changes** - Edit firstName, lastName, email, bio, phone, or department
6. **Click "Save"** - Update profile (see success message)
7. **Or Click "Cancel"** - Discard changes

## API Endpoints

### Get Current User Profile
```http
GET http://localhost:8080/api/user/me
Headers:
  Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "id": "user123",
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Software Developer",
  "phone": "+1234567890",
  "department": "Engineering",
  "avatar": "https://...",
  "role": "MEMBER",
  "isActive": true,
  "ownedProjects": ["proj1", "proj2"],
  "memberProjects": ["proj3"],
  "createdAt": "2025-01-01T00:00:00",
  "updatedAt": "2025-01-10T00:00:00"
}
```

### Update Current User Profile
```http
PUT http://localhost:8080/api/user/me
Headers:
  Authorization: Bearer <your-jwt-token>
  Content-Type: application/json

Body:
{
  "email": "newemail@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "bio": "Updated bio",
  "phone": "+9876543210",
  "department": "Marketing",
  "avatar": "https://new-avatar-url"
}
```

## Editable vs Read-Only Fields

### ✅ Editable:
- email
- firstName
- lastName
- bio
- phone
- department
- avatar

### ❌ Read-Only:
- username (cannot be changed)
- password (not shown, separate endpoint needed)
- role (admin-only)
- ownedProjects (managed through project operations)
- memberProjects (managed through project operations)
- isActive (admin-only)
- createdAt, updatedAt (automatic)

## Error Handling

The system handles various errors gracefully:

- **401 Unauthorized**: No token or invalid token → Shows "Not authenticated"
- **404 Not Found**: User not found → Shows "User not found"
- **400 Bad Request**: Invalid data (duplicate email, invalid format) → Shows specific validation error
- **500 Server Error**: Backend issues → Shows "Failed to update profile"

## Frontend Components Structure

```
ProfilePage (Container)
  ├── Loading State (spinner)
  ├── Error State (with retry button)
  └── Profile Component
      ├── Avatar Section
      ├── Form Fields (all user data)
      ├── Success/Error Messages
      └── Action Buttons (Edit/Save/Cancel)
```

## Common Issues & Solutions

### Issue: "Not authenticated" error
**Solution**: Make sure you're logged in and the JWT token is stored in localStorage

### Issue: Email already exists
**Solution**: Try a different email address

### Issue: Changes not saving
**Solution**: Check browser console for errors, ensure backend is running

### Issue: Avatar not showing
**Solution**: Avatar uses local preview; implement proper upload for production

## Development Notes

- The UserController requires JWT authentication
- Password field is never sent to frontend for security
- Email validation happens on both frontend and backend
- Success messages auto-clear when you start editing again
- Cancel button reverts ALL changes to original values

## Files Modified/Created

### Backend:
- ✅ `UserController.java` (NEW)
- ✅ `UserService.java` (UPDATED - added findById and updateUserProfile)

### Frontend:
- ✅ `UserService.js` (NEW)
- ✅ `ProfilePage.jsx` (UPDATED - fetches real data)
- ✅ `Profile.jsx` (UPDATED - full CRUD functionality)

## Next Steps

1. Test the complete flow
2. Add avatar upload to cloud storage (AWS S3, Cloudinary, etc.)
3. Add password change functionality
4. Show owned/member projects in profile
5. Add profile completion percentage indicator

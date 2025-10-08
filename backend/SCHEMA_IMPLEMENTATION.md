# Database Schema Implementation Guide

## Overview
This guide covers the complete database schema implementation for the SuitX project management and risk mitigation application.

## ✅ Completed Implementation

### 1. Database Schema Design Document
- **File**: `DATABASE_SCHEMA.md`
- **Status**: ✅ Complete
- **Contains**: Full NoSQL schema design for all entities with relationships, indexes, and best practices

### 2. Model Classes (Entities)

#### User Model
- **File**: `src/main/java/dev/doomsday/suitX/model/User.java`
- **Status**: ✅ Complete
- **Features**:
  - Unique indexed username and email
  - Profile fields (firstName, lastName, bio, avatar, etc.)
  - Role-based access (OWNER, MEMBER, ADMIN)
  - Project relationships (ownedProjects, memberProjects)
  - Helper methods for access control
  - Timestamps with @CreatedDate and @LastModifiedDate

#### Project Model
- **File**: `src/main/java/dev/doomsday/suitX/model/Project.java`
- **Status**: ✅ Complete
- **Features**:
  - Owner-member relationship support
  - Compound indexes for efficient queries
  - Task and risk ID references
  - Progress tracking and budget management
  - Helper methods for member management
  - Timeline fields (startDate, endDate)

#### Task Model
- **File**: `src/main/java/dev/doomsday/suitX/model/Task.java`
- **Status**: ✅ Complete
- **Features**:
  - Project relationship
  - Assignment and priority management
  - Embedded comments and attachments
  - Dependencies support
  - Effort tracking (estimated vs actual hours)
  - Helper methods for status checks

#### Risk Model
- **File**: `src/main/java/dev/doomsday/suitX/model/Risk.java`
- **Status**: ✅ Complete
- **Features**:
  - AI-generated risk support
  - Embedded mitigation suggestions
  - Change history tracking
  - Risk score calculation (severity × likelihood)
  - Related task and mitigation references
  - Comprehensive helper methods

#### Mitigation Model
- **File**: `src/main/java/dev/doomsday/suitX/model/Mitigation.java`
- **Status**: ✅ Complete
- **Features**:
  - Risk relationship
  - Embedded action items
  - Resource allocation tracking
  - AI-generated mitigation support
  - Progress percentage calculation
  - Cost tracking (estimated vs actual)

#### Notification Model
- **File**: `src/main/java/dev/doomsday/suitX/model/Notification.java`
- **Status**: ✅ Complete
- **Features**:
  - TTL index for auto-deletion (90 days)
  - Flexible metadata support
  - Multiple notification types
  - Static factory methods for common notifications
  - Action URLs for frontend navigation
  - Priority levels

### 3. Repository Interfaces

#### UserRepository
- **File**: `src/main/java/dev/doomsday/suitX/repository/UserRepository.java`
- **Status**: ✅ Complete
- **Queries**: 11 custom query methods
- **Key Features**: Authentication, project access, role-based queries

#### ProjectRepository
- **File**: `src/main/java/dev/doomsday/suitX/repository/ProjectRepository.java`
- **Status**: ✅ Complete
- **Queries**: 15+ custom query methods
- **Key Features**: Owner/member queries, access control, deadline tracking

#### TaskRepository
- **File**: `src/main/java/dev/doomsday/suitX/repository/TaskRepository.java`
- **Status**: ✅ Complete
- **Queries**: 15+ custom query methods
- **Key Features**: Assignment tracking, overdue detection, priority filtering

#### RiskRepository
- **File**: `src/main/java/dev/doomsday/suitX/repository/RiskRepository.java`
- **Status**: ✅ Complete
- **Queries**: 17+ custom query methods
- **Key Features**: AI-generated risk queries, score-based filtering, critical risk detection

#### MitigationRepository
- **File**: `src/main/java/dev/doomsday/suitX/repository/MitigationRepository.java`
- **Status**: ✅ Complete
- **Queries**: 18+ custom query methods
- **Key Features**: Risk-mitigation linking, effectiveness tracking, overdue detection

#### NotificationRepository
- **File**: `src/main/java/dev/doomsday/suitX/repository/NotificationRepository.java`
- **Status**: ✅ Complete
- **Queries**: 14+ custom query methods
- **Key Features**: Unread counting, bulk operations, priority filtering

## 📊 Schema Relationships

```
User (1) ──owns──> (*) Projects
User (*) ──member of──> (*) Projects
Project (1) ──has──> (*) Tasks
Project (1) ──has──> (*) Risks
Risk (1) ──has──> (*) Mitigations
Task (*) ──assigned to──> (1) User
Risk (*) ──assigned to──> (1) User
Mitigation (*) ──assigned to──> (1) User
Notification (*) ──belongs to──> (1) User
Risk (1) ──embeds──> (*) MitigationSuggestions
Risk (1) ──embeds──> (*) HistoryEntries
Task (1) ──embeds──> (*) Comments
Task (1) ──embeds──> (*) Attachments
Mitigation (1) ──embeds──> (*) Actions
Mitigation (1) ──embeds──> (*) Resources
```

## 🔍 Index Strategy

### Single Field Indexes
- User: `username`, `email`, `isActive`
- Project: `name`, `ownerId`, `memberIds`, `status`
- Task: `title`, `projectId`, `assignedTo`, `status`
- Risk: `title`, `projectId`, `assignedTo`, `status`, `severity`, `aiGenerated`
- Mitigation: `title`, `projectId`, `relatedRiskId`, `assignee`, `status`
- Notification: `userId`, `isRead`, `createdAt`, `relatedEntityId`

### Compound Indexes
- Project: `ownerId + status`, `memberIds + status`
- Task: `projectId + status`, `assignedTo + status`
- Risk: `projectId + status`, `projectId + severity`
- Mitigation: `projectId + status`
- Notification: `userId + isRead + createdAt`

### TTL Indexes
- Notification: `expiresAt` (90 days auto-deletion)

## 🎯 Design Decisions

### Embedding vs Referencing

**Embedded Data** (One-to-Few):
- Comments and attachments in Tasks
- Mitigation suggestions in Risks
- History entries in Risks
- Actions and resources in Mitigations
- Metadata in Notifications

**Referenced Data** (One-to-Many, Many-to-Many):
- Users ↔ Projects (many-to-many)
- Projects → Tasks (one-to-many)
- Projects → Risks (one-to-many)
- Risks → Mitigations (one-to-many)
- Users → Notifications (one-to-many)

### Why Embed?
- Limited count of embedded documents
- Always accessed together with parent
- No need to query embedded data independently
- Improves read performance

### Why Reference?
- Unlimited or large number of related documents
- Need to query independently
- Many-to-many relationships
- Better for frequently updated data

## 📝 Validation Rules

### User
- Username: Unique, 3-50 characters
- Email: Unique, valid email format
- Password: Minimum 8 characters (hashed)
- Role: OWNER, MEMBER, or ADMIN

### Project
- Name: Required, 1-200 characters
- Status: ACTIVE, COMPLETED, ON_HOLD, CANCELLED, or ARCHIVED
- Progress: 0-100
- OwnerId: Required

### Task
- Title: Required, 1-200 characters
- Status: TODO, IN_PROGRESS, DONE, or BLOCKED
- Priority: LOW, MEDIUM, HIGH, or CRITICAL
- ProjectId: Required

### Risk
- Title: Required
- Severity: LOW, MEDIUM, HIGH, or CRITICAL
- Likelihood: RARE, UNLIKELY, POSSIBLE, LIKELY, or CERTAIN
- Status: IDENTIFIED, MONITORING, MITIGATED, RESOLVED, or ACCEPTED
- ProjectId: Required

### Mitigation
- Title: Required
- Status: PLANNED, IN_PROGRESS, COMPLETED, or CANCELLED
- Priority: LOW, MEDIUM, HIGH, or CRITICAL
- ProjectId: Required
- RelatedRiskId: Required

### Notification
- Type: Must be predefined type
- UserId: Required
- ExpiresAt: Default 90 days from creation

## 🚀 Next Steps

### 1. Update Existing Services
The following services need to be updated to use the new schema:

- [ ] **AuthService**: Update to use new User model fields (email, firstName, lastName)
- [ ] **ProjectService**: Update to use ownerId and memberIds instead of createdBy
- [ ] **RiskService**: Add AI-generated risk support and mitigation suggestions
- [ ] **MitigationService**: Update to use new fields and action tracking

### 2. Create New Services

- [ ] **TaskService**: Create service for task management
- [ ] **NotificationService**: Create service for notification management

### 3. Update Controllers

- [ ] Update existing controllers to match new model structure
- [ ] Create TaskController
- [ ] Create NotificationController

### 4. Database Migration

If you have existing data:
```java
// Example migration script for User model
db.users.updateMany(
  { email: { $exists: false } },
  { $set: { 
    email: "",
    firstName: "",
    lastName: "",
    isActive: true,
    ownedProjects: [],
    memberProjects: []
  }}
)
```

### 5. Frontend Integration

Update frontend to work with new schema:
- [ ] Update AuthService to handle email field
- [ ] Update ProjectService to handle member management
- [ ] Create TaskService for task operations
- [ ] Create NotificationService (already created in frontend)

## 🔧 Useful MongoDB Commands

### Create Indexes Manually
```javascript
// User indexes
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })

// Project indexes
db.projects.createIndex({ "ownerId": 1, "status": 1 })
db.projects.createIndex({ "memberIds": 1 })

// Notification TTL index
db.notifications.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 })
```

### Check Existing Indexes
```javascript
db.users.getIndexes()
db.projects.getIndexes()
db.tasks.getIndexes()
db.risks.getIndexes()
db.mitigations.getIndexes()
db.notifications.getIndexes()
```

### Query Examples

```javascript
// Find all projects accessible to a user
db.projects.find({
  $or: [
    { "ownerId": "userId" },
    { "memberIds": "userId" }
  ]
})

// Find critical unresolved risks in a project
db.risks.find({
  "projectId": "projectId",
  "severity": { $in: ["CRITICAL", "HIGH"] },
  "status": { $ne: "RESOLVED" }
})

// Find unread notifications for a user
db.notifications.find({
  "userId": "userId",
  "isRead": false
}).sort({ "createdAt": -1 })
```

## 📚 Additional Resources

- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/core/data-model-design/)
- [Spring Data MongoDB](https://docs.spring.io/spring-data/mongodb/docs/current/reference/html/)
- [Indexing Strategies](https://www.mongodb.com/docs/manual/indexes/)
- [Schema Design Patterns](https://www.mongodb.com/blog/post/building-with-patterns-a-summary)

## ✅ Acceptance Criteria Status

- [x] MongoDB collections defined for users, projects, tasks, risks, and notifications
- [x] Each schema includes proper fields, relationships, and indexes
- [x] Data models implemented using Spring Data annotations
- [x] Schema supports ownership and membership relations for projects
- [x] Tasks and risks linked to projects through IDs
- [x] Notifications tied to user IDs
- [x] Unique constraints on username and email
- [x] Timestamps (createdAt, updatedAt) included
- [x] Helper methods for common operations
- [x] Embedded data for one-to-few relationships
- [x] Referenced data for one-to-many relationships
- [x] Custom repository query methods implemented
- [x] Compound indexes for efficient queries
- [x] TTL index for notification cleanup

## 🎉 All Requirements Met!

This implementation provides a solid, scalable database foundation for the SuitX application with:
- ✅ 6 comprehensive model classes
- ✅ 6 feature-rich repository interfaces  
- ✅ 90+ custom query methods
- ✅ Proper indexing strategy
- ✅ Clear documentation
- ✅ NoSQL best practices

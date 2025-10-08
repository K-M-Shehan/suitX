# SuitX Database Schema Design

## Overview
This document describes the MongoDB NoSQL schema design for the SuitX project management and risk mitigation application.

## Design Principles

1. **Embedding vs Referencing**
   - Embed: One-to-few relationships (e.g., AI suggestions within risks)
   - Reference: One-to-many or many-to-many relationships (e.g., users to projects)

2. **Indexing Strategy**
   - Unique indexes on username and email
   - Compound indexes on frequently queried fields (projectId + status)
   - Index on foreign key references for faster lookups

3. **Timestamps**
   - All documents include `createdAt` and `updatedAt`
   - Audit fields track who created/modified entities

---

## Collections

### 1. Users Collection
**Collection Name:** `users`

**Purpose:** Store user authentication and profile information

**Schema:**
```json
{
  "_id": "ObjectId",
  "username": "string (unique, indexed)",
  "email": "string (unique, indexed)",
  "password": "string (hashed)",
  "firstName": "string",
  "lastName": "string",
  "role": "string (OWNER, MEMBER, ADMIN)",
  "bio": "string",
  "avatar": "string (URL)",
  "phone": "string",
  "department": "string",
  "ownedProjects": ["projectId1", "projectId2"],
  "memberProjects": ["projectId3", "projectId4"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "lastLogin": "timestamp",
  "isActive": "boolean"
}
```

**Indexes:**
- `username`: unique
- `email`: unique
- `isActive`: for filtering active users

---

### 2. Projects Collection
**Collection Name:** `projects`

**Purpose:** Store project details and relationships

**Schema:**
```json
{
  "_id": "ObjectId",
  "name": "string (indexed)",
  "description": "string",
  "status": "string (ACTIVE, COMPLETED, ON_HOLD, CANCELLED, ARCHIVED)",
  "ownerId": "userId (indexed, creator of project)",
  "projectManager": "userId",
  "memberIds": ["userId1", "userId2"],
  "taskIds": ["taskId1", "taskId2"],
  "riskIds": ["riskId1", "riskId2"],
  "startDate": "timestamp",
  "endDate": "timestamp",
  "budget": "number",
  "progressPercentage": "number (0-100)",
  "tags": ["tag1", "tag2"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "createdBy": "userId"
}
```

**Indexes:**
- `ownerId`: for finding user's owned projects
- `memberIds`: for finding user's member projects
- `status`: for filtering by status
- Compound: `ownerId + status`

**Design Notes:**
- `ownerId` is the project creator with full permissions
- `memberIds` array allows many-to-many relationship
- Task and risk IDs are referenced for efficient queries

---

### 3. Tasks Collection
**Collection Name:** `tasks`

**Purpose:** Store project tasks and assignments

**Schema:**
```json
{
  "_id": "ObjectId",
  "title": "string (indexed)",
  "description": "string",
  "projectId": "projectId (indexed)",
  "status": "string (TODO, IN_PROGRESS, DONE, BLOCKED)",
  "priority": "string (LOW, MEDIUM, HIGH, CRITICAL)",
  "assignedTo": "userId (indexed, optional)",
  "createdBy": "userId",
  "dueDate": "timestamp",
  "startDate": "timestamp",
  "completedAt": "timestamp",
  "estimatedHours": "number",
  "actualHours": "number",
  "dependencies": ["taskId1", "taskId2"],
  "tags": ["tag1", "tag2"],
  "attachments": [
    {
      "fileName": "string",
      "fileUrl": "string",
      "uploadedAt": "timestamp"
    }
  ],
  "comments": [
    {
      "userId": "userId",
      "text": "string",
      "createdAt": "timestamp"
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Indexes:**
- `projectId`: for project task queries
- `assignedTo`: for user task queries
- `status`: for filtering
- Compound: `projectId + status`
- Compound: `assignedTo + status`

**Design Notes:**
- Comments and attachments are embedded (one-to-few relationship)
- Dependencies array allows task linking

---

### 4. Risks Collection
**Collection Name:** `risks`

**Purpose:** Store identified project risks and AI analysis

**Schema:**
```json
{
  "_id": "ObjectId",
  "title": "string (indexed)",
  "description": "string",
  "projectId": "projectId (indexed)",
  "type": "string (TECHNICAL, FINANCIAL, RESOURCE, SCOPE, SCHEDULE, QUALITY)",
  "severity": "string (LOW, MEDIUM, HIGH, CRITICAL)",
  "likelihood": "string (RARE, UNLIKELY, POSSIBLE, LIKELY, CERTAIN)",
  "riskScore": "number (calculated: severity × likelihood)",
  "status": "string (IDENTIFIED, MONITORING, MITIGATED, RESOLVED, ACCEPTED)",
  "assignedTo": "userId (indexed)",
  "createdBy": "userId",
  "identifiedDate": "timestamp",
  "aiGenerated": "boolean",
  "aiConfidence": "number (0-100)",
  "mitigationSuggestions": [
    {
      "suggestionId": "string",
      "suggestionText": "string",
      "aiGenerated": "boolean",
      "priority": "string (LOW, MEDIUM, HIGH)",
      "estimatedCost": "number",
      "estimatedEffort": "string",
      "createdAt": "timestamp",
      "status": "string (SUGGESTED, APPROVED, IMPLEMENTED, REJECTED)"
    }
  ],
  "history": [
    {
      "timestamp": "timestamp",
      "action": "string (STATUS_CHANGE, SEVERITY_UPDATE, etc.)",
      "userId": "userId",
      "previousValue": "string",
      "newValue": "string",
      "notes": "string"
    }
  ],
  "relatedTaskIds": ["taskId1", "taskId2"],
  "relatedMitigationIds": ["mitigationId1"],
  "tags": ["tag1", "tag2"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "resolvedAt": "timestamp"
}
```

**Indexes:**
- `projectId`: for project risk queries
- `status`: for filtering
- `severity`: for filtering critical risks
- Compound: `projectId + status`
- Compound: `projectId + severity`
- `aiGenerated`: for AI-generated risk queries

**Design Notes:**
- AI suggestions are embedded (one-to-many, limited count)
- History is embedded for audit trail
- Risk score can be calculated on save

---

### 5. Mitigations Collection
**Collection Name:** `mitigations`

**Purpose:** Store mitigation strategies and action plans

**Schema:**
```json
{
  "_id": "ObjectId",
  "title": "string (indexed)",
  "description": "string",
  "projectId": "projectId (indexed)",
  "relatedRiskId": "riskId (indexed)",
  "status": "string (PLANNED, IN_PROGRESS, COMPLETED, CANCELLED)",
  "priority": "string (LOW, MEDIUM, HIGH, CRITICAL)",
  "assignee": "userId (indexed)",
  "createdBy": "userId",
  "dueDate": "timestamp",
  "startDate": "timestamp",
  "completedAt": "timestamp",
  "progressPercentage": "number (0-100)",
  "estimatedCost": "number",
  "actualCost": "number",
  "aiGenerated": "boolean",
  "effectiveness": "string (NOT_ASSESSED, LOW, MEDIUM, HIGH)",
  "actions": [
    {
      "actionId": "string",
      "description": "string",
      "assignedTo": "userId",
      "status": "string (PENDING, IN_PROGRESS, COMPLETED)",
      "dueDate": "timestamp",
      "completedAt": "timestamp"
    }
  ],
  "resources": [
    {
      "type": "string (HUMAN, FINANCIAL, TECHNICAL)",
      "description": "string",
      "allocated": "number"
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Indexes:**
- `projectId`: for project mitigation queries
- `relatedRiskId`: for risk-mitigation linking
- `assignee`: for user queries
- `status`: for filtering
- Compound: `projectId + status`

**Design Notes:**
- Actions are embedded (one-to-few)
- Resources are embedded for tracking allocation

---

### 6. Notifications Collection
**Collection Name:** `notifications`

**Purpose:** Store user notifications for events

**Schema:**
```json
{
  "_id": "ObjectId",
  "userId": "userId (indexed)",
  "type": "string (TASK_ASSIGNED, TASK_COMPLETED, RISK_DETECTED, RISK_UPDATED, PROJECT_INVITED, MITIGATION_ASSIGNED, COMMENT_ADDED, DEADLINE_APPROACHING)",
  "title": "string",
  "message": "string",
  "relatedEntityType": "string (PROJECT, TASK, RISK, MITIGATION)",
  "relatedEntityId": "entityId (indexed)",
  "actionUrl": "string (frontend route)",
  "isRead": "boolean (indexed)",
  "priority": "string (LOW, MEDIUM, HIGH)",
  "metadata": {
    "projectName": "string",
    "taskTitle": "string",
    "userName": "string",
    "any_custom_field": "value"
  },
  "createdAt": "timestamp (indexed)",
  "readAt": "timestamp",
  "expiresAt": "timestamp (TTL index)"
}
```

**Indexes:**
- `userId`: for user notification queries
- `isRead`: for unread filtering
- Compound: `userId + isRead + createdAt` (most common query)
- `createdAt`: for sorting
- TTL: `expiresAt` (auto-delete old notifications after 90 days)

**Design Notes:**
- Metadata is flexible JSON for different notification types
- TTL index auto-deletes old notifications
- Action URL helps frontend navigation

---

## Relationships Summary

```
User (1) ----owns----> (*) Projects
User (*) ----member of----> (*) Projects
Project (1) ----has----> (*) Tasks
Project (1) ----has----> (*) Risks
Risk (1) ----has----> (*) Mitigations (or embedded suggestions)
Task (*) ----assigned to----> (1) User
Risk (*) ----assigned to----> (1) User
Mitigation (*) ----assigned to----> (1) User
Notification (*) ----belongs to----> (1) User
```

---

## Query Patterns

### Common Queries and Their Indexes

1. **Find all projects for a user (as owner or member)**
   - Uses: `ownerId` index or `memberIds` index

2. **Find all tasks in a project**
   - Uses: `projectId` index on tasks

3. **Find all unread notifications for a user**
   - Uses: Compound `userId + isRead` index

4. **Find all high-severity risks in a project**
   - Uses: Compound `projectId + severity` index

5. **Find all tasks assigned to a user**
   - Uses: Compound `assignedTo + status` index

---

## Data Validation Rules

### User
- Username: 3-50 characters, alphanumeric + underscore
- Email: Valid email format
- Password: Minimum 8 characters (hashed before storage)

### Project
- Name: 1-200 characters, required
- Status: Must be one of predefined values
- Progress: 0-100

### Task
- Title: 1-200 characters, required
- Status: Must be one of predefined values
- DueDate: Cannot be in the past (at creation)

### Risk
- Severity: Must be LOW, MEDIUM, HIGH, or CRITICAL
- Likelihood: Must be RARE, UNLIKELY, POSSIBLE, LIKELY, or CERTAIN
- RiskScore: Auto-calculated

### Notification
- Type: Must be one of predefined types
- ExpiresAt: Default 90 days from creation

---

## Migration Notes

When implementing, ensure:
1. Create indexes before loading large datasets
2. Use MongoDB transactions for operations affecting multiple collections
3. Implement cascade deletion where appropriate (e.g., delete project → delete associated tasks/risks)
4. Add validation at both database and application layer
5. Use MongoDB change streams for real-time notification generation

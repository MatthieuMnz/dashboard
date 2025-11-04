## Partnership management dashboard

### Core Features

**Data Models:**

- Partners: name, photo URL, email, address, phone. Auto-assigned color from palette.
- Partnerships: linked to partner and a model (eg. start date, financial data (value given, amount paid, revenue), promo code + usage count, array of content items (type, date, theme)).
- Partnerships Model
- Fields

**Partnerships Models:**

Partnerships models define the structure and fields required for different types of partnerships. Each model specifies which fields are needed to track that particular partnership type.

- **Influencer Partnership Model**: Complex model with fields including:

  - Linked to partner
  - Start date
  - Financial data (value given, amount paid, revenue)
  - Promo code + usage count
  - Array of content items (type, date, theme)

- **Media Partnership Model**: Simpler model with fewer fields (specific fields to be defined).

- **Custom Models**: System supports adding custom partnership models with configurable fields.

**Field System:**

- Fields are reusable building blocks that can be shared across multiple partnership models
- A field defined in one model can be reused in another model
- This allows for consistency and flexibility when creating new partnership types
- Fields can be grouped into field sets for easier management and reuse

**Four Main Views:**

1. **Dashboard**: Homepage of the feature. Active partners list, upcoming actions (next 15 days), ROI table sorted by ROI %.
2. **Management**: CRUD for partners and partnerships and partnerships models. Shows partnerships as cards with metrics.
3. **Calendar**: Monthly grid showing partnership content items by date with hover tooltips.
4. **Setings**: Anything needed to configure the core system

All views page accessible via subnav.

**Content Types (13 predefined):**
YouTube videos (dedicated, pre-roll, mid-roll), TikTok videos, Instagram stories/posts/reels (with/without links, pinned), Snapchat stories, Facebook posts/videos.
Possibility to add more.

**ROI Calculation:**

- Cost = `valueGiven + amountPaid`
- ROI % = `((revenue - cost) / cost) * 100`

**Purpose:**
Track influencer/partner collaborations, monitor ROI, schedule content publication dates, and manage partnership agreements.

---

## Detailed Feature Plan

### Data Schema

#### Partners Table

Stores information about individual partners (influencers, media companies, etc.).

**Fields:**

- `id` (primary key, auto-increment)
- `name` (required, text) - Partner's name or company name
- `photoUrl` (optional, text) - URL to partner's photo/logo
- `email` (optional, text) - Contact email
- `phone` (optional, text) - Contact phone number
- `address` (optional, text) - Physical or mailing address
- `color` (text) - Auto-assigned color from predefined palette (hex code)
- `createdAt` (timestamp) - When the partner was created
- `updatedAt` (timestamp) - Last update timestamp
- `archivedAt` (optional timestamp) - Soft delete support

**Notes:**

- Color is automatically assigned from a predefined palette when a partner is created
- Supports soft deletion via `archivedAt` field
- Email and phone can be empty (not all partners require contact info)

#### Partnership Models Table

Defines the structure/template for different types of partnerships (Influencer, Media, Custom, etc.).

**Fields:**

- `id` (primary key, auto-increment)
- `name` (required, text) - Model name (e.g., "Influencer Partnership", "Media Partnership")
- `description` (optional, text) - Description of what this model is used for
- `isDefault` (boolean) - Whether this is a default/predefined model
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `archivedAt` (optional timestamp)

**Predefined Models:**

- **Influencer Partnership Model** - Default model for influencer collaborations
- **Media Partnership Model** - Default model for media partnerships

#### Fields Table

Reusable field definitions that can be shared across multiple partnership models.

**Fields:**

- `id` (primary key, auto-increment)
- `name` (required, text) - Field name (e.g., "Start Date", "Promo Code", "Value Given")
- `slug` (required, text, unique) - URL-friendly identifier
- `type` (enum) - Field data type: `text`, `number`, `date`, `boolean`, `currency`, `url`, `email`
- `description` (optional, text) - Help text explaining the field
- `isRequired` (boolean) - Whether this field must be filled when creating a partnership
- `defaultValue` (optional, text) - Default value (stored as text, interpreted by type)
- `validationRules` (optional, JSON) - Additional validation rules (min/max, regex, etc.)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `archivedAt` (optional timestamp)

**Predefined Fields:**

- Start Date (date, required)
- End Date (date, optional)
- Value Given (currency, optional)
- Amount Paid (currency, optional)
- Revenue (currency, optional)
- Promo Code (text, optional)
- Promo Code Usage Count (number, optional)
- Status (text, enum: active, completed, cancelled, paused)
- Notes (text, optional)

#### Field Sets Table

Groups fields together for easier management and reuse across models.

**Fields:**

- `id` (primary key, auto-increment)
- `name` (required, text) - Field set name (e.g., "Financial Data", "Content Tracking")
- `description` (optional, text)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `archivedAt` (optional timestamp)

**Predefined Field Sets:**

- **Financial Data** - Groups: Value Given, Amount Paid, Revenue
- **Promo Tracking** - Groups: Promo Code, Promo Code Usage Count
- **Dates** - Groups: Start Date, End Date

#### Partnership Model Fields Table (Junction)

Links fields to partnership models, defining which fields belong to which model.

**Fields:**

- `id` (primary key, auto-increment)
- `partnershipModelId` (foreign key to partnership_models)
- `fieldId` (foreign key to fields)
- `order` (integer) - Display order of field within the model
- `isRequired` (boolean) - Override field-level requirement for this specific model
- `createdAt` (timestamp)

**Notes:**

- Allows same field to appear in multiple models with different requirements
- Order determines display sequence in forms and views

#### Partnerships Table

Actual partnership instances, linked to a partner and following a partnership model structure.

**Fields:**

- `id` (primary key, auto-increment)
- `partnerId` (foreign key to partners, required)
- `partnershipModelId` (foreign key to partnership_models, required)
- `status` (enum: active, completed, cancelled, paused)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `archivedAt` (optional timestamp)

**Notes:**

- Each partnership belongs to one partner and follows one model
- Status tracks partnership lifecycle

#### Partnership Field Values Table

Stores actual values for partnership fields (dynamic data based on model's field definitions).

**Fields:**

- `id` (primary key, auto-increment)
- `partnershipId` (foreign key to partnerships, required)
- `fieldId` (foreign key to fields, required)
- `value` (text) - Stored value (interpreted by field type)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

**Notes:**

- All values stored as text, interpreted based on field type
- One record per partnership-field combination
- Supports updating values over time

#### Content Types Table

Defines available content types for partnership content items.

**Fields:**

- `id` (primary key, auto-increment)
- `name` (required, text) - Content type name (e.g., "YouTube Dedicated Video")
- `slug` (required, text, unique) - URL-friendly identifier
- `category` (enum: youtube, tiktok, instagram, snapchat, facebook)
- `icon` (optional, text) - Icon identifier or URL
- `isActive` (boolean) - Whether this content type is available for use
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

**Predefined Content Types (13):**

- YouTube: Dedicated Video, Pre-roll Ad, Mid-roll Ad
- TikTok: Video
- Instagram: Story, Story with Link, Post, Post with Link, Reel, Reel with Link, Pinned Post
- Snapchat: Story
- Facebook: Post, Video

#### Content Items Table

Stores scheduled/published content items for partnerships.

**Fields:**

- `id` (primary key, auto-increment)
- `partnershipId` (foreign key to partnerships, required)
- `contentTypeId` (foreign key to content_types, required)
- `scheduledDate` (date, required) - When content is/was scheduled to be published
- `publishedDate` (optional date) - Actual publication date if different
- `theme` (optional, text) - Content theme or topic
- `url` (optional, text) - Link to published content
- `status` (enum: scheduled, published, cancelled)
- `notes` (optional, text) - Additional notes about the content
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

**Notes:**

- Scheduled date is always required for planning
- Published date can differ from scheduled date
- Theme helps categorize content by topic/campaign

---

### Views & Pages

#### 1. Dashboard (`/dashboard/partnership`)

Homepage of the partnership feature, providing overview and quick insights.

**Layout:**

- Page header with title "Partenariats" and brief description
- Main content area with multiple sections

**Active Partners Section:**

- List of currently active partners (partnerships with status "active")
- Display format: Card grid or compact list
- Each item shows:
  - Partner name and photo
  - Partner color indicator
  - Number of active partnerships
  - Last activity date
- Link to full partner details
- Filter: Show all / Active only / Archived

**Upcoming Actions Section:**

- List of actions scheduled in the next 15 days
- Includes:
  - Content items scheduled for publication
  - Partnership end dates approaching
  - Promo codes expiring soon
  - Other time-sensitive items
- Display format: Timeline or list
- Each item shows:
  - Date
  - Action type (content publication, deadline, etc.)
  - Partnership name
  - Partner name
  - Status indicator
- Link to related partnership or calendar view

**ROI Table:**

- Tabular view of partnerships sorted by ROI percentage (highest first)
- Columns:
  - Partner name
  - Partnership name/type
  - Value Given
  - Amount Paid
  - Total Cost (calculated)
  - Revenue
  - ROI % (calculated)
  - Status
- Sortable columns
- Filterable by date range, partner, status
- Link to partnership details
- Visual indicators for positive/negative ROI

**Quick Stats Cards:**

- Summary metrics at the top:
  - Total active partnerships
  - Total partners
  - Average ROI %
  - Total revenue this month/quarter/year
  - Upcoming content items count

**Notes:**

- All data is read-only on this view
- Links navigate to Management view for details
- Real-time calculations for ROI and stats

#### 2. Management (`/dashboard/partnership/management`)

Full CRUD interface for partners, partnerships, and partnership models.

**Tabs/Sections:**

**Partners Tab:**

- Table view of all partners
- Columns: Name, Photo, Email, Phone, Active Partnerships Count, Color, Actions
- Actions: Create, Edit, Delete (archive), View Details
- Create/Edit form fields:
  - Name (required)
  - Photo URL (optional)
  - Email (optional)
  - Phone (optional)
  - Address (optional)
  - Color (auto-assigned, but can be changed)
- Delete action archives partner (sets archivedAt)
- View Details shows all partnerships for that partner

**Partnerships Tab:**

- Card grid view of partnerships (default) or table view (toggle)
- Each card shows:
  - Partner name and photo
  - Partnership model name
  - Key metrics (revenue, ROI, cost)
  - Status badge
  - Content items count
  - Date range (start/end)
  - Quick actions (Edit, View, Archive)
- Create Partnership flow:
  1. Select partner
  2. Select partnership model
  3. Fill in required fields based on model
  4. Optionally add content items
  5. Save
- Edit Partnership:
  - Form with all fields from the model
  - Can update field values
  - Can add/remove content items
  - Can change status
- Filter options:
  - By partner
  - By model
  - By status
  - By date range
- Search by partner name or partnership details

**Partnership Models Tab:**

- Table view of all partnership models
- Columns: Name, Description, Fields Count, Partnerships Count, Is Default, Actions
- Actions: Create, Edit, Delete, View Fields
- Create/Edit Model form:
  - Name (required)
  - Description (optional)
  - Field selection (multi-select from available fields)
  - Field ordering (drag-and-drop)
  - Field requirement overrides
- View Fields shows all fields assigned to model with their types and requirements
- Delete action only allowed if no partnerships use the model

**Fields Tab:**

- Table view of all fields
- Columns: Name, Slug, Type, Required, Used In Models, Actions
- Actions: Create, Edit, Delete, View Usage
- Create/Edit Field form:
  - Name (required)
  - Slug (auto-generated from name, editable)
  - Type (dropdown: text, number, date, boolean, currency, url, email)
  - Description (optional)
  - Is Required (checkbox)
  - Default Value (optional)
  - Validation Rules (JSON editor)
- Delete action only allowed if field not used in any model
- View Usage shows which models use this field

**Field Sets Tab (optional advanced feature):**

- Table view of field sets
- Can group fields together for easier management
- Less critical for initial implementation

**Notes:**

- All create/edit operations use dialogs/modals
- Forms validate based on field types and requirements
- Deletion is soft (archives) where possible
- Bulk actions may be added later

#### 3. Calendar (`/dashboard/partnership/calendar`)

Monthly calendar view showing partnership content items scheduled for publication.

**Layout:**

- Month navigation (previous/next month, jump to date)
- Current month grid view
- Each day cell shows:
  - Day number
  - Content items scheduled for that day (if any)
  - Visual indicators for different content types (icons/colors)
  - Hover tooltip showing:
    - Partnership name
    - Partner name
    - Content type
    - Theme
    - Scheduled time (if available)
    - Status (scheduled/published/cancelled)
- Click on day or content item opens details/edit dialog
- Today's date highlighted
- Weekend days visually distinct

**Sidebar/Details Panel:**

- When content item clicked, shows:
  - Full content details
  - Partnership information
  - Partner information
  - Edit/Delete actions
  - Link to partnership details

**Filter Options:**

- By partner
- By content type
- By partnership
- By status (scheduled/published/cancelled)
- Show/hide past dates

**Views:**

- Month view (default)
- Week view (optional)
- List view (optional, shows all items in selected date range)

**Notes:**

- Read-only calendar view, actions trigger dialogs
- Supports drag-and-drop rescheduling (future enhancement)
- Color coding by partner or content type

#### 4. Settings (`/dashboard/partnership/settings`)

Configuration and system settings for the partnership feature.

**Content Types Management:**

- Table view of all content types
- Enable/disable content types
- Add custom content types
- Edit content type details (name, icon, category)
- Cannot delete predefined content types
- Can archive custom content types

**Color Palette Configuration:**

- Visual display of partner color palette
- Add/remove colors from palette
- Edit color values
- Preview how colors look

**Default Partnership Models:**

- View and edit predefined models (Influencer, Media)
- Cannot delete default models
- Can edit their fields and structure

**ROI Calculation Settings:**

- View formula: Cost = Value Given + Amount Paid, ROI = ((Revenue - Cost) / Cost) \* 100
- Future: Allow customization of calculation formula

**Data Export/Import:**

- Export partnerships data (CSV, JSON)
- Import partnerships from file (future)
- Backup/restore settings

**System Information:**

- Total partners count
- Total partnerships count
- Total content items count
- Last data update timestamp

**Notes:**

- Settings affect all partnerships
- Changes to content types or models may require confirmation if in use
- Export functionality for reporting and backup

---

### Content Types Detail

**YouTube:**

- Dedicated Video: Full video created specifically for partnership
- Pre-roll Ad: Advertisement shown before main video
- Mid-roll Ad: Advertisement shown in middle of video

**TikTok:**

- Video: Standard TikTok video content

**Instagram:**

- Story: Temporary story post (24 hours)
- Story with Link: Story post including clickable link
- Post: Standard Instagram post
- Post with Link: Post with link in bio or caption
- Reel: Short-form video content
- Reel with Link: Reel with associated link
- Pinned Post: Post pinned to top of profile

**Snapchat:**

- Story: Snapchat story post

**Facebook:**

- Post: Standard Facebook post
- Video: Video content on Facebook

**Adding Custom Content Types:**

- Admin can add new content types via Settings
- Requires name, category, and optional icon
- New types become available immediately for all partnerships

---

### ROI Calculation

**Formula:**

- Cost = Value Given + Amount Paid
- ROI % = ((Revenue - Cost) / Cost) \* 100

**Display:**

- ROI % shown with 2 decimal places
- Positive ROI shown in green
- Negative ROI shown in red
- Zero ROI shown in neutral color
- "N/A" shown when cost is zero (division by zero)

**Calculation Rules:**

- All financial values stored as currency (decimal numbers)
- Values can be zero or null
- If any required value is missing, ROI shows as "N/A"
- Calculations performed on-the-fly when displaying data
- Values can be updated over time, ROI recalculates automatically

**Use Cases:**

- Dashboard ROI table sorted by ROI %
- Partnership cards show ROI %
- Partner detail pages show aggregated ROI across all partnerships
- Reports and exports include ROI calculations

---

### Data Relationships

**Partner → Partnerships:**

- One partner can have many partnerships
- Partnership belongs to one partner
- Deleting partner archives all partnerships (or prevents deletion if partnerships exist)

**Partnership Model → Partnerships:**

- One model can be used by many partnerships
- Partnership follows one model
- Model defines structure, partnership stores values

**Partnership Model → Fields (via Junction):**

- Model has many fields
- Field can belong to many models
- Junction table stores ordering and requirement overrides

**Field → Partnership Field Values:**

- One field can have many values (one per partnership)
- Value belongs to one field and one partnership

**Partnership → Content Items:**

- One partnership can have many content items
- Content item belongs to one partnership

**Content Type → Content Items:**

- One content type can be used by many content items
- Content item has one content type

---

### User Workflows

**Creating a New Partnership:**

1. Navigate to Management → Partnerships
2. Click "Create Partnership"
3. Select partner from dropdown (or create new partner)
4. Select partnership model
5. Form displays with fields from selected model
6. Fill in required fields
7. Optionally add content items with scheduled dates
8. Save partnership
9. Redirected to partnership details or list

**Tracking Content Publication:**

1. Content items created with scheduled dates
2. Calendar view shows upcoming publications
3. On publication day, user updates content item:
   - Mark as published
   - Update published date if different
   - Add URL to published content
   - Add notes
4. Calendar updates automatically

**Monitoring ROI:**

1. Dashboard shows ROI table sorted by performance
2. Click partnership to see detailed financial breakdown
3. Update revenue/expenses as partnership progresses
4. ROI recalculates automatically
5. Export ROI data for reporting

**Managing Partnership Models:**

1. Navigate to Management → Partnership Models
2. View existing models or create new
3. Add/remove fields from model
4. Set field order and requirements
5. Model becomes available for new partnerships
6. Existing partnerships keep their original model structure

---

### Edge Cases & Considerations

**Data Integrity:**

- Cannot delete partner if active partnerships exist (must archive first)
- Cannot delete field if used in any model
- Cannot delete model if used by any partnership
- Content items remain linked even if partnership is archived

**Performance:**

- Dashboard aggregates data efficiently
- Calendar view loads one month at a time
- Large lists paginated or virtualized
- ROI calculations cached where possible

**User Experience:**

- Clear validation messages in French
- Confirmation dialogs for destructive actions
- Undo/redo for critical operations (future)
- Search and filter on all list views
- Keyboard shortcuts for common actions (future)

**Internationalization:**

- All UI text in French (per architecture requirements)
- Dates formatted according to French locale
- Currency displayed with appropriate formatting
- Content types and field names can be translated (future)

---

### Future Enhancements (Not in Initial Scope)

- Advanced reporting and analytics
- Email notifications for upcoming content
- Integration with social media APIs
- Bulk import/export of partnerships
- Custom field types beyond basic types
- Workflow automation (status changes, reminders)
- Partner collaboration portal (external access)
- Advanced filtering and search
- Data visualization charts and graphs
- Mobile app or responsive mobile views

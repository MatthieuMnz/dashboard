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

**Content Types (13 predefined):**
YouTube videos (dedicated, pre-roll, mid-roll), TikTok videos, Instagram stories/posts/reels (with/without links, pinned), Snapchat stories, Facebook posts/videos.
Possibility to add more.

**ROI Calculation:**

- Cost = `valueGiven + amountPaid`
- ROI % = `((revenue - cost) / cost) * 100`

**Purpose:**
Track influencer/partner collaborations, monitor ROI, schedule content publication dates, and manage partnership agreements.

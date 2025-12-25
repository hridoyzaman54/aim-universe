# Website Version Control System - User Guide

## Overview

The AIM Centre website now includes a comprehensive version control system that allows you to:
- 🕰️ **Save snapshots** of your website at any point in time
- 👁️ **Preview** previous versions before restoring them
- ↩️ **Restore** to any previous version with a single click
- 🤖 **Auto-save** changes at regular intervals
- 📱 **Preview** versions on desktop, tablet, and mobile views

## How to Access

1. Log in as an **Admin** user
2. Navigate to **Admin Dashboard**
3. Click on the **"Versions"** tab

## Features

### 1. Version History

View all saved versions of your website in chronological order. Each version displays:
- Version number and name
- Description of changes
- Creation timestamp
- Tags (e.g., 'initial', 'auto-save', 'major-update')
- Current version indicator

### 2. Auto-Save

**Automatic version saving** protects your work:
- Enabled by default
- Saves every 5 minutes (configurable)
- Only saves when changes are detected
- Can be enabled/disabled in settings

**To configure auto-save:**
1. Go to Admin Dashboard → Versions → Auto-Save Settings
2. Toggle auto-save on/off
3. Set your preferred interval (1-60 minutes)

### 3. Manual Save

**Save the current state** of your website anytime:
1. Click **"Save Current Version"** button
2. The current state is immediately captured
3. Useful before making major changes

### 4. Preview Versions

**View how your website looked** at any point in time:
1. Click **"Preview"** on any version
2. View content in full-screen mode
3. Switch between Desktop, Tablet, and Mobile views
4. Preview tracks viewing time for analytics

**Preview features:**
- Full-screen preview mode
- Responsive device preview (Desktop/Tablet/Mobile)
- View component configuration
- See global settings
- No risk - preview doesn't affect current site

### 5. Restore Versions

**Rollback to a previous version:**
1. Click **"Restore"** on the version you want
2. Preview the version (recommended)
3. Confirm restoration
4. The page will reload with the restored version

**Important notes:**
- Current version is preserved in history
- You can always restore back to any version
- Changes take effect immediately
- All users see the restored version

## Best Practices

### When to Save Manually

✅ **Before** making major changes
✅ **After** completing a significant update
✅ **Before** content rewrites
✅ **After** testing new features

### Naming Conventions

Use descriptive names and tags:
- `"Homepage Redesign"` + tags: `['major', 'ui-update']`
- `"Added New Course Section"` + tags: `['content', 'courses']`
- `"Bug Fix: Login Flow"` + tags: `['bugfix', 'minor']`

### Version Management

🧹 **Keep your history clean:**
- Remove old test versions
- Keep important milestones
- Use tags for easy filtering
- Add detailed descriptions

### Testing Workflow

1. **Save current version** (baseline)
2. Make your changes locally
3. **Preview** the changes
4. If satisfied, keep changes
5. If not, **restore** to baseline
6. **Save** final version with description

## Technical Details

### Database Schema

The system uses four main tables:
- `website_versions`: Stores version snapshots
- `website_pages`: Stores individual page configurations
- `version_changes`: Tracks changes between versions
- `version_previews`: Tracks preview sessions

### What Gets Saved

Each version snapshot includes:
- Page configurations (components, layout)
- Global settings (theme, language)
- Metadata (creation time, creator, tags)
- Content structure

### Security

- ✅ Only **Admin** users can manage versions
- ✅ All users can view version history
- ✅ Changes are tracked and attributed
- ✅ Row Level Security (RLS) enabled

## Migration Setup

To enable version control on your existing database:

```bash
# Navigate to your project
cd aim-universe

# Apply the migration
supabase db push

# Or manually run the migration SQL file
supabase db execute -f supabase/migrations/20251225000000_website_version_control.sql
```

## Troubleshooting

### Auto-save not working?
- Check if auto-save is enabled in settings
- Verify you're logged in as admin
- Check browser console for errors

### Can't restore a version?
- Ensure you have admin permissions
- Check if the version exists in the database
- Try refreshing the page

### Preview not showing correctly?
- Clear browser cache
- Check if version data is complete
- Verify the content_snapshot JSON structure

## API Functions

The system provides several database functions:

### `create_website_version()`
Creates a new version snapshot
```sql
SELECT create_website_version(
  'Version Name',
  'Description',
  '{"pages": {...}}'::jsonb,
  ARRAY['tag1', 'tag2']
);
```

### `restore_website_version()`
Restores a specific version
```sql
SELECT restore_website_version('version-uuid');
```

### `get_current_version()`
Gets the currently active version
```sql
SELECT * FROM get_current_version();
```

### `track_version_preview()`
Tracks preview sessions
```sql
SELECT track_version_preview(
  'version-uuid',
  120, -- duration in seconds
  'Feedback text'
);
```

## Future Enhancements

Planned features:
- 📊 Visual diff between versions
- 🏷️ Advanced tagging and filtering
- 📸 Automatic screenshots/thumbnails
- 📧 Email notifications on version changes
- 🔄 Scheduled version restoration
- 📦 Bulk version operations
- 🔍 Full-text search in version history

## Support

For issues or questions:
1. Check this guide first
2. Review browser console errors
3. Check Supabase logs
4. Contact the development team

---

**Version Control System v1.0**  
*Last Updated: December 25, 2024*

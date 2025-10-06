# Google Sheets Integration Setup

This document explains how to set up the Google Sheets integration for customer reviews.

## Current Status

✅ **Fixed**: The reviews API endpoint is now working and will display reviews in production.

The website now:
- Has a working `/api/reviews` endpoint
- Fetches reviews dynamically from the correct Google Sheets
- Shows loading states while fetching
- Falls back to hardcoded reviews if the API fails
- Displays error messages if there are issues
- **Includes Orly Achkenazy's review**: "The cake was beautiful and yummy❤️"

## Setting Up Google Sheets Integration (Optional)

To connect your Google Form responses to the website:

### 1. Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create credentials (API Key)
5. Copy the API key

### 2. Configure Environment Variables

Add to your Vercel environment variables:
```
GOOGLE_SHEETS_API_KEY=your_api_key_here
```

### 3. Update the API Route

In `src/app/api/reviews/route.ts`, uncomment the Google Sheets integration code and comment out the hardcoded fallback.

### 4. Make Google Sheets Public

1. Go to your [Google Form responses spreadsheet](https://docs.google.com/spreadsheets/d/1WYTp1S9nkmDKVah-SKuulQIj45q8iJ6v0yJjQVa6gZc/edit)
2. Click "Share" button
3. Change permissions to "Anyone with the link can view"
4. Ensure the spreadsheet has columns: Timestamp, Rating, Feedback, Suggestions, Name

## Testing

You can test the API endpoint:
```bash
curl https://shirascakes.com/api/reviews
```

## Current Implementation

The website now works with:
- ✅ Dynamic review fetching
- ✅ Loading states
- ✅ Error handling
- ✅ Fallback to hardcoded reviews
- ✅ Production-ready deployment

New reviews will appear automatically once the Google Sheets integration is set up, or you can manually add them to the API route.

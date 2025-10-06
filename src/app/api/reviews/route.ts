import { NextResponse } from 'next/server';

export interface Review {
  name: string;
  review: string;
  rating?: number;
}

// Google Sheets API configuration
const GOOGLE_SHEETS_ID = '12LAXz4XRCDLk7NbEMmWPxZtpoDa9wfDqm34FpwKkDYk';
const GOOGLE_SHEETS_RANGE = 'A:E'; // Columns: Timestamp, Rating, Feedback, Suggestions, Name

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    
    if (!apiKey) {
      console.log('Google Sheets API key not configured, using fallback reviews');
      // Fallback to hardcoded reviews
      const fallbackReviews: Review[] = [
        {
          name: "Shiran Tesler-Greenberg",
          review: "We needed a cake last minute and Shira delivered! The cake was beautiful, just like the inspo picture we sent her, and really delicious! The birthday girl was very happy 💟",
          rating: 5
        },
        {
          name: "Hadar Spiro", 
          review: "Thank you Shira Tzur for another amazing, creative workshop! 🎂",
          rating: 5
        }
      ];
      return NextResponse.json({ reviews: fallbackReviews });
    }

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/${GOOGLE_SHEETS_RANGE}?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rows = data.values || [];

    // Skip header row and transform data
    // Columns: [Timestamp, Rating, Feedback, Suggestions, Name]
    const reviews: Review[] = rows.slice(1).map((row: string[]) => ({
      name: row[4] || 'Anonymous', // Name column (E)
      review: row[2] || '', // Feedback column (C)
      rating: row[1] ? parseInt(row[1]) : undefined // Rating column (B)
    })).filter((review: Review) => review.review.trim() !== '');

    console.log(`Fetched ${reviews.length} reviews from Google Sheets`);
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews from Google Sheets:', error);
    
    // Fallback to hardcoded reviews
    const fallbackReviews: Review[] = [
      {
        name: "Shiran Tesler-Greenberg",
        review: "We needed a cake last minute and Shira delivered! The cake was beautiful, just like the inspo picture we sent her, and really delicious! The birthday girl was very happy 💟",
        rating: 5
      },
      {
        name: "Hadar Spiro", 
        review: "Thank you Shira Tzur for another amazing, creative workshop! 🎂",
        rating: 5
      }
    ];

    return NextResponse.json({ reviews: fallbackReviews });
  }
}


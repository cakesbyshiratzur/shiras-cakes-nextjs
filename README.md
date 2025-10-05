# Shira's Cakes Website

A beautiful, modern website for Shira's Cakes - a professional custom cake design business serving Dallas-Fort Worth and Austin areas.

## 🍰 Features

- **Responsive Design**: Beautiful, mobile-first design that works on all devices
- **Custom Cake Gallery**: Organized photo gallery with category filtering
- **Customer Reviews**: Dynamic reviews system integrated with Google Forms
- **Service Information**: Detailed information about custom cakes, cupcakes, cookies, and baking workshops
- **Contact Integration**: Direct links to Instagram, Facebook, and WhatsApp
- **SEO Optimized**: Complete meta tags, structured data, and social media integration

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.4
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
shiras-cakes/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── reviews/
│   │   │       └── route.ts          # Google Forms integration API
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout with fonts and metadata
│   │   ├── page.tsx                  # Main homepage component
│   │   └── not-found.tsx             # 404 page
│   └── components/                   # Reusable components (future)
├── public/
│   ├── images/                       # Gallery images
│   ├── logo.jpg                      # Business logo
│   └── shira-photo.jpg               # Owner photo
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cakesbyshiratzur/shiras-cakes-nextjs.git
   cd shiras-cakes-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Customization

### Updating Business Information
- Edit `src/app/layout.tsx` for meta tags and business details
- Update contact information in `src/app/page.tsx`
- Modify service descriptions and pricing

### Adding New Gallery Images
1. Add images to `public/images/` directory
2. Update the image arrays in `src/app/page.tsx`:
   - `birthdayImages` (images 1-39)
   - `specialDesignImages` (images 40-48)
   - `cookiesImages` (images 60-73)

### Customizing Colors
Edit `tailwind.config.ts` to modify the color scheme:
```typescript
colors: {
  'primary-pink': '#ffb6c1',
  'secondary-pink': '#ffc0cb',
  'accent-pink': '#ff69b4',
}
```

## 📊 Customer Reviews Integration

The website automatically displays customer reviews from Google Forms:

1. **Google Form Setup**: Reviews are collected via [Google Form](https://docs.google.com/forms/d/1Gzxovv4vKZndwlz_jTYdxYGDMEmSERy_dTigT06Ug4k/viewform)
2. **Responses Sheet**: Reviews are stored in [Google Sheets](https://docs.google.com/spreadsheets/d/1WYTp1S9nkmDKVah-SKuulQIj45q8iJ6v0yJjQVa6gZc/edit)
3. **API Integration**: The `/api/reviews` endpoint fetches and displays reviews automatically

### Making Reviews Public
To display reviews, ensure the Google Sheets responses are set to "Anyone with the link can view".

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push to main branch
3. Custom domain setup available

### Other Platforms
- **Netlify**: Compatible with Next.js static export
- **AWS Amplify**: Full Next.js support
- **Railway**: Simple deployment with database options

## 📱 Social Media Integration

- **Instagram**: [@shirascakes](https://www.instagram.com/shirascakes/)
- **Facebook**: [cakesbyshira](https://www.facebook.com/cakesbyshira)
- **WhatsApp**: +1 214.677.6273

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to Shira's Cakes business.

## 📞 Contact

**Shira Tzur** - Owner & Baker
- Phone: +1 214.677.6273
- Email: [Contact via website]
- Instagram: [@shirascakes](https://www.instagram.com/shirascakes/)

---

*Making moments sweeter, one cake at a time* 🍰✨
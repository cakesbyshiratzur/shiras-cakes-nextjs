# Deployment Guide - Shira's Cakes

This guide will help you deploy the Shira's Cakes landing page to Vercel.

## 🚀 Quick Deployment to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**:
   ```bash
   cd shiras-cakes
   git init
   git add .
   git commit -m "Initial commit: Shira's Cakes landing page"
   git branch -M main
   git remote add origin https://github.com/yourusername/shiras-cakes.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your `shiras-cakes` repository
   - Vercel will automatically detect it's a Next.js project
   - Click "Deploy"

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd shiras-cakes
   vercel
   ```

3. **Follow the prompts**:
   - Link to existing project or create new
   - Set project name (e.g., "shiras-cakes")
   - Confirm settings

## 🔧 Environment Configuration

### Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Domains"
   - Add your custom domain (e.g., `shirascakes.com`)

2. **Update DNS**:
   - Add CNAME record pointing to your Vercel domain
   - Wait for DNS propagation

### Environment Variables

No environment variables are required for this project, but you can add them in Vercel dashboard if needed for future features.

## 📊 Performance Optimization

The project is already optimized with:

- ✅ Next.js Image optimization
- ✅ Static generation
- ✅ Tailwind CSS purging
- ✅ SEO meta tags
- ✅ Structured data
- ✅ Responsive design

## 🔍 Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify all images display properly
- [ ] Check mobile responsiveness
- [ ] Test all external links (Google Forms, social media)
- [ ] Verify SEO meta tags
- [ ] Test contact forms
- [ ] Check page speed with Lighthouse

## 🛠️ Maintenance

### Updating Content

1. **Edit files locally**:
   - Modify `src/app/page.tsx` for content changes
   - Update images in `public/images/`
   - Change colors in `tailwind.config.ts`

2. **Deploy changes**:
   ```bash
   git add .
   git commit -m "Update content"
   git push
   ```
   Vercel will automatically redeploy.

### Adding New Images

1. **Add to public/images/**:
   ```bash
   cp new-cake.jpg public/images/
   ```

2. **Update gallery** (if needed):
   - Edit the gallery section in `page.tsx`
   - Add new image references

## 📈 Analytics (Optional)

### Google Analytics

1. **Add to layout.tsx**:
   ```tsx
   // Add to <head> section
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script
     dangerouslySetInnerHTML={{
       __html: `
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', 'GA_MEASUREMENT_ID');
       `,
     }}
   />
   ```

### Vercel Analytics

1. **Install package**:
   ```bash
   npm install @vercel/analytics
   ```

2. **Add to layout.tsx**:
   ```tsx
   import { Analytics } from '@vercel/analytics/react';
   
   // Add <Analytics /> to your component
   ```

## 🚨 Troubleshooting

### Build Errors

- **Check Node.js version**: Ensure you're using Node.js 18+
- **Clear cache**: `rm -rf .next && npm run build`
- **Check dependencies**: `npm install`

### Image Issues

- **Verify file paths**: Ensure images are in `public/` directory
- **Check file formats**: Use JPG, PNG, or WebP
- **Optimize images**: Use tools like ImageOptim or TinyPNG

### Performance Issues

- **Check image sizes**: Optimize large images
- **Enable compression**: Vercel handles this automatically
- **Use Next.js Image**: Already implemented

## 📞 Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Contact Vercel Support if needed

---

**Your Shira's Cakes website is now live! 🎂**

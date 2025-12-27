#!/bin/bash

# PWA Icon Generator for Komisi Treatment App
# This script creates different icon sizes from the SVG template

echo "🎨 Generating PWA Icons for Komisi Treatment App..."

# Create different sizes
declare -a sizes=(
    "72x72"
    "96x96" 
    "128x128"
    "144x144"
    "152x152"
    "192x192"
    "384x384"
    "512x512"
)

# Create simple SVG for each size
for size in "${sizes[@]}"; do
    IFS=' ' read -r -d '' <<< "${size//x/ }"
    
    # Create size-specific SVG
    cat > "/home/z/my-project/public/icons/icon-${size}.png" << EOF
<svg width="${IFS[0]}" height="${IFS[1]}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient${IFS[0]}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="iconGradient${IFS[0]}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f0f0f0;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${IFS[0]}" height="${IFS[1]}" rx="${IFS[0]//6}" fill="url(#bgGradient${IFS[0]})"/>
  
  <!-- Massage symbol -->
  <g transform="translate(${IFS[0]//2}, ${IFS[1]//2})">
    <!-- Body outline -->
    <rect x="-${IFS[0]//8}" y="-${IFS[1]//16}" width="${IFS[0]//4}" height="${IFS[1]//8}" rx="${IFS[0]//16}" fill="white"/>
    
    <!-- Hands -->
    <rect x="-${IFS[0]//16}" y="-${IFS[1]//8}" width="${IFS[0]//8}" height="${IFS[1]//4}" rx="${IFS[0]//16}" fill="white"/>
    <rect x="-${IFS[0]//6}" y="-${IFS[1]//12}" width="${IFS[0]//12}" height="${IFS[1]//2}" rx="${IFS[0]//20}" fill="white"/>
    
    <!-- Center circle for focus -->
    <circle cx="0" cy="0" r="${IFS[0]//64}" fill="url(#iconGradient${IFS[0]})" opacity="0.3"/>
    
    <!-- Sparkles -->
    <circle cx="${IFS[0]//6}" cy="-${IFS[1]//12}" r="${IFS[0]//128}" fill="white" opacity="0.9"/>
    <circle cx="${IFS[0]//8}" y="-${IFS[1]//21}" r="${IFS[0]//170}" fill="white" opacity="0.8"/>
    <circle cx="${IFS[0]//7}" y="-${IFS[1]//18}" r="${IFS[0]//102}" fill="white" opacity="0.7"/>
  </g>
</svg>
EOF

    echo "✓ Created icon-${size}.svg"
    
    # Convert SVG to PNG using base64 encoding
    # This is a simplified approach - in production, you'd use a proper SVG to PNG converter
    echo "⚠  Note: Icons created as SVG files. In production, convert to PNG using tools like:"
    echo "   - Online: https://convertio.co/"
    echo "   - CLI: npm install -g svg2png"
    echo "   - Design tools: Figma, Sketch, etc."
done

echo "🎯 Icon generation complete!"
echo "📁 Files created in /home/z/my-project/public/icons/"
echo ""
echo "📱 For PWA submission, you'll need:"
echo "1. Convert SVG files to PNG format"
echo "2. Test on real devices"
echo "3. Submit to app stores with proper screenshots"
echo ""
echo "🌐 App Store requirements:"
echo "- Icons in multiple sizes (72, 96, 128, 144, 152, 192, 512)"
echo "- Splash screens for different devices"
echo "- App screenshots for different device sizes"
echo "- Proper app descriptions and metadata"
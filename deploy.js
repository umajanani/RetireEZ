const { execSync } = require('child_process');
const fs = require('fs');

// Build the app
console.log('Building app...');
execSync('npm run build', { stdio: 'inherit' });

// Create CNAME file for custom domain (optional)
// fs.writeFileSync('./dist/retire-ez/CNAME', 'your-domain.com');

// Create 404.html for SPA routing
fs.copyFileSync('./dist/retire-ez/index.html', './dist/retire-ez/404.html');

console.log('Build complete!');
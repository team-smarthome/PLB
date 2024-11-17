const fs = require('fs');
const path = require('path');

// Function to recursively rename .js files to .jsx in a given folder
function renameExtensions(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading the folder:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(folderPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        if (stats.isDirectory()) {
          // Recursively rename files in subdirectories
          renameExtensions(filePath);
        } else if (path.extname(file) === '.js') {
          // Replace .js extension with .jsx
          const newFilePath = filePath.replace(/\.js$/, '.jsx');

          fs.rename(filePath, newFilePath, err => {
            if (err) {
              console.error('Error renaming file:', err);
            } else {
              console.log(`Renamed: ${filePath} -> ${newFilePath}`);
            }
          });
        }
      });
    });
  });
}

// Folder you want to start renaming files in
const targetFolder = './src/components';

// Run the renaming process
renameExtensions(targetFolder);

// File cleanup monitoring and utilities for production deployment
const fs = require('fs');
const path = require('path');

class FileCleanupMonitor {
  constructor(tempDir = path.join(__dirname, 'temp')) {
    this.tempDir = tempDir;
    this.cleanupStats = {
      totalFilesCreated: 0,
      totalFilesDeleted: 0,
      totalCleanupErrors: 0,
      lastCleanup: null,
      currentTempFiles: 0
    };
  }

  // Get current statistics
  getStats() {
    try {
      if (fs.existsSync(this.tempDir)) {
        const files = fs.readdirSync(this.tempDir);
        this.cleanupStats.currentTempFiles = files.length;
      }
      return this.cleanupStats;
    } catch (error) {
      console.error('Error getting cleanup stats:', error);
      return this.cleanupStats;
    }
  }

  // Log file creation
  logFileCreation(filename) {
    this.cleanupStats.totalFilesCreated++;
    console.log(`[FILE MONITOR] Created: ${filename} (Total created: ${this.cleanupStats.totalFilesCreated})`);
  }

  // Log file deletion
  logFileDeletion(filename) {
    this.cleanupStats.totalFilesDeleted++;
    console.log(`[FILE MONITOR] Deleted: ${filename} (Total deleted: ${this.cleanupStats.totalFilesDeleted})`);
  }

  // Log cleanup error
  logCleanupError(filename, error) {
    this.cleanupStats.totalCleanupErrors++;
    console.error(`[FILE MONITOR] Cleanup error for ${filename}:`, error);
  }

  // Force cleanup of all temporary files
  forceCleanup() {
    try {
      if (!fs.existsSync(this.tempDir)) {
        console.log('[FILE MONITOR] Temp directory does not exist, nothing to clean');
        return;
      }

      const files = fs.readdirSync(this.tempDir);
      let cleanedCount = 0;

      files.forEach(file => {
        const filePath = path.join(this.tempDir, file);
        try {
          fs.unlinkSync(filePath);
          cleanedCount++;
          this.logFileDeletion(file);
        } catch (error) {
          this.logCleanupError(file, error);
        }
      });

      this.cleanupStats.lastCleanup = new Date();
      console.log(`[FILE MONITOR] Force cleanup completed. Cleaned ${cleanedCount} files`);
    } catch (error) {
      console.error('[FILE MONITOR] Force cleanup failed:', error);
    }
  }

  // Get detailed file information
  getFileDetails() {
    try {
      if (!fs.existsSync(this.tempDir)) {
        return [];
      }

      const files = fs.readdirSync(this.tempDir);
      return files.map(file => {
        const filePath = path.join(this.tempDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          age: Date.now() - stats.mtime.getTime()
        };
      });
    } catch (error) {
      console.error('[FILE MONITOR] Error getting file details:', error);
      return [];
    }
  }

  // Start monitoring (optional - for debugging)
  startMonitoring(intervalMs = 60000) { // Check every minute
    setInterval(() => {
      const stats = this.getStats();
      console.log('[FILE MONITOR] Current stats:', stats);
      
      if (stats.currentTempFiles > 10) {
        console.warn('[FILE MONITOR] Warning: High number of temporary files detected');
      }
    }, intervalMs);
  }
}

// Export singleton instance
module.exports = new FileCleanupMonitor();

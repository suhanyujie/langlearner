package storage

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"langlearner1/backend/types"
	"os"
	"path/filepath"
	"sync"
)

// DB is the global database instance
var DB *gorm.DB

// once ensures InitDB is called only once
var once sync.Once

// InitDB initializes the database connection
func InitDB(dbPath string) error {
	var initErr error
	once.Do(func() {
		// Ensure the directory exists
		dir := filepath.Dir(dbPath)
		if err := os.MkdirAll(dir, 0755); err != nil {
			initErr = err
			return
		}

		// Open database connection
		db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
		if err != nil {
			initErr = err
			return
		}

		DB = db

		// Auto migrate database schemas
		if err := DB.AutoMigrate(&types.Tag{}, &types.Note{}); err != nil {
			initErr = err
			return
		}
	})
	return initErr
}

package storage

import (
	"langlearner1/backend/types"
)

// SQLiteTagStorage implements TagStorage interface with SQLite storage
type SQLiteTagStorage struct {}

// NewSQLiteTagStorage creates a new instance of SQLiteTagStorage
func NewSQLiteTagStorage() TagStorage {
	return &SQLiteTagStorage{}
}

// List returns tags with optional id and keyword filters, supports pagination
func (s *SQLiteTagStorage) List(id int, keyword string, offset int, limit int) ([]types.Tag, error) {
	var tags []types.Tag
	db := DB
	if id > 0 {
		db = db.Where("id = ?", id)
	}
	if keyword != "" {
		db = db.Where("name LIKE ?", "%"+keyword+"%")
	}
	result := db.Offset(offset).Limit(limit).Find(&tags)
	return tags, result.Error
}

// Create creates a new tag
func (s *SQLiteTagStorage) Create(tag *types.Tag) error {
	result := DB.Create(tag)
	return result.Error
}

// Update updates an existing tag
func (s *SQLiteTagStorage) Update(tag *types.Tag) error {
	result := DB.Save(tag)
	if result.RowsAffected == 0 {
		return types.ErrTagNotFound
	}
	return result.Error
}

// Delete deletes a tag
func (s *SQLiteTagStorage) Delete(id int) error {
	result := DB.Delete(&types.Tag{}, id)
	if result.RowsAffected == 0 {
		return types.ErrTagNotFound
	}
	return result.Error
}

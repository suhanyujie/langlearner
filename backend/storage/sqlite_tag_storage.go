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

// List returns all tags
func (s *SQLiteTagStorage) List() ([]types.Tag, error) {
	var tags []types.Tag
	result := DB.Find(&tags)
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

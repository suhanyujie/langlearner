package storage

import (
	"langlearner1/backend/types"
)

// SQLiteNoteStorage implements NoteStorageIf interface with SQLite storage
type SQLiteNoteStorage struct{}

// NewSQLiteNoteStorage creates a new instance of SQLiteNoteStorage
func NewSQLiteNoteStorage() NoteStorageIf {
	return &SQLiteNoteStorage{}
}

// List returns notes with optional id and keyword filters, supports pagination
func (s *SQLiteNoteStorage) List(id int, keyword string, offset int, limit int) ([]types.Note, error) {
	var notes []types.Note
	db := DB
	if id > 0 {
		db = db.Where("id = ?", id)
	}
	if keyword != "" {
		db = db.Where("front LIKE ? OR back LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
	}
	result := db.Preload("Tags").Order("updated_at desc").Offset(offset).Limit(limit).Find(&notes)
	return notes, result.Error
}

// Create creates a new note
func (s *SQLiteNoteStorage) Create(note *types.Note) error {
	result := DB.Create(note)
	return result.Error
}

// Update updates an existing note
func (s *SQLiteNoteStorage) Update(note *types.Note) error {
	result := DB.Save(note)
	if result.RowsAffected == 0 {
		return types.ErrNoteNotFound
	}
	return result.Error
}

// Delete deletes a note
func (s *SQLiteNoteStorage) Delete(id int) error {
	result := DB.Delete(&types.Note{}, id)
	if result.RowsAffected == 0 {
		return types.ErrNoteNotFound
	}
	return result.Error
}

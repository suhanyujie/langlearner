package storage

import (
	"langlearner1/backend/types"
)

// NoteStorageIf defines the interface for note data persistence
type NoteStorageIf interface {
	// List returns notes with optional id and keyword filters, supports pagination
	List(id int, keyword string, offset int, limit int) ([]types.Note, error)
	// Create creates a new note
	Create(note *types.Note) error
	// Update updates an existing note
	Update(note *types.Note) error
	// Delete deletes a note
	Delete(id int) error
}

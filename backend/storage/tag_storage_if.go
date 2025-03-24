package storage

import (
	"langlearner1/backend/types"
)

// TagStorage defines the interface for tag data persistence
type TagStorage interface {
	// List returns tags with optional id and keyword filters, supports pagination
	List(id int, keyword string, offset int, limit int) ([]types.Tag, error)
	// Create creates a new tag
	Create(tag *types.Tag) error
	// Update updates an existing tag
	Update(tag *types.Tag) error
	// Delete deletes a tag
	Delete(id int) error
}

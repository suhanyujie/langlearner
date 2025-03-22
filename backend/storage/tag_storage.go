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

// MemoryTagStorage implements TagStorage interface with in-memory storage
type MemoryTagStorage struct {
	tags []types.Tag
}

// NewMemoryTagStorage creates a new instance of MemoryTagStorage
func NewMemoryTagStorage() TagStorage {
	return &MemoryTagStorage{
		tags: make([]types.Tag, 0),
	}
}

// List returns all tags
func (s *MemoryTagStorage) List(id int, keyword string, offset int, limit int) ([]types.Tag, error) {
	return s.tags, nil
}

// Create creates a new tag
func (s *MemoryTagStorage) Create(tag *types.Tag) error {
	// Set new ID
	tag.ID = len(s.tags) + 1
	s.tags = append(s.tags, *tag)
	return nil
}

// Update updates an existing tag
func (s *MemoryTagStorage) Update(tag *types.Tag) error {
	for i, t := range s.tags {
		if t.ID == tag.ID {
			s.tags[i] = *tag
			return nil
		}
	}
	return types.ErrTagNotFound
}

// Delete deletes a tag
func (s *MemoryTagStorage) Delete(id int) error {
	for i, tag := range s.tags {
		if tag.ID == id {
			s.tags = append(s.tags[:i], s.tags[i+1:]...)
			return nil
		}
	}
	return types.ErrTagNotFound
}

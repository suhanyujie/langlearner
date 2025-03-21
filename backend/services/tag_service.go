package services

import (
	"context"
	"errors"
	"math"
	"strings"

	"langlearner1/backend/storage"
	"langlearner1/backend/types"
)

// TagServiceImpl implements the TagService interface
type TagServiceImpl struct {
	ctx     context.Context
	storage storage.TagStorage
}

// NewTagService creates a new instance of TagService
func NewTagService() types.TagService {
	return &TagServiceImpl{
		storage: storage.NewSQLiteTagStorage(),
	}
}

func (s *TagServiceImpl) Start(ctx context.Context) {
	s.ctx = ctx
}

// List returns a paginated list of tags
func (s *TagServiceImpl) List(page, pageSize int, keyword string) (*types.TagList, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	// Get all tags from storage
	tags, err := s.storage.List()
	if err != nil {
		return nil, err
	}

	// Filter tags by keyword
	filteredTags := make([]types.Tag, 0)
	for _, tag := range tags {
		if keyword == "" || strings.Contains(strings.ToLower(tag.Name), strings.ToLower(keyword)) {
			filteredTags = append(filteredTags, tag)
		}
	}

	total := len(filteredTags)
	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))

	// Calculate pagination bounds
	start := (page - 1) * pageSize
	end := start + pageSize
	if end > total {
		end = total
	}

	// Get paginated data
	var data []types.Tag
	if start < total {
		data = filteredTags[start:end]
	} else {
		data = []types.Tag{}
	}

	return &types.TagList{
		Total:       total,
		TotalPages:  totalPages,
		CurrentPage: page,
		PageSize:    pageSize,
		Data:        data,
	}, nil
}

// Create creates a new tag
func (s *TagServiceImpl) Create(name string) (*types.Tag, error) {
	if name == "" {
		return nil, errors.New("tag name cannot be empty")
	}

	// Create new tag
	newTag := &types.Tag{Name: name}
	err := s.storage.Create(newTag)
	if err != nil {
		return nil, err
	}

	return newTag, nil
}

// Update updates an existing tag
func (s *TagServiceImpl) Update(id int, name string) (*types.Tag, error) {
	if name == "" {
		return nil, errors.New("tag name cannot be empty")
	}

	// Update tag
	updatedTag := &types.Tag{ID: id, Name: name}
	err := s.storage.Update(updatedTag)
	if err != nil {
		return nil, err
	}

	return updatedTag, nil
}

// Delete deletes a tag
func (s *TagServiceImpl) Delete(id int) error {
	return s.storage.Delete(id)
}

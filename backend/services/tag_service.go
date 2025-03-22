package services

import (
	"context"
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
func (s *TagServiceImpl) List(page, pageSize int, keyword string) (resp types.JSResp) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}
	offset := (page - 1) * pageSize
	// Get all tags from storage
	tags, err := s.storage.List(0, keyword, offset, pageSize)
	if err != nil {
		resp.Msg = err.Error()
		return
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
	resp.Success = 1
	resp.Data = &types.TagList{
		Total:       total,
		TotalPages:  totalPages,
		CurrentPage: page,
		PageSize:    pageSize,
		Data:        data,
	}
	return
}

// Create creates a new tag
func (s *TagServiceImpl) Create(name string) (resp types.JSResp) {
	if name == "" {
		resp.Msg = "tag name cannot be empty"
		return
	}

	// Create new tag
	newTag := &types.Tag{Name: name}
	err := s.storage.Create(newTag)
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint") {
			resp.Msg = "标签已存在"
			return
		}
		resp.Msg = err.Error()
		return
	}
	resp.Success = 1
	resp.Data = newTag
	return
}

// Update updates an existing tag
func (s *TagServiceImpl) Update(id int, name string) (resp types.JSResp) {
	if name == "" {
		resp.Msg = "tag name cannot be empty"
		return
	}

	// Update tag
	updatedTag := &types.Tag{ID: id, Name: name}
	err := s.storage.Update(updatedTag)
	if err != nil {
		resp.Msg = err.Error()
		return
	}
	resp.Success = 1
	resp.Data = updatedTag
	return
}

// Delete deletes a tag
func (s *TagServiceImpl) Delete(id int) (resp types.JSResp) {
	err := s.storage.Delete(id)
	if err != nil {
		resp.Msg = err.Error()
		return
	}

	resp.Success = 1
	return
}

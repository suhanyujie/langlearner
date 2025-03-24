package services

import (
	"context"
	"langlearner1/backend/storage"
	"langlearner1/backend/types"
	"math"
	"strings"
)

// NoteServiceImpl implements the NoteService interface
type NoteServiceImpl struct {
	ctx     context.Context
	storage storage.NoteStorageIf
}

// NewNoteServiceImpl creates a new instance of NoteService
func NewNoteServiceImpl() types.NoteServiceIf {
	return &NoteServiceImpl{
		storage: storage.NewSQLiteNoteStorage(),
	}
}

func (s *NoteServiceImpl) Start(ctx context.Context) {
	s.ctx = ctx
}

// List returns a paginated list of tags
func (s *NoteServiceImpl) List(page, pageSize int, keyword string) (resp types.JSResp) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}
	offset := (page - 1) * pageSize
	// Get all list from storage
	list, err := s.storage.List(0, keyword, offset, pageSize)
	if err != nil {
		resp.Msg = err.Error()
		return
	}

	// Filter list by keyword
	filteredNotes := make([]types.Note, 0)
	for _, item := range list {
		if keyword == "" || strings.Contains(strings.ToLower(item.Front), strings.ToLower(keyword)) {
			filteredNotes = append(filteredNotes, item)
		}
	}

	total := len(filteredNotes)
	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))

	// Calculate pagination bounds
	start := (page - 1) * pageSize
	end := start + pageSize
	if end > total {
		end = total
	}

	// Get paginated data
	var data []types.Note
	if start < total {
		data = filteredNotes[start:end]
	} else {
		data = []types.Note{}
	}
	resp.Success = 1
	resp.Data = &types.NoteList{
		Total:       total,
		TotalPages:  totalPages,
		CurrentPage: page,
		PageSize:    pageSize,
		Data:        data,
	}
	return
}

// Create creates a new tag
func (s *NoteServiceImpl) Create(name string) (resp types.JSResp) {
	if name == "" {
		resp.Msg = "tag name cannot be empty"
		return
	}

	// Create new tag
	newNote := &types.Note{Front: name}
	err := s.storage.Create(newNote)
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint") {
			resp.Msg = "标签已存在"
			return
		}
		resp.Msg = err.Error()
		return
	}
	resp.Success = 1
	resp.Data = newNote
	return
}

// Update updates an existing tag
func (s *NoteServiceImpl) Update(id int, frontCont, backCont string) (resp types.JSResp) {
	if frontCont == "" {
		resp.Msg = "tag frontCont cannot be empty"
		return
	}

	// Update tag
	updatedNote := &types.Note{ID: id, Front: frontCont}
	if backCont != "" {
		updatedNote.Back = backCont
	}
	err := s.storage.Update(updatedNote)
	if err != nil {
		resp.Msg = err.Error()
		return
	}
	resp.Success = 1
	resp.Data = updatedNote
	return
}

// Delete deletes a tag
func (s *NoteServiceImpl) Delete(id int) (resp types.JSResp) {
	err := s.storage.Delete(id)
	if err != nil {
		resp.Msg = err.Error()
		return
	}

	resp.Success = 1
	return
}

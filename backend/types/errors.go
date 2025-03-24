package types

import "errors"

// Common errors for tag operations
var (
	ErrTagNotFound  = errors.New("tag not found")
	ErrTagNameEmpty = errors.New("tag name cannot be empty")
	ErrTagExists    = errors.New("tag already exists")
	ErrTagInUse     = errors.New("tag is in use")

	ErrInvalidPageNum = errors.New("invalid page number")

	ErrNoteNotFound  = errors.New("Note not found")
	ErrNoteNameEmpty = errors.New("Note name cannot be empty")
	ErrNoteExists    = errors.New("Note already exists")
	ErrNoteInUse     = errors.New("Note is in use")
)

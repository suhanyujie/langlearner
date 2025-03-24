package main

import (
	"context"
	"embed"
	"langlearner1/backend/services"
	"langlearner1/backend/storage"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Initialize database
	if err := storage.InitDB("data/langlearner.db"); err != nil {
		panic(err)
	}

	// Create instance of the app service
	tagSvc := services.NewTagService()
	noteSvc := services.NewNoteServiceImpl()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "langlearner1",
		Width:  900,
		Height: 600,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: func(ctx context.Context) {
			tagSvc.(*(services.TagServiceImpl)).Start(ctx)
			noteSvc.(*(services.NoteServiceImpl)).Start(ctx)
		},
		Bind: []interface{}{
			tagSvc,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

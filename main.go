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

	// Create an instance of the app structure
	app := NewApp()

	tagSvc := services.NewTagService()
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
		},
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

vim.api.nvim_create_autocmd("BufWritePost", {
	pattern = "*.ts",
	callback = function()
		vimux_run_command("bun run build")
	end,
})

vim.notify("Sourced Popup Engine")

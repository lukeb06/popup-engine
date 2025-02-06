vim.api.nvim_create_autocmd("BufWritePost", {
	pattern = "*.ts",
	callback = function()
		vimux_run_command("bun run build")
	end,
})

vimux_run_command("python3 -m http.server 5500")

local function start_up_func()
	vim.cmd(":VimuxTogglePane")
	local timer = vim.loop.new_timer()
	timer:start(
		2000,
		0,
		vim.schedule_wrap(function()
			vim.cmd(":!open http://localhost:5500")
			vim.cmd(":VimuxOpenRunner")
		end)
	)
end
local function delayed_start_up_func()
	local timer = vim.loop.new_timer()
	timer:start(1000, 0, vim.schedule_wrap(start_up_func))
end
delayed_start_up_func()

((Get-Content -path index.js -Raw) -replace './opt', '/opt') | Set-Content -Path index.js.tmp

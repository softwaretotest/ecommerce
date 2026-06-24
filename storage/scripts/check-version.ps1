$output = "version.md"

$about = php artisan about --json | ConvertFrom-Json

try {
$postgres = (psql --version) -join " "
}
catch {
$postgres = "Not Installed"
}

@"
Generated  : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

PHP        : $($about.environment.php_version)
Composer   : $($about.environment.composer_version)
Laravel    : $($about.environment.laravel_version)
Node       : $(node -v)
NPM        : $(npm -v)
Git        : $((git --version) -replace 'git version ', '')
PostgreSQL : $postgres

Database   : $($about.drivers.database)
Cache      : $($about.drivers.cache)
Queue      : $($about.drivers.queue)
Session    : $($about.drivers.session)
Mail       : $($about.drivers.mail)

Environment: $($about.environment.environment)
Debug      : $($about.environment.debug_mode)
Timezone   : $($about.environment.timezone)
Locale     : $($about.environment.locale)

Storage    : $($about.storage.PSObject.Properties.Name)
"@ | Out-File $output -Encoding utf8

Write-Host "Generated: $output"

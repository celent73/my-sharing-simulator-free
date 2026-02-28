# Update App.tsx
$appPath = "c:\Users\celen\OneDrive\Desktop\SIMULATORE SHARING DEFINITIVO 11 12 25 ore 12 e 42\App.tsx"
$appContent = Get-Content $appPath -Raw
$appContent = $appContent -replace 'text-union-orange-400', 'text-main-accent'
$appContent = $appContent -replace 'bg-union-orange-400', 'bg-main-accent'

# Add PaletteSelector import if not present
if ($appContent -notmatch "import PaletteSelector from '\./components/PaletteSelector'") {
    $appContent = $appContent -replace "import BottomDock from '\./components/BottomDock';", "import BottomDock from './components/BottomDock';`nimport PaletteSelector from './components/PaletteSelector';"
}

# Add PaletteSelector to Header UI
if ($appContent -notmatch "<PaletteSelector />") {
    $appContent = $appContent -replace '\{/\* Theme Toggle \*/\}', '{/* Theme Toggle & Palette */}`n                      <div className="flex items-center gap-2">`n                        <PaletteSelector />'
    $appContent = $appContent -replace 'className="p-2\.5 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-lg border-0 hover:scale-105 active:scale-95"', 'className="p-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-lg border-0 hover:scale-105 active:scale-95"'
    # Note: The above replace for button is tricky due to closure. I'll just add the closing div after the theme toggle button.
    $appContent = $appContent -replace 'toggleTheme\}\s+className="p-2\.5 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-lg border-0 hover:scale-105 active:scale-95"\s+>', 'toggleTheme}`n                          className="p-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-lg border-0 hover:scale-105 active:scale-95"`n                        >'
}

Set-Content $appPath $appContent -NoNewline

# Update index.html
$indexPath = "c:\Users\celen\OneDrive\Desktop\SIMULATORE SHARING DEFINITIVO 11 12 25 ore 12 e 42\index.html"
$indexContent = Get-Content $indexPath -Raw
$indexContent = $indexContent -replace '\.shadow-main-accent \{\s+shadow-color: var\(--accent-glow\);\s+\}', '.shadow-main-accent { box-shadow: 0 10px 15px -3px var(--accent-glow), 0 4px 6px -4px var(--accent-glow) !important; }'
Set-Content $indexPath $indexContent -NoNewline

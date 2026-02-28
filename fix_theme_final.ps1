$appPath = "c:\Users\celen\OneDrive\Desktop\SIMULATORE SHARING DEFINITIVO 11 12 25 ore 12 e 42\App.tsx"
$indexPath = "c:\Users\celen\OneDrive\Desktop\SIMULATORE SHARING DEFINITIVO 11 12 25 ore 12 e 42\index.html"

# Update App.tsx Imports
$content = Get-Content $appPath -Raw
if ($content -notmatch "import PaletteSelector from '\./components/PaletteSelector'") {
    $content = $content -replace "import BottomDock from '\./components/BottomDock';", "import BottomDock from './components/BottomDock';`nimport PaletteSelector from './components/PaletteSelector';"
}

# Update App.tsx UI
$content = $content -replace 'text-union-orange-400', 'text-main-accent'
if ($content -notmatch "<PaletteSelector />") {
    $content = $content -replace '\{/\* 1\. THEME TOGGLE \*/\}', '<PaletteSelector />`n              {/* 1. THEME TOGGLE */}'
}
Set-Content $appPath $content -NoNewline

# Update index.html
$content = Get-Content $indexPath -Raw
$content = $content -replace 'shadow-color: var\(--accent-glow\);', 'box-shadow: 0 10px 15px -3px var(--accent-glow), 0 4px 6px -4px var(--accent-glow);'
Set-Content $indexPath $content -NoNewline

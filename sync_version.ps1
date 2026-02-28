$files = @(
    "c:\Users\celen\OneDrive\Desktop\SIMULATORE SHARING DEFINITIVO 11 12 25 ore 12 e 42\components\LegalFooter.tsx",
    "c:\Users\celen\OneDrive\Desktop\SIMULATORE SHARING DEFINITIVO 11 12 25 ore 12 e 42\components\NetworkVisualizerModal.tsx"
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $c = Get-Content $f -Raw
        $c = $c -replace 'v1\.2\.24', 'v1.2.25'
        Set-Content $f $c -NoNewline
        Write-Host "Updated $f"
    }
}

import fs from 'fs';
import path from 'path';

const targetFiles = [
    'utils/translations.ts',
    'components/CustomerBenefitCard.tsx',
    'components/BottomDock.tsx',
    'components/DesktopHeaderNav.tsx',
    'hooks/useSimulation.ts',
    'COPYRIGHT_DEPOSIT_2024/utils/translations.ts',
    'COPYRIGHT_DEPOSIT_2024/components/CondoResultsDisplay.tsx'
];

const basePath = 'C:\\Users\\celen\\OneDrive\\Desktop\\My Sharing Simulator';

const replacements = [
    // Partner Sharing
    { regex: /Partner Sharing \(FU\)/g, replacement: 'Family Utility' },
    { regex: /Partner Sharings \(FU\)/g, replacement: 'Family Utility' },
    { regex: /Partner Sharing \(Direkt\)/g, replacement: 'Family Utility (Direkt)' },
    { regex: /Partner Sharing/g, replacement: 'Family Utility' },
    { regex: /Partner Sharings/g, replacement: 'Family Utility' },

    // Cliente semplice
    { regex: /Cliente Semplice/g, replacement: 'Cliente Privilegiato' },
    { regex: /Cliente semplice/g, replacement: 'Cliente privilegiato' },
    { regex: /cliente semplice/g, replacement: 'cliente privilegiato' },

    // Azzeriamola e Union
    { regex: /Contratto Green/g, replacement: 'Azzeriamola Green' },
    { regex: /Contratto Light/g, replacement: 'Union Light' },
    { regex: /contratto Green/g, replacement: 'Azzeriamola Green' },
    { regex: /contratto Light/g, replacement: 'Union Light' },
    { regex: /Contratti Green/g, replacement: 'Azzeriamola Green' },
    { regex: /Contratti Light/g, replacement: 'Union Light' },
    { regex: /contratti Green/g, replacement: 'Azzeriamola Green' },
    { regex: /contratti Light/g, replacement: 'Union Light' }
];

for (const relPath of targetFiles) {
    const fullPath = path.join(basePath, relPath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let original = content;
        for (const r of replacements) {
            content = content.replace(r.regex, r.replacement);
        }
        if (content !== original) {
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Updated: ${relPath}`);
        } else {
            console.log(`No changes needed in: ${relPath}`);
        }
    } else {
        console.log(`File not found: ${relPath}`);
    }
}

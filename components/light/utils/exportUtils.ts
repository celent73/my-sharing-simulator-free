import { toPng } from 'html-to-image';

export const exportAsImage = async (elementId: string, fileName: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const filter = (node: HTMLElement) => {
        const exclusionClasses = ['no-export'];
        return !exclusionClasses.some(cls => node.classList?.contains(cls));
    };

    try {
        const dataUrl = await toPng(element, {
            cacheBust: true,
            backgroundColor: '#f8fafc',
            filter: filter as any,
            pixelRatio: 2,
            style: {
                borderRadius: '0',
                padding: '20px'
            }
        });
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Error exporting image:', err);
    }
};

/**
 * 1.3.32 Calendar Integration Utilities
 * Supports Google Calendar links and .ics file generation.
 */

export const generateGoogleCalendarLink = (title: string, date: string | Date): string => {
    const startDate = new Date(date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1h duration

    const formatGDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
    
    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams({
        text: title,
        dates: `${formatGDate(startDate)}/${formatGDate(endDate)}`,
        details: 'Appuntamento fissato tramite AI Sales Copilot',
        location: '',
        sf: 'true',
        output: 'xml'
    });

    return `${baseUrl}&${params.toString()}`;
};

/**
 * Generates a basic .ics file content for Apple/Outlook calendar.
 */
export const generateICSContent = (title: string, date: string | Date): string => {
    const startDate = new Date(date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const formatICSDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${formatICSDate(startDate)}`,
        `DTEND:${formatICSDate(endDate)}`,
        `SUMMARY:${title}`,
        'DESCRIPTION:Appuntamento fissato tramite AI Sales Copilot',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');
};

export const downloadICS = (title: string, date: string | Date) => {
    const content = generateICSContent(title, date);
    const blob = new Blob([content], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

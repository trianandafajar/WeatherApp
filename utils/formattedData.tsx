// 17:05
export const formatTime = (dateString: string | undefined): string => {
    if (!dateString) return '';

    // Ensure the date string is in ISO format by replacing the space with "T"
    const formattedDateString = dateString.replace(' ', 'T');
    const date = new Date(formattedDateString);

    if (isNaN(date.getTime())) return ''; // Handle invalid date parsing

    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};

// Monday
export const formatDay = (dayName: string): string => {
    const date = new Date(dayName);

    return date.toLocaleDateString('en-US', {
        weekday: 'long',
    });
}

// December 03
export const formatMonthDate = (localtime: string): string => {
    const date = new Date(localtime.replace(" ", "T"));

    const formatter = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "2-digit",
    });

    return formatter.format(date);
};

// Tuesday, December 03, 2024
export const formatDateDay = (localtime: string): string => {
    const date = new Date(localtime.replace(" ", "T"));

    const formatter = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
    });

    return formatter.format(date);
};
// Helper: Convert string ke Date dengan validasi
const parseDate = (input?: string): Date | null => {
    if (!input) return null;
    const date = new Date(input.replace(" ", "T"));
    return isNaN(date.getTime()) ? null : date;
  };
  
  // 17:05
  export const formatTime = (dateString?: string): string => {
    const date = parseDate(dateString);
    if (!date) return "";
  
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  
  // Monday
  export const formatDay = (dateString: string): string => {
    const date = parseDate(dateString);
    if (!date) return "";
  
    return date.toLocaleDateString("en-US", {
      weekday: "long",
    });
  };
  
  // December 03
  export const formatMonthDate = (dateString: string): string => {
    const date = parseDate(dateString);
    if (!date) return "";
  
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
    });
  };
  
  // Tuesday, December 03, 2024
  export const formatDateDay = (dateString: string): string => {
    const date = parseDate(dateString);
    if (!date) return "";
  
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };
  
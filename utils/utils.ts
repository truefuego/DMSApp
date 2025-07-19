export function formatToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export function isImage(url: string): boolean {
    return /\.(png|jpe?g|gif|bmp|webp)$/i.test(url.split('?')[0]);
}

export function isPdf(url: string): boolean {
    return /\.pdf$/i.test(url.split('?')[0]);
}
  
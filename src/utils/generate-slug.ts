export function generateSlug(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}


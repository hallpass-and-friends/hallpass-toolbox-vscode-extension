export function parseError(error: unknown): string {
    if ((error instanceof Error && error.message) || (typeof error === 'object' && error !== null && 'message' in error)) {
        return (error as { message: string }).message;
    } else if (typeof error === 'string') {
        return error;
    } else {
        return 'An unknown error occurred';
    }
}
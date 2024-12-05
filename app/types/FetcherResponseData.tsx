export interface IFetcherResponseMessage {
    success: boolean;
    message: string;
    variant: 'error' | 'info' | 'warning' | 'success';
}

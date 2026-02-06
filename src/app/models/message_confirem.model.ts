export interface I_ConfirmState {
  title: string;
  message: string;
  resolve: (val: boolean) => void;
}

export interface I_MessageState {
  title: string;
  message: string;
  type?: 'danger' | 'success' | 'warn';
  autoclose?: boolean;
  openTime?: number;
}

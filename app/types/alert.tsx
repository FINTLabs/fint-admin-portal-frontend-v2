interface IAlertType {
    id: number;
    message: string;
    header?: string; // Optional header for the alert
    variant: string;
}

// interface IAlertStackProps {
//     alerts: IAlertType[];
//     removeAlert: (id: number) => void;
// }

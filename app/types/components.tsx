export interface IComponent {
    dn?: string;
    name: string;
    description: string;
    organisations?: string[];
    clients?: string[];
    adapters?: string[];
    inBeta: boolean;
    inProduction: boolean;
    inPlayWithFint: boolean;
    core: boolean;
    openData: boolean;
    common: boolean;
    basePath: string;
}

export interface IOrganisation {
    dn?: string;
    name: string;
    orgNumber: string;
    displayName: string;
    components?: string[];
    legalContact?: string;
    techicalContacts?: string[];
    k8sSize?: number | null;
    customer?: boolean;
    primaryAssetId?: string;
}

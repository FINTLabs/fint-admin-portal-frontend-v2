import { Link, useLocation } from 'react-router';
import { ChevronRightIcon, HouseIcon } from '@navikt/aksel-icons';
import { IBreadcrumb } from '~/types/breadcrumb';

interface BreadcrumbsProps {
    breadcrumbs: IBreadcrumb[];
}

export default function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
    const homeLink = '/';
    const linkStyle = { textDecoration: 'none', display: 'flex', alignItems: 'center' };
    const location = useLocation();
    const currentPath = location.pathname;

    const crumbs = breadcrumbs.map(({ name, link }) => (
        <div key={link} className="flex items-center">
            <ChevronRightIcon title="Spacer" className="mx-1" />

            {link === '' || link === currentPath ? (
                <>{name}</>
            ) : (
                <Link to={link} style={linkStyle}>
                    {name}
                </Link>
            )}
        </div>
    ));

    return (
        <div className="flex items-center align-center p-3">
            <Link to={homeLink} style={linkStyle} className="!flex !items-start">
                <HouseIcon title="dashboard" className="mt-[1.5px] " />
                <span className="">{'Dashboard'}</span>
            </Link>
            {crumbs}
        </div>
    );
}

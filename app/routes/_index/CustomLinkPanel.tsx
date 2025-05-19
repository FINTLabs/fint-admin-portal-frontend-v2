import React from 'react';
import { LinkPanel, BodyLong } from '@navikt/ds-react';

interface CustomLinkPanelProps {
    href: string;
    title: string;
    IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    description?: string;
}

const CustomLinkPanel: React.FC<CustomLinkPanelProps> = ({
    href,
    title,
    IconComponent,
    description,
}) => {
    return (
        <LinkPanel
            key={title}
            border
            className={'my-custom-panel'}
            href={href}
            data-cy={`${title}-link-panel`}>
            <LinkPanel.Title className={`panel-title`}>
                <IconComponent aria-hidden className={`panel-icon`} />
                {title}
            </LinkPanel.Title>
            {description && <BodyLong className={`panel-description`}>{description}</BodyLong>}
        </LinkPanel>
    );
};

export default CustomLinkPanel;

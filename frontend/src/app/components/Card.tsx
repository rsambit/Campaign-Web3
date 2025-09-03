'use client'

import { Shimmer, Spinner, Text } from "@fluentui/react";

export interface ICardProps {
    width?: string | number;
    height?: string | number;
    isLoading: boolean;
    onClick?: () => {}
    title: string;
    titleColor?: string;
}

export const Card = (props: React.PropsWithChildren<ICardProps>) => {

    const width = props.width || 200;
    const height = props.height || 100;

    const handleClick = () => {
        if (!props.isLoading) {
            props.onClick?.();
        } 
    }

    return (
        <>
            <div className={`w-${width} h-${height} rounded-2xl p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300`}>
                <div onClick={handleClick}>
                    <div style={{ marginTop: 10 }}>
                        <Text variant="large" block nowrap style={{ color: props.titleColor}}>
                            {props.title}
                        </Text>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        { props.isLoading && <Shimmer width={100} height={20} />}
                        { !props.isLoading && props.children}
                    </div>
                </div>
            </div>
        </>
    );
}

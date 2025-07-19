
"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Gem } from 'lucide-react';
import type { Bead } from '@/ai/schemas/design-schemas';

interface Bracelet3DPreviewProps {
    beads?: Bead[];
}

const colorNameToHex = (colorName: string): string => {
    const lowerColor = (colorName || "grey").toLowerCase();
    const colorMap: Record<string, string> = {
        pink: 'hsl(var(--accent))',
        lightpink: 'hsl(var(--accent) / 0.8)',
        rosepink: 'hsl(var(--accent) / 0.9)',
        palepink: 'hsl(var(--accent) / 0.7)',
        purple: 'hsl(var(--secondary))',
        lavender: 'hsl(var(--secondary) / 0.6)',
        deeppurple: 'hsl(var(--secondary) / 1.2)',
        lilac: 'hsl(var(--secondary) / 0.8)',
        clear: 'hsl(var(--background))',
        white: 'hsl(var(--background))',
        yellow: 'hsl(var(--warning))',
        goldenyellow: 'hsl(var(--warning) / 0.9)',
        orangeyellow: 'hsl(var(--warning) / 1.1)',
        brownishyellow: 'hsl(var(--warning) / 0.7)',
        bluesheen: 'hsl(var(--primary) / 0.8)',
        rainbow: 'linear-gradient(to right, hsl(var(--destructive)), hsl(var(--warning)), hsl(var(--success)), hsl(var(--primary)), hsl(var(--secondary)))',
        peach: 'hsl(var(--accent) / 0.6)',
        grey: 'hsl(var(--muted-foreground))',
        'grey-green': 'hsl(var(--muted-foreground) / 0.8)',
        darkgrey: 'hsl(var(--muted-foreground) / 1.2)',
        black: 'hsl(var(--foreground))',
        blueflash: 'hsl(var(--primary))',
        greenflash: 'hsl(var(--success))',
        goldflash: 'hsl(var(--warning))',
        rainbowflash: 'linear-gradient(to right, hsl(var(--warning)), hsl(var(--accent)), hsl(var(--primary)))',
        lightbrown: 'hsl(var(--warning) / 0.7)',
        darkbrown: 'hsl(var(--warning) / 0.5)',
        greyishbrown: 'hsl(var(--muted-foreground) / 0.8)',
        blackishbrown: 'hsl(var(--foreground) / 0.7)',
        deepblue: 'hsl(var(--primary) / 1.2)',
        royalblue: 'hsl(var(--primary))',
        azureblue: 'hsl(var(--primary) / 0.3)',
        'bluewithgoldflecks': 'hsl(var(--primary))',
        skyblue: 'hsl(var(--primary) / 0.6)',
        bluegreen: 'hsl(var(--primary) / 0.8)',
        green: 'hsl(var(--success))',
        'robinseggblue': 'hsl(var(--primary) / 0.7)',
        deepred: 'hsl(var(--destructive) / 1.2)',
        reddishbrown: 'hsl(var(--destructive) / 0.8)',
        orange: 'hsl(var(--warning))',
        redpurple: 'hsl(var(--accent))',
        verydarkbrown: 'hsl(var(--foreground) / 0.8)',
        translucentwhite: 'hsl(var(--background) / 0.9)',
        darkgreen: 'hsl(var(--success) / 1.2)',
        paleblue: 'hsl(var(--primary) / 0.4)',
        lightblue: 'hsl(var(--primary) / 0.4)',
        seagreen: 'hsl(var(--success) / 0.8)',
        silver: 'hsl(var(--muted-foreground) / 0.6)'
    };
    const key = lowerColor.replace(/ /g, '').replace(/\(.*\)/, '');
    return colorMap[key] || '#cccccc'; // Default grey
};


const Bracelet3DPreview: React.FC<Bracelet3DPreviewProps> = ({ beads }) => {
    const { t } = useLanguage();
    const radius = 80; // in pixels

    if (!beads || beads.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Gem className="mr-2 h-5 w-5 text-accent" />{t('bracelet3DPreview.title')}</CardTitle>
                    <CardDescription>{t('bracelet3DPreview.description')}</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">{t('bracelet3DPreview.emptyState')}</p>
                </CardContent>
            </Card>
        );
    }
    
    const angleStep = beads.length > 0 ? 360 / beads.length : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Gem className="mr-2 h-5 w-5 text-accent" />{t('bracelet3DPreview.title')}</CardTitle>
                <CardDescription>{t('bracelet3DPreview.description')}</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center relative">
                <div className="relative w-0 h-0">
                    {beads.map((bead, index) => {
                        const angle = angleStep * index;
                        const beadColor = colorNameToHex(bead.color || 'grey');
                        const sizeValue = bead.type === 'spacer' ? 12 : (bead.role === 'focal' ? 32 : 24);
                        const size = `${sizeValue}px`;
                        
                        return (
                            <div
                                key={index}
                                className="absolute rounded-full border-2 border-white/50 shadow-lg"
                                style={{
                                    width: size,
                                    height: size,
                                    background: beadColor,
                                    transform: `rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`,
                                    transformOrigin: '0 0',
                                    top: '50%',
                                    left: '50%',
                                    marginLeft: `-${sizeValue / 2}px`,
                                    marginTop: `-${sizeValue / 2}px`,
                                    transition: 'all 0.5s ease-in-out',
                                    zIndex: bead.role === 'focal' ? 10 : 5,
                                }}
                                title={bead.crystalType || 'Spacer'}
                            />
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default Bracelet3DPreview;

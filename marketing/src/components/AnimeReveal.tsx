import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface AnimeRevealProps {
    text: string;
    className?: string;
    tag?: 'h1' | 'h2' | 'p' | 'span';
}

export default function AnimeReveal({ text, className, tag: Tag = 'h1' }: AnimeRevealProps) {
    // Use a more generic type that covers HTMLHeadingElement and others
    const textRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!textRef.current) return;

        // Wrap each letter in a span
        textRef.current.innerHTML = textRef.current.textContent!.replace(
            /\S/g,
            "<span class='letter'>$&</span>"
        );

        anime.timeline({ loop: false })
            .add({
                targets: '.letter',
                translateY: [100, 0],
                translateZ: 0,
                opacity: [0, 1],
                easing: "easeOutExpo",
                duration: 1400,
                delay: (el: HTMLElement, i: number) => 300 + 30 * i
            });
    }, []);

    // Cast the ref to any to avoid the specific element type mismatch
    // or use React.createElement to avoid the TSX intrinsic element check issues with dynamic tags
    return React.createElement(Tag, {
        ref: textRef,
        className: `ml16 ${className} overflow-hidden inline-block`
    }, text);
}

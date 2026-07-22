'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

type ProductImageCarouselProps = {
  images: string[];
  alt: string;
  className?: string;
};

export function ProductImageCarousel({ images, alt, className }: ProductImageCarouselProps) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'bg-muted flex aspect-square items-center justify-center rounded-xl text-sm text-muted-foreground',
          className,
        )}
      >
        Sem imagem
      </div>
    );
  }

  const goTo = (next: number) => {
    setIndex((next + images.length) % images.length);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="bg-muted relative aspect-square overflow-hidden rounded-xl">
        <Image
          src={images[index]}
          alt={`${alt} — foto ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={index === 0}
        />

        {images.length > 1 ? (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full opacity-90"
              onClick={() => goTo(index - 1)}
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full opacity-90"
              onClick={() => goTo(index + 1)}
              aria-label="Próxima imagem"
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                'relative size-14 overflow-hidden rounded-md border-2 transition-colors',
                i === index ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100',
              )}
              aria-label={`Ver imagem ${i + 1}`}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="56px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

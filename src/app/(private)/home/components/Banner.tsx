import { Carousel } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Banner() {
  const isMobile = useIsMobile();
  const items = Array.from(
    { length: isMobile ? 1 : 4 },
    (_, i) => `Item ${i + 1}`,
  ); // Mock de itens para o carrossel

  return (
    <div className="relative flex w-full flex-col items-center">
      <Carousel
        className={cn(
          "grid w-full gap-4",
          isMobile ? "grid-cols-1" : "grid-cols-4",
        )}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex aspect-video flex-1 items-center justify-center rounded-md bg-lc-gray-light shadow-sm",
              // Em telas médias e maiores, cada item ocupa 1/4 do carrossel
            )}
          >
            <p className="text-center opacity-30">
              Espaço reservado para o marketing
            </p>
          </div>
        ))}
      </Carousel>
      <div className="flex items-center justify-center gap-2 pt-3">
        <div className="h-[11px] w-[11px] rounded-full bg-lc-secondary" />
        <div className="h-[9px] w-[9px] rounded-full bg-lc-secondary opacity-60" />
        <div className="h-[9px] w-[9px] rounded-full bg-lc-secondary opacity-60" />
      </div>
    </div>
  );
}

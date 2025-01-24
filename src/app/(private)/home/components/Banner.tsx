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
    <div className="relative w-full">
      <Carousel className="flex flex-1 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex aspect-video flex-1 items-center justify-center rounded-md bg-lc-gray-light shadow-sm",
              "md:w-1/4", // Em telas médias e maiores, cada item ocupa 1/4 do carrossel
            )}
          >
            <p className="text-center opacity-30">
              Espaço reservado para o marketing
            </p>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

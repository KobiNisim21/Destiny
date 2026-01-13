import { useEffect, useState } from "react";
import thumbnailImage from "@/assets/Rectangle 7.png";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const influencers = [
    { id: 1, image: thumbnailImage },
    { id: 2, image: thumbnailImage },
    { id: 3, image: thumbnailImage },
    { id: 4, image: thumbnailImage },
    { id: 5, image: thumbnailImage },
    { id: 6, image: thumbnailImage },
];

const Influencers = () => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });

        const interval = setInterval(() => {
            api.scrollNext();
        }, 3000);

        return () => clearInterval(interval);
    }, [api]);

    return (
        <section className="w-full flex flex-col justify-between items-center bg-[#F5F2F8]" dir="ltr" style={{ padding: '31px 0' }}>

            {/* Header */}
            <div className="text-center mb-8" dir="rtl">
                <h2 className="text-[#22222A] font-['Noto_Sans_Hebrew'] text-[40px] font-bold leading-tight">
                    הגיימרים הגדולים בארץ כבר התנסו ואהבו,
                </h2>
                <h2 className="font-['Noto_Sans_Hebrew'] text-[40px] font-bold leading-tight"
                    style={{
                        background: 'linear-gradient(90deg, #C097E8 0%, #9F19FF 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                    מה איתכם?
                </h2>
            </div>

            {/* Carousel */}
            <Carousel
                setApi={setApi}
                opts={{
                    align: "center",
                    loop: true,
                    direction: "rtl",
                }}
                className="w-full max-w-[1400px] px-4 md:px-10"
                dir="rtl"
            >
                <CarouselContent className="-ml-4">
                    {influencers.map((item) => (
                        <CarouselItem key={item.id} className="md:basis-1/3 pl-4 flex justify-center py-4">
                            <div style={{
                                display: 'flex',
                                width: '400px',
                                padding: '10px',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: '10px',
                                borderRadius: '27px',
                                border: '1px solid #C097E8',
                                backgroundColor: '#FFF',
                                boxShadow: '0px 4px 10px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{
                                    height: '250px',
                                    alignSelf: 'stretch',
                                    borderRadius: '23px',
                                    background: `url("${item.image}") lightgray 50% / cover no-repeat`,
                                    backgroundColor: '#D9D9D9',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {/* Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center group cursor-pointer">
                                        <div className="w-12 h-12 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 5V19L19 12L8 5Z" fill="white" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Pagination Dots */}
            <div className="flex gap-2 mt-4" dir="rtl">
                {Array.from({ length: count }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={cn(
                            "w-2.5 h-2.5 rounded-full transition-all duration-300",
                            current === index + 1
                                ? "bg-[#22222A] scale-125"
                                : "bg-[#D9D9D9] hover:bg-[#b0b0b0]"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

        </section>
    );
};

export default Influencers;

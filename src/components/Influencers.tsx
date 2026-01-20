import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import API_BASE_URL from "@/config";
import Autoplay from "embla-carousel-autoplay";

interface YouTubeVideo {
    id: string;
    videoId: string;
    title: string;
    thumbnail: string;
}

const Influencers = () => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Content Settings
                const contentRes = await fetch(`${API_BASE_URL}/api/content`);
                const contentData = await contentRes.json();
                setContent(contentData);

                // Fetch YouTube Videos
                // We use the channel handle from content settings if available, otherwise default serves from backend env but here we just hit the endpoint
                const res = await fetch(`${API_BASE_URL}/api/youtube/latest`);
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setVideos(data);
                } else {
                    setVideos([
                        { id: '1', videoId: 'dQw4w9WgXcQ', title: 'Video 1', thumbnail: 'https://placehold.co/600x400' },
                        { id: '2', videoId: 'dQw4w9WgXcQ', title: 'Video 2', thumbnail: 'https://placehold.co/600x400' },
                        { id: '3', videoId: 'dQw4w9WgXcQ', title: 'Video 3', thumbnail: 'https://placehold.co/600x400' },
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!api) {
            return;
        }

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap() + 1);
        };

        const onInit = () => {
            setCount(api.scrollSnapList().length);
            setCurrent(api.selectedScrollSnap() + 1);
        };

        onInit();
        api.on("select", onSelect);
        api.on("reInit", onInit);

        return () => {
            api.off("select", onSelect);
            api.off("reInit", onInit);
        };
    }, [api]);

    return (
        <section className="w-full flex flex-col justify-between items-center bg-[#F5F2F8]" dir="ltr" style={{ padding: '31px 0' }}>

            {/* Header */}
            <div className="text-center mb-8" dir="rtl">
                <h2 className="text-[#22222A] font-['Noto_Sans_Hebrew'] text-[40px] font-bold leading-tight">
                    {content?.youtubeTitle || "הגיימרים הגדולים בארץ כבר התנסו ואהבו,"}
                </h2>
                <h2 className="font-['Noto_Sans_Hebrew'] text-[40px] font-bold leading-tight"
                    style={{
                        background: 'linear-gradient(90deg, #C097E8 0%, #9F19FF 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                    {content?.youtubeSubtitle || "מה איתכם?"}
                </h2>
            </div>

            {/* Carousel */}
            <Carousel
                setApi={setApi}
                plugins={[
                    Autoplay({
                        delay: 3000,
                        stopOnInteraction: false,
                        stopOnMouseEnter: true,
                    }),
                ]}
                opts={{
                    align: "center",
                    loop: true,
                    direction: "rtl",
                }}
                className="w-full max-w-[1400px] px-4 md:px-10"
                dir="rtl"
            >
                <CarouselContent className="-ml-4">
                    {videos.map((video) => (
                        <CarouselItem key={video.id} className="md:basis-1/3 pl-4 flex justify-center py-4">
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
                                <div
                                    onClick={() => setSelectedVideo(video.videoId)}
                                    style={{
                                        height: '250px',
                                        alignSelf: 'stretch',
                                        borderRadius: '23px',
                                        background: `url("${video.thumbnail}") lightgray 50% / cover no-repeat`,
                                        backgroundColor: '#D9D9D9',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        cursor: 'pointer'
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

            {/* Video Modal */}
            <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
                <DialogContent className="sm:max-w-[800px] p-0 bg-black border-none overflow-hidden text-white">
                    <div className="aspect-video w-full">
                        {selectedVideo && (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

        </section>
    );
};

export default Influencers;

import React from 'react';
import { X } from 'lucide-react';
import { Card } from '../ui/Card';
import { useData } from '../../context/DataContext';

interface GalleryImage {
    id: number;
    seed: number;
    title: string;
    description: string;
    date: string;
    author: string;
}

const galleryImages: GalleryImage[] = [
    { id: 1, seed: 101, title: "Secteur Nord", description: "Zone d'extraction principale", date: "2026-01-05", author: "Jean K." },
    { id: 2, seed: 102, title: "Puits 3", description: "Foreuse en opération", date: "2026-01-04", author: "Marie M." },
    { id: 3, seed: 103, title: "Base Camp", description: "Vue aérienne du campement", date: "2026-01-03", author: "Pierre K." },
    { id: 4, seed: 104, title: "Zone Stockage", description: "Entrepôt de matériaux", date: "2026-01-02", author: "André M." },
];

export const GalleryGrid: React.FC = () => {
    const [selectedImage, setSelectedImage] = React.useState<GalleryImage | null>(null);

    return (
        <>
            <Card className="p-3 h-full flex flex-col">
                <h3 className="text-[11px] font-semibold text-txt-primary mb-2 truncate">Galerie de Chantier</h3>
                <div className="grid grid-cols-2 gap-1.5 flex-1">
                    {galleryImages.map((img) => (
                        <div
                            key={img.id}
                            className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img
                                src={`https://picsum.photos/seed/${img.seed}/120/120`}
                                alt={img.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-[9px] font-medium">{img.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Image Detail Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-semibold text-txt-primary">{selectedImage.title}</h3>
                            <button onClick={() => setSelectedImage(null)} className="text-txt-tertiary hover:text-txt-primary">
                                <X size={20} />
                            </button>
                        </div>
                        <img src={`https://picsum.photos/seed/${selectedImage.seed}/400/300`} alt={selectedImage.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <p className="text-sm text-txt-secondary mb-3">{selectedImage.description}</p>
                            <div className="flex justify-between text-xs text-txt-tertiary">
                                <span>📅 {selectedImage.date}</span>
                                <span>👤 {selectedImage.author}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GalleryGrid;

"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet + Next.js
const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Component to handle map center updates
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

interface MapProps {
    providers: any[];
    center?: [number, number];
    zoom?: number;
    onMarkerClick?: (provider: any) => void;
    cityCoordinates: { [key: string]: [number, number] };
}

export default function Map({ providers, center = [20.5937, 78.9629], zoom = 5, onMarkerClick, cityCoordinates }: MapProps) {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", borderRadius: "2.5rem" }}
            zoomControl={false}
        >
            <ChangeView center={center} zoom={zoom} />
            
            {/* Google Maps Styled Tiles */}
            <TileLayer
                url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
            />

            {providers.map((provider) => {
                // Find coordinates for the sitter's city
                let sitterBasePos: [number, number] = center; // default to map center
                
                // Try to find the city in our coordinates map
                const providerCity = Object.keys(cityCoordinates).find(city => 
                    provider.location.toLowerCase().includes(city.split(',')[0].toLowerCase().trim())
                );

                if (providerCity) {
                    sitterBasePos = cityCoordinates[providerCity];
                }

                // Generate stable but random-looking coordinates around the sitter's city
                const seed = provider.id.charCodeAt(0) + provider.id.charCodeAt(provider.id.length - 1);
                const latOffset = ((seed % 100) - 50) / 1500; // slightly smaller spread
                const lngOffset = (((seed * 7) % 100) - 50) / 1500;
                
                const position: [number, number] = [
                    sitterBasePos[0] + latOffset,
                    sitterBasePos[1] + lngOffset
                ];

                return (
                    <Marker 
                        key={provider.id} 
                        position={position} 
                        icon={customIcon}
                        eventHandlers={{
                            click: () => onMarkerClick && onMarkerClick(provider),
                        }}
                    >
                        <Popup>
                            <div className="p-1 min-w-[120px]">
                                <h3 className="font-bold text-sm">{provider.name}</h3>
                                <p className="text-[10px] text-gray-500">{provider.type}</p>
                                <p className="text-[10px] text-gray-400 italic mb-1">{provider.location}</p>
                                <div className="flex justify-between items-center mt-2 border-t pt-1 border-gray-100">
                                    <span className="font-bold text-primary-main text-xs">₹{provider.price}</span>
                                    <span className="text-[10px] bg-gray-50 px-1.5 py-0.5 rounded">⭐ {provider.rating}</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}

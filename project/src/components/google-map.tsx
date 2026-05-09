
'use client';

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Centered on Sioux Falls, SD
const center = {
  lat: 43.5446,
  lng: -96.7311
};

interface MapProps {
  pickup?: string;
  dropoff?: string;
  assignedDriverName?: string;
  onRouteInfo?: (distance: string, duration: string) => void;
}

export function FallsMedrideMap({ pickup, dropoff, assignedDriverName, onRouteInfo }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAPopVpc1zn9cNUFLWSW2fv2hAxwxNfDjs"
  });

  const db = useFirestore();
  const driversQuery = useMemo(() => query(collection(db, "drivers"), where("status", "==", "online")), [db]);
  const { data: onlineDrivers } = useCollection(driversQuery);

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (isLoaded && pickup && dropoff) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: pickup,
          destination: dropoff,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            if (onRouteInfo && result.routes[0].legs[0]) {
              const leg = result.routes[0].legs[0];
              onRouteInfo(leg.distance?.text || '', leg.duration?.text || '');
            }
          }
        }
      );
    }
  }, [isLoaded, pickup, dropoff, onRouteInfo]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      mapTypeId="hybrid"
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_LEFT
        },
        fullscreenControl: true,
        rotateControl: true,
        scaleControl: true,
        gestureHandling: 'cooperative',
        styles: [] // Professional hybrid view doesn't need custom styles
      }}
    >
      {directions && (
        <DirectionsRenderer 
          directions={directions} 
          options={{ 
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#2273c3',
              strokeWeight: 8,
              strokeOpacity: 0.8
            }
          }} 
        />
      )}
      
      {onlineDrivers.map((driver: any) => {
        const isAssigned = assignedDriverName && driver.name.toLowerCase().includes(assignedDriverName.toLowerCase());
        return (
          <Marker 
            key={driver.id}
            position={{ lat: driver.lat, lng: driver.lng }}
            title={`${driver.name} ${isAssigned ? '(Assigned Driver)' : ''}`}
            icon={{
              url: isAssigned 
                ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png" 
                : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: isAssigned ? new google.maps.Size(48, 48) : new google.maps.Size(32, 32)
            }}
          />
        );
      })}
    </GoogleMap>
  ) : (
    <div className="w-full h-full bg-muted flex items-center justify-center">
      <p className="text-[10px] text-muted-foreground animate-pulse font-black tracking-[0.3em] uppercase">Initializing Satellite Network...</p>
    </div>
  );
}

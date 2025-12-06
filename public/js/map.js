
    maplibregl.accessToken = mapToken;
    
    const map = new maplibregl.Map({
      container: 'map',
      style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,
      center: listing.geometry.coordinates, // starting place
      zoom: 9
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

  const marker = new maplibregl.Marker({color: "red"})
  .setLngLat(listing.geometry.coordinates) // [lng, lat]
  .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<h4>${listing.location}</h4><p>Exact location provided after booking!</p>`))
  .addTo(map);



 const lat =  listing.latitude ;
  const lng =  listing.longitude ;
  const title = "listing.title ";

  const lat = 21.1458;
  const lng = 79.0882;

  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup("Nagpur Location")
    .openPopup();

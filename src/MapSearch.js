import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapSearch = () => {
  const [address, setAddress] = useState('');
  const [position, setPosition] = useState([21.0285, 105.8542]); // Hà Nội mặc định

  const handleSearch = async () => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`, {
      headers: {
        "User-Agent": "address-map-react (https://yourdomain.com)",
        "Accept-Language": "vi"
      }
    });
    const data = await response.json();
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      setPosition([lat, lon]);
    } else {
      alert("Không tìm thấy địa chỉ!");
    }
  } catch (error) {
    alert("Lỗi khi tìm kiếm địa chỉ. Vui lòng thử lại sau.");
    console.error(error);
  }
};


  return (
    <div>
      <div style={{ padding: '1rem' }}>
        <input
          type="text"
          value={address}
          placeholder="Nhập địa chỉ (VD: Huế, 1 Tràng Tiền)"
          onChange={(e) => setAddress(e.target.value)}
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px 12px' }}>Tìm</button>
      </div>
      
      <MapContainer center={position} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={position}>
          <Popup>{address || 'Vị trí mặc định'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapSearch;

const dbPool = require('../config/db');

// Haversine formula to calculate distance between two lat/lng coordinates in km
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

// @desc    Get disposal locations (optionally nearest to user)
// @route   GET /api/locations
// @access  Public
const getLocations = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const [rows] = await dbPool.execute('SELECT * FROM disposal_locations');
    
    let locations = rows.map(row => {
      let parsedTypes = [];
      try {
        if (typeof row.accepted_waste_types === 'string') {
          parsedTypes = JSON.parse(row.accepted_waste_types);
        } else {
          parsedTypes = row.accepted_waste_types;
        }
      } catch (e) {
        parsedTypes = row.accepted_waste_types || [];
      }

      return {
        ...row,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        accepted_waste_types: parsedTypes
      };
    });

    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      // Calculate distance for each location
      locations = locations.map(loc => {
        const distance = getDistanceFromLatLonInKm(userLat, userLng, loc.latitude, loc.longitude);
        return {
          ...loc,
          distance: distance // in km
        };
      });

      // --- IMPLEMENTASI DIVIDE & CONQUER (MERGE SORT) ---
      // Fungsi untuk menggabungkan dua array yang sudah terurut (Conquer)
      const merge = (left, right) => {
        let sortedArray = [];
        let i = 0, j = 0;
        
        while (i < left.length && j < right.length) {
          if (left[i].distance <= right[j].distance) {
            sortedArray.push(left[i]);
            i++;
          } else {
            sortedArray.push(right[j]);
            j++;
          }
        }
        return [...sortedArray, ...left.slice(i), ...right.slice(j)];
      };

      // Fungsi rekursif membagi array menjadi dua (Divide)
      const mergeSort = (arr) => {
        if (arr.length <= 1) return arr;
        
        const mid = Math.floor(arr.length / 2);
        const left = mergeSort(arr.slice(0, mid));
        const right = mergeSort(arr.slice(mid));
        
        return merge(left, right);
      };

      // Sort by distance (nearest first) menggunakan Merge Sort
      locations = mergeSort(locations);
    }

    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data lokasi.' });
  }
};

module.exports = {
  getLocations
};

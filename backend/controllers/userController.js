const db = require('../config/db');

exports.addPoints = async (req, res) => {
  try {
    const { userId, pointsToAdd } = req.body;
    
    if (!userId || !pointsToAdd) {
      return res.status(400).json({ message: 'Missing userId or pointsToAdd' });
    }

    // Update poin di database
    await db.execute('UPDATE users SET points = points + ? WHERE id = ?', [pointsToAdd, userId]);
    
    // Ambil data terbaru
    const [users] = await db.execute('SELECT id, name, email, points FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Points updated successfully', user: users[0] });

  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId, name } = req.body;
    
    if (!userId || !name) {
      return res.status(400).json({ message: 'Missing userId or name' });
    }

    await db.execute('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
    const [users] = await db.execute('SELECT id, name, email, points FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: users[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

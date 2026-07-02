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
    const [users] = await db.execute('SELECT id, name, email, points, exp, level, role FROM users WHERE id = ?', [userId]);
    
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
    const [users] = await db.execute('SELECT id, name, email, points, exp, level, role FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: users[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const [users] = await db.execute("SELECT id, name, points, exp, level FROM users WHERE role != 'admin' ORDER BY level DESC, exp DESC, points DESC LIMIT 10");
    res.json(users);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const [users] = await db.execute("SELECT id, name, email, points, exp, level, created_at, role FROM users WHERE role != 'admin' ORDER BY level DESC, exp DESC");
    const [logs] = await db.execute('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 50');
    res.json({ users, logs });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // Hapus user
    await db.execute('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateStats = async (req, res) => {
  try {
    const { userId, pointsToAdd, exp, level } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }

    // Update points (increment), exp dan level (set langsung)
    await db.execute(
      'UPDATE users SET points = points + ?, exp = ?, level = ? WHERE id = ?',
      [pointsToAdd || 0, exp || 0, level || 1, userId]
    );

    // Ambil data terbaru
    const [users] = await db.execute('SELECT id, name, email, points, exp, level, role FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Stats updated successfully', user: users[0] });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

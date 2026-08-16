const User = require('../models/User');

exports.searchUsers = async (req,res) => {
    try{
        const {query} = req.query;

        if (!query || query.trim() === '') {
            return res.status(200).json([]);
        }

        const users = await User.find({
            username: { $regex: query, $options: 'i' }, //case insensitive search and partial match
            _id: { $ne: req.userId } // Exclude the current user from the search results}
        }).select('username profilePicture') // Select only the username and profile picture fields
          .limit(10); // Limit the number of results to 10

        res.status(200).json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
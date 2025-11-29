import User from '../models/User.model.js';

class UserService {

    async createUser(user_data) {
        const user = new User(user_data);
        return await user.save();
    }

    async getUsers() {
        return await User.find({});
    }

    async getUserById(user_id) {
        return await User.findOne({ user_id: user_id });
    }

    async updateUser(user_id, update_data) {
        return await User.findOneAndUpdate({ user_id: user_id }, update_data, { new: true });
    }

    async deleteUser(user_id) {
        return await User.findOneAndDelete({ user_id: user_id });
    }

}

export default new UserService();
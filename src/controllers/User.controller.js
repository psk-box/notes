import UserService from "../services/User.service.js";

class UserController {

    async createUser(req, res) {
        try {
            const user_data = req.body;

            if( !user_data.user_name || !user_data.age || !user_data.email || !user_data.password ) {
                return  res.status(400).json({ message: "Missing required fields" });
            }

            const newUser = await UserService.createUser(user_data);
            res.status(201).json({ message: "User created successfully", user: newUser });
        } catch (error) {
            res.status(500).json({ message: "Error creating user", error: error.message });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await UserService.getUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error fetching users", error: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const user_id = req.params.user_id;

            if (!user_id) {
                return res.status(400).json({ message: "User ID is required" });
            }

            if( isNaN(user_id) ) {
                return res.status(400).json({ message: "User ID must be a number" });
            }

            const user = await UserService.getUserById(user_id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching user", error: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const user_id = req.params.user_id;
            const update_data = req.body;
            const updatedUser = await UserService.updateUser(user_id, update_data);
            if (updatedUser) {
                res.status(200).json({ message: "User updated successfully", user: updatedUser });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error updating user", error: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const user_id = req.params.user_id;
            const deletedUser = await UserService.deleteUser(user_id);
            if (deletedUser) {
                res.status(200).json({ message: "User deleted successfully" });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error deleting user", error: error.message });
        }
    }

}

export default new UserController();
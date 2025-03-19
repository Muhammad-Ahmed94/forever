import userModel from "../../model/user.model.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) return res.status(400).json({ message: 'Enter details to signup'});

    try {
        const userFound = await userModel.findOne({ email });
        if (userFound) return res.status(400).json({ message: "user already exists" });

        const user = await userModel.create({ name, email, password })
        res.status(201).json({ user, message: 'user created successfully'});
    } catch (error) {
        
    }
};

export const login = async (req, res) => {res.send("login route")};

export const logout = async (req, res) => {res.send("logout route")};

const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {

                const userData = await User.findOne({ _id: context.user._id })
                    .select("-__v -password")
                console.log(userData);
                return userData;
            }

            throw new AuthenticationError("Not logged in");
        },
    },
    Mutation: {
        createUser: async (parent, { username, email, password }, context) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },
        loginUser: async (parent, { email, password }, context) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError(
                    "No user found with this email address"
                );
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Incorrect password");
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { input }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true }
                ).populate('savedBooks');

                return updatedUser;
            }

            throw new AuthenticationError("You need to be logged in!");
        },
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                ).populate('savedBooks');

                return updatedUser;
            }

            throw new AuthenticationError("You need to be logged in!");
        },
    },
};

module.exports = resolvers;
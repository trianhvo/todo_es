

async function deleteUser(req, res) {

    try {
        await client.delete({
            index,
            type: 'users',
            id: req.userId,
        });
        res.status(200).json({ message: "User deleted" })
    }
    catch (error) {
        return res.status(400).json({ message: "Delete failed" })
    }
}



module.exports = {
    deleteUser,
    
}